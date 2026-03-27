// controllers/bookingController.js
import {
  bookCourseForUser,
  bookSessionForUser,
} from "../services/bookingService.js";
import { BookingModel } from "../models/bookingModel.js";
import { SessionModel } from "../models/sessionModel.js";

export const bookCourse = async (req, res, next) => {
  try {
    const { courseId } = req.body;
    const booking = await bookCourseForUser(req.user._id, courseId);
    res.status(201).json({ booking });
  } catch (error) {
    next(error)
  }
};

export const bookSession = async (req, res, next) => {
  try {
    const { sessionId } = req.body;
    const booking = await bookSessionForUser(req.user._id, sessionId);
    res.status(201).json({ booking });
  } catch (error) {
    next(error)
  }
};

export const cancelBooking = async (req, res, next) => {
  try {
    const { bookingId } = req.params;
    const booking = await BookingModel.findById(bookingId);
    if (!booking)
      return res.status(404).json({ error: "Booking not found" });
    if (booking.status === "CANCELLED")
      return res.json({ booking });

    if (booking.status === "CONFIRMED") {
      for (const sid of booking.sessionIds) {
        await SessionModel.incrementBookedCount(sid, -1);
      }
    }
    const updated = await BookingModel.cancel(bookingId);
    res.json({ booking: updated });
  } catch (error) {
    next(error)
  }
};
