import {userService} from "../repository/index.js";



export const requireAuth = (req, res, next) => {
    if (req.session && req.session.user) {
        next();
    } else {
        res.redirect('/login');
    }
};

export const isAdmin = async (req, res, next) => {
    const userlog = req.session.user
    const us= userlog.username
    const user = await userService.getUsers(us);
    if (req.session && req.session.user && user.admin === true ) {
        next(); 
    } else {
        res.status(403).send('Acceso denegado. Debes ser administrador para acceder a esta página.');
    }
};


export const isNotAdmin = async (req, res, next) => {
    const userlog = req.session.user
    const us= userlog.username
    const user = await userService.getUsers(us);
    if (req.session && req.session.user && user.admin !== true ) {
        next(); 
    } else {
        res.status(403).send('Acceso denegado. Debes ser administrador para acceder a esta página.');
    }
};

// Middleware para pasar el objeto user a las vistas

export const setUserInLocals = async (req, res, next) => {
    if (req.session.user) {
        const userlog = req.session.user;
        const us= userlog.username
        const user = await userService.getUsers(us);
        
        if (user) {
            const { admin, name, rol } = user;
            res.locals.user = {
                admin: admin || null,
                name: name || null,
                rol: rol || null
            };
        } else {
            res.locals.user = null;
        }
    } else {
        res.locals.user = null;
    }
    next();
};

