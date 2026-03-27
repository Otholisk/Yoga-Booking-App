import bcrypt from "bcrypt";
import { UserModel } from "../models/userModel.js";

export const loginPage = (req, res) => {
    res.render("login", { title: "Login" });
};

export const postLogin = async (req, res, next) => {
    try {
        const {email, password} = req.body;
        const user = await UserModel.findByEmail(email);
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.render("login", {title: "Login", error: "Invalid email or password"});
        }
        req.session.userId = user._id;
        res.redirect("/");
    } catch (error) {
        next(error);
    }
};

export const logout = (req, res, next) => {
    req.session.destroy((err) => {
        if (err) return next(err);
        res.redirect("/login");
        });
};