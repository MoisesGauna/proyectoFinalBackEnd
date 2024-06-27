import { Router } from "express";
import { __dirname } from "../utils.js";
import { requireAuth, isAdmin, isNotAdmin } from "../config/authMiddleware.js"
import express from 'express';
import path from 'path';
import { setUserInLocals } from "../config/authMiddleware.js";
import { ProductController } from '../controllers/products.Controllers.js'
import { CartController } from '../controllers/carts.controllers.js'
import { usersControllers } from '../controllers/users.controllers.js'

const router = Router()

// Usar el middleware en todas las rutas
router.use(setUserInLocals);
router.use('/productos', express.static(path.join(__dirname, 'public')));

router.get("/failedregister", usersControllers.failedregister)
router.get("/faillogin", usersControllers.failLogin)
router.get("/chat", isNotAdmin, usersControllers.chat)
router.get('/', usersControllers.home)
router.get('/login', usersControllers.login)
router.get('/register', usersControllers.register)
router.get('/logout', usersControllers.logout)
router.get("/productos", requireAuth, ProductController.getProducts);
router.get("/realtimeproducts", requireAuth, isAdmin, ProductController.realtimeproducts)
router.get("/cart", requireAuth, CartController.getCartById)
router.get("/:pid", requireAuth, ProductController.getProductbyId)
router.get("/my/account", requireAuth, usersControllers.account)

export default router