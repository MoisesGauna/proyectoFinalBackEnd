import passport from "passport";
import { userService } from "../repository/index.js";
import { dataUri } from "../utils.js";
import { v2 } from "../config/config.js";


class usersControllers {

    static home = async (req, res) => {
        res.render('home')
    }
    static chat = async (req, res) => {
        res.render('chat')
    }
    static login = async (req, res) => {
        res.render('login')
    }
    static account = async (req, res) => {
        const logUser = req.session.user
        const userDate = await userService.getUsers(logUser.username)
        const user = userDate.toObject()

        res.render('account', { user })
    }
    static logout = async (req, res) => {
        const user = req.session.user
        req.session.destroy(async(err) => {
            if (err) res.send('Failed Logout')
                
                const time = `${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}`;
                const userLog = await userService.getUsers(user.username)
                const userID = userLog._id
                const timeLogout = (time + " - " + "Logout")
                console.log(timeLogout)
                const resp = await userService.updateUser(userID, {last_connection: timeLogout })
            res.redirect('/')
        })
    }
    
    static register = async (req, res) => {
        res.render('register')
    }
    static failLogin = async (req, res) => {
        res.send({ error: "Failed login Strategy" })
    }

    static failedregister = async (req, res) => {
        res.send({ error: "Failed Strategy" })
    }
    static registerOk = async (req, res) => {
        res.redirect('/login')
    }
    static ressetPass = async (req, res) => {
        res.render('/emailPassword', {
            fileCss: "styles.css",
        })
    }



    static logindb = async (req, res, next) => {
        passport.authenticate('login', async (err, user, info) => {
            try {
                if (err) {
                    return next(err);
                }
                if (!user) {
                    if (info.message === 'Invalid credentials') {
                        return res.render('login', { error: "Invalid credentials" });
                    } else {
                        return res.status(401).render('login', { error: "User not found" });
                    }
                }
                req.login(user, async (loginErr) => {
                    if (loginErr) {
                        return next(loginErr);
                    }
                    req.session.user = {
                        username: user.username,
                        name: user.name,
                        tel: user.tel,
                        lastname: user.lastname,
                    };
                    const time = `${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}`;
                    const userLog = await userService.getUsers(user.username)
                    const userID = userLog._id
                    const timeLogin = (time + " - " + "Login")
                    const resp = await userService.updateUser(userID, {last_connection: timeLogin })
                    return res.redirect('/productos')
                });
            } catch (error) {
                return next(error);
            }
        })(req, res, next);
    }

    static changeRoleController = async (req, res) => {
        const uid = req.params.uid;
        const userLog = req.session.user
        const user = await userService.getUsers(userLog.username)

        console.log(uid)
        try {
            if (user.rol === "Premium") {
                console.log("entro")
                await userService.updateUser(uid, { rol: "User", admin: false });
                return res
                    .status(200)
                    .send({ message: 'Rol modificado a "User" correctamente.' });
            }

            const userInfo = await userService.getUser({
                _id: uid,
                documents: {
                    $elemMatch: { name: "Identificacion" },
                    $elemMatch: { name: "Domicilio" },
                    $elemMatch: { name: "Cuenta" }
                },
            })
            console.log(userInfo)
            if (userInfo) {
                await userService.updateUser(uid, { rol: "Premium", admin: true });
                return res
                    .status(200)
                    .send({ message: 'Rol modificado a "Premium" correctamente.' });
            } else {
                return res.status(400).json({
                    error:
                        "Para ser usuario Premium es necesario completar toda la documentación",
                });
            }
        } catch (error) {
            res.status(404).json({
                error: error.message,
            });
        }
    };

    static documentsController = async (req, res) => {
        const {uid} = req.params;
        const files = req.files[0];
        const documento = req.body.doc;
        if(files){
            console.log(files)
            try {
                const file = dataUri(files).content;
                console.log(files)
                const result = await v2.uploader.upload(file, {
                    folder: "Ecommerce/Documents",
                });
                const image = result.url;
                const newDocument = {
                    name: documento,
                    reference: image,
                };
                const user = await userService.getUser({ _id: uid });
                let userDocuments = user.documents;
                const findDoc = userDocuments.find((doc) => doc.name === documento);
                if(!findDoc){
                    userDocuments = [...userDocuments, newDocument];
                }else{
                    const index = userDocuments.findIndex((doc) => doc.name === documento);
                    userDocuments[index] = newDocument;
                }
                await userService.updateUser(uid, { documents: userDocuments });
                return res.status(200).json({ 
                    messge: "Your documents has been uploded successfully to cloudinary", 
                });
            } catch (error) {
                res.status(500).json({
                    message: "someting went wrong while processing your request",
                    data:{
                        error,
                    }
                })
            }
        }else {
            return res.status(400).json({message: "No files were provided in the request"})
        }
    }
}



export { usersControllers }
