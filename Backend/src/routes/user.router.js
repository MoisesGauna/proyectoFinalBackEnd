import { Router } from "express";
import {usersControllers} from "../controllers/users.controllers.js"
import { multerUploads } from "../utils.js";

const router = Router()

router.post('/premium/:uid', usersControllers.changeRoleController );
router.post("/:uid/documents",multerUploads.array("file"),usersControllers.documentsController);  

export default router;