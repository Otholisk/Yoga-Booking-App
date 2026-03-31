// Middleware to attach user information to request and response locals based on session

import { UserModel } from '../models/userModel.js';

// Middleware function to attach user data from session
export const attachUser = async (req, res, next) => {
  try {
    // Get user ID from session
    const userId = req.session?.userId;
    if (userId) {
      // Find user in database
      const user = await UserModel.findById(userId);
      // Attach user to request
      req.user = user || null;
      // Attach user to response locals for templates, with organiser flag
      res.locals.user = user ? { ...user, isOrganiser: user.role === 'organiser' } : null;
    } else {
      // No user in session
      req.user = null;
      res.locals.user = null;
    }
    // Continue to next middleware
    next();
  } catch (err) {
    next(err);
  }
};
