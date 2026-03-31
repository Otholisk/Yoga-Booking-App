// Routes for course-related API endpoints
import { Router } from 'express';
import { CourseModel } from '../models/courseModel.js';
import { SessionModel } from '../models/sessionModel.js';

// Create a new router instance
const router = Router();

// Route to list all courses
router.get('/', async (req, res, next) => {
  try {
  const courses = await CourseModel.list();
  res.json({courses});
  } catch (error){
  next(error);
  }
});

// Route to create a new course
router.post('/', async (req, res, next) => {
  try {
    const course = await CourseModel.create(req.body);
    res.status(201).json({course});
  } catch (error){
    next(error);
  }
});

// Route to get a specific course and its sessions
router.get('/:id', async (req, res, next) => {
  try {
    const course = await CourseModel.findById(req.params.id);
    if (!course)
      return res.status(404).json({error: 'Course not found'});
    const sessions = await SessionModel.listByCourse(req.params.id);
    res.json({course, sessions});
  } catch (error){
    next(error);
  }
});

// Export the router
export default router;
