import { Router } from "express";
import { __dirname } from "../utils.js";
import { requireAuth, isNotAdmin} from "../config/authMiddleware.js"
import express from 'express';
import path from 'path';
import passport from 'passport';
import {usersControllers} from "../controllers/users.controllers.js"
import { CartController } from "../controllers/carts.controllers.js";


const router = Router()

const setUserInLocals = (req, res, next) => {
    res.locals.user = req.session.user || null;
    next();
};
router.use(setUserInLocals);
router.use('/productos', express.static(path.join(__dirname, 'public')));

router.post('/register', passport.authenticate('register', { failureRedirect: '/failedregister' }), (req, res) => {
    res.status(302).send('Redirecting...');
    usersControllers.registerOk(req, res);
});
router.post('/login', usersControllers.logindb );
router.delete('/empty-cart', requireAuth, CartController.emptyCart);
router.delete('/delete-to-cart', requireAuth, CartController.deleteCart);
router.post('/add-to-cart', requireAuth, CartController.addToCart);
router.post("/cart/purchase",requireAuth, CartController.finishPurchaseController);
router.post("/:cid/purchase", CartController.createPurchaseController);
router.get('/ticket/:tid', CartController.getTicketController)

export default router
