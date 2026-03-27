
// routes/bookings.js
import { Router } from 'express';
import { bookCourse, bookSession, cancelBooking } from '../controllers/bookingController.js';
import { requiredLogin } from '../middlewares/requireAuth.js';

const router = Router();

router.use(requiredLogin);
router.post('/course', bookCourse);
router.post('/session', bookSession);
router.delete('/:bookingId', cancelBooking);

export default router;


