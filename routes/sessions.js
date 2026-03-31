// Routes for session-related API endpoints
import { Router } from 'express';
// Import SessionModel for database operations
import { SessionModel } from '../models/sessionModel.js';

// Create a new router instance
const router = Router();

// Route to create a new session
router.post('/', async (req, res) => {
  const session = await SessionModel.create({ ...req.body, bookedCount: 0 });
  res.status(201).json({ session });
});

// Route to get sessions by course ID
router.get('/by-course/:courseId', async (req, res) => {
  const sessions = await SessionModel.listByCourse(req.params.courseId);
  res.json({ sessions });
});

// Export the router
export default router;
