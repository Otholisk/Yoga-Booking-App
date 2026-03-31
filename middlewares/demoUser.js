// middlewares/demoUser.js
import { UserModel } from '../models/userModel.js';

export const attachUser = async (req, res, next) => {
  try {
    const userId = req.session?.userId;
    if (userId) {
      const user = await UserModel.findById(userId);
      req.user = user || null;
      res.locals.user = user ? { ...user, isOrganiser: user.role === 'organiser' } : null;
    } else {
      req.user = null;
      res.locals.user = null;
    }
    next();
  } catch (err) {
    next(err);
  }
};
