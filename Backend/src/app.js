import express from "express"
import viewRouter from "./routes/view.router.js"
import productRouter from "./routes/products.router.js"
import cartRouter from "./routes/carts.router.js"
import { __dirname } from "./utils.js"
import handlebars from "express-handlebars"
import { Server } from "socket.io"
import cookieParser from 'cookie-parser'
//import connectToDB from "./config/configServer.js"
import session from "express-session"
//socketservers
import socketProducts from "./listeners/socketProducts.js"
import socketChatServer from "./listeners/socketChatServer.js"
import MongoStore from 'connect-mongo'
import dbRouter from "./routes/db.router.js"
import passport from "passport"
import initializePassport from "./passport/passport.config.js"
import { router as sessionsRouter } from './routes/sessions.router.js'
import { initPassportGit } from "./passport/passportGit.config.js"
import config from './config/config.js';
import mockingRouter from "./routes/mocking.router.js";
import program from "./process.js";
import MongoSingleton from "./config/mongoDB-singleton.js";
import { addLogger, logger } from "./config/logger-config.js";
import emailRouter from "./routes/email.router.js";
import paymentRouter from "./routes/payments.router.js";
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUIExpress from 'swagger-ui-express'
import userRouter from "./routes/user.router.js"
import { cloudinaryConfig } from "./config/config.js";
import cors from 'cors';

const PORT = program.opts().p === 8080 ? config.PORT : program.opts().p;

const app = express()

const httpServer = app.listen(PORT, () => {
    try {
        logger.info(`Listening to the port ${PORT}\nAcceder a:`);
        logger.info(`\t1). http://localhost:${PORT}/`)
    } catch (err) {
        logger.info(err);
    }
});

// Configuracion MongoSingleton
const mongoInstance = async () => {
    try {
        await MongoSingleton.getInstance();
    } catch (error) {
        logger.error(error.message)
    }
};
mongoInstance();
initPassportGit()

//Documentación Swagger
const swaggerOptions = {
    definition: {
        openapi: "3.0.1",
        info: {
            title: "Documentación API FitnesStore",
            description: "Documentación de aplicación FitnesStore"
        }
    },
    apis: [`${__dirname}/docs/**/*.yaml`]
}
const specs = swaggerJsDoc(swaggerOptions)
app.use('/apidocs', swaggerUIExpress.serve, swaggerUIExpress.setup(specs))
app.use(cors())
app.use('*', cloudinaryConfig)

app.use(addLogger)

app.use(express.static(__dirname + "/public"))

app.use(cookieParser("CoderCookie"))
app.use(session({
    store: MongoStore.create({
        mongoUrl: config.mongo_url,
        //mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true }, //*** CON ESTO TIRA 2 ERRORES ***
        ttl: 3 * 60 * 60
    }),
    secret: config.SECRET,
    resave: true,
    saveUninitialized: true
}))

app.use('/api/email/css', express.static(__dirname + "/public/css"))
initializePassport()
app.use(passport.initialize())
app.use(passport.session())

app.use('*', cloudinaryConfig)


app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.engine("handlebars", handlebars.engine())
app.set('view engine', 'handlebars');
app.set("views", __dirname + "/views")


app.get('/setSession', (req, res) => {
    req.session.user = 'userName',
        req.session.admin = true
    res.send('Usuario Logueado')
})

app.get('/favicon.ico', (req, res) => res.status(204).end());

app.get('/getSession', (req, res) => {
    res.send(req.session.user)
})

app.get('/setCookies', (req, res) => {
    res.cookie('CoderCookie', { user: config.EMAIL }, {}).send('cookie creada');
});

app.get('/getCookies', (req, res) => {
    res.send(req.cookies)
});

app.use("/api", productRouter)
app.use("/api/users", userRouter)
app.use("/api", cartRouter)
app.use("/", viewRouter)
app.use("/", dbRouter)
app.use('/sessions', sessionsRouter)
app.use("/api/email", emailRouter);
app.use("/api/payments", paymentRouter);


//Route Mocking
app.use('/api', mockingRouter);

// Loggers Endpoint Test
app.get('/loggerTest', (req, res) => {
    req.logger.fatal("Prueba de log level fatal --> en Endpoint");
    req.logger.error("Prueba de log level error --> en Endpoint");
    req.logger.warning("Prueba de log level warning --> en Endpoint");
    req.logger.info("Prueba de log level info --> en Endpoint");
    req.logger.http("Prueba de log level http --> en Endpoint");
    req.logger.debug("Prueba de log level debug --> en Endpoint");
    res.send("Prueba de logger!");
})


const socketServer = new Server(httpServer)
socketProducts(socketServer)
socketChatServer(socketServer)

export default app;