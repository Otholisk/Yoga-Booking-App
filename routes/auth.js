// Routes for authentication-related endpoints
import {Router} from 'express';
import { loginPage, postLogin, logout } from '../controllers/authController.js';

// Create a new router instance
const router = Router();

// Route for displaying the login page
router.get('/login', loginPage);
// Route for handling login form submission
router.post('/login', postLogin);
// Route for logging out the user
router.get('/logout', logout);

// Export the router
export default router;