import bcrypt from 'bcrypt';
import { UserModel } from '../models/userModel.js';

// Function to render the login page
export const loginPage = (req, res) => {
    res.render('login', { title: 'Login' });
};

// Function to handle login POST request
export const postLogin = async (req, res, next) => {
    try {
        // Extract email and password from request body
        const {email, password} = req.body;
        // Find user by email in the database
        const user = await UserModel.findByEmail(email);
        // Check if user exists and password matches the hashed password
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.render('login', {title: 'Login', error: 'Invalid email or password'});
        }
        // Store user ID in session for authentication
        req.session.userId = user._id;
        // Redirect to home page after successful login
        res.redirect('/');
    } catch (error) {
        next(error);
    }
};

// Function to handle user logout
export const logout = (req, res, next) => {
    // Destroy the session to log out the user
    req.session.destroy((err) => {
        if (err) return next(err);
        // Redirect to login page after logout
        res.redirect('/login');
        });
};