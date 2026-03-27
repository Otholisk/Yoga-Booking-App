import {Router} from "express";
import { loginPage, postLogin, logout } from "../controllers/authController.js";

const router = Router();

router.use("/login", loginPage);
router.post("/login", postLogin);
router.use("/logout", logout);

export default router;