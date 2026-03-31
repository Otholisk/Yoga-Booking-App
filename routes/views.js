// Routes for view pages (SSR routes)
import { Router } from 'express';
import {
  homePage,
  courseDetailPage,
  postBookCourse,
  postBookSession,
  bookingConfirmationPage,
} from '../controllers/viewsController.js';
import { requiredLogin } from '../middlewares/requireAuth.js';

import { coursesListPage } from '../controllers/coursesListController.js';

// Create a new router instance
const router = Router();

// Route for home page
router.get('/', homePage);
// Route for courses list page
router.get('/courses', coursesListPage);
// Route for course detail page
router.get('/courses/:id', courseDetailPage);
// Route for booking a course (requires login)
router.post('/courses/:id/book', requiredLogin, postBookCourse);
// Route for booking a session (requires login)
router.post('/sessions/:id/book', requiredLogin, postBookSession);
// Route for booking confirmation page
router.get('/bookings/:bookingId', bookingConfirmationPage);

// Export the router
export default router;
