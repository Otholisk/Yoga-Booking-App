// controllers/bookingController.js
import {
  bookCourseForUser,
  bookSessionForUser,
} from '../services/bookingService.js';
import { BookingModel } from '../models/bookingModel.js';
import { SessionModel } from '../models/sessionModel.js';

// Function to handle booking a course
export const bookCourse = async (req, res, next) => {
  try {
    // Extract course ID from request body
    const { courseId } = req.body;
    // Call service to book the course for the current user
    const booking = await bookCourseForUser(req.user._id, courseId);
    // Respond with the created booking
    res.status(201).json({ booking });
  } catch (error) {
    next(error)
  }
};

// Function to handle booking a session
export const bookSession = async (req, res, next) => {
  try {
    // Extract session ID from request body
    const { sessionId } = req.body;
    // Call service to book the session for the current user
    const booking = await bookSessionForUser(req.user._id, sessionId);
    // Respond with the created booking
    res.status(201).json({ booking });
  } catch (error) {
    next(error)
  }
};

// Function to handle cancelling a booking
export const cancelBooking = async (req, res, next) => {
  try {
    // Get booking ID from URL parameters
    const { bookingId } = req.params;
    // Find the booking in the database
    const booking = await BookingModel.findById(bookingId);
    // If booking not found, return 404
    if (!booking)
      return res.status(404).json({ error: 'Booking not found' });
    // If already cancelled, return the booking
    if (booking.status === 'CANCELLED')
      return res.json({ booking });

    // If confirmed, decrement booked count for each session
    if (booking.status === 'CONFIRMED') {
      for (const sid of booking.sessionIds) {
        await SessionModel.incrementBookedCount(sid, -1);
      }
    }
    // Cancel the booking in the database
    const updated = await BookingModel.cancel(bookingId);
    // Return the updated booking
    res.json({ booking: updated });
  } catch (error) {
    next(error)
  }
};
