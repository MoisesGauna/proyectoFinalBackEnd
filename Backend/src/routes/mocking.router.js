import { Router } from "express";
import { getProductsMocking } from "../controllers/mocking.controllers.js";

const router = Router();

router.get("/mockingproducts", getProductsMocking);

export default router;
