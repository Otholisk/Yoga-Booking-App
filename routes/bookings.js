// Routes for booking-related API endpoints
import { Router } from 'express';
import { bookCourse, bookSession, cancelBooking } from '../controllers/bookingController.js';
import { requiredLogin } from '../middlewares/requireAuth.js';

// Create a new router instance
const router = Router();

// Apply login requirement to all routes
router.use(requiredLogin);
// Route for booking a course
router.post('/course', bookCourse);
// Route for booking a session
router.post('/session', bookSession);
// Route for cancelling a booking
router.delete('/:bookingId', cancelBooking);

// Export the router
export default router;
