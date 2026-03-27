import {Router} from "express";
import { loginPage, postLogin, postLogout } from "../controllers/authController.js";

const router = Router();

router.use("/login", loginPage);
router.post("/login", postLogin);
router.use("/postLogout", postLogout);

export default router;