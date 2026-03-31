// Controller for general view pages, such as home, course details, and booking
import { CourseModel } from '../models/courseModel.js';
import { SessionModel } from '../models/sessionModel.js';
import {
  bookCourseForUser,
  bookSessionForUser,
} from '../services/bookingService.js';
import { BookingModel } from '../models/bookingModel.js';

// Helper function to format ISO date string to full date and time
const fmtDate = (iso) =>
  new Date(iso).toLocaleString('en-GB', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
// Helper function to format ISO date string to date only
const fmtDateOnly = (iso) =>
  new Date(iso).toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

// Function to render the home page with list of courses
export const homePage = async (req, res, next) => {
  try {
    // Fetch all courses
    const courses = await CourseModel.list();
    // Enrich courses with session information
    const cards = await Promise.all(
      courses.map(async (c) => {
        const sessions = await SessionModel.listByCourse(c._id);
        const nextSession = sessions[0];
        return {
          id: c._id,
          title: c.title,
          level: c.level,
          type: c.type,
          allowDropIn: c.allowDropIn,
          startDate: c.startDate ? fmtDateOnly(c.startDate) : '',
          endDate: c.endDate ? fmtDateOnly(c.endDate) : '',
          nextSession: nextSession ? fmtDate(nextSession.startDateTime) : 'TBA',
          sessionsCount: sessions.length,
          description: c.description,
        };
      })
    );
    // Render the home page
    res.render('home', { title: 'Yoga Courses', courses: cards });
  } catch (err) {
    next(err);
  }
};

// Function to render the course detail page
export const courseDetailPage = async (req, res, next) => {
  try {
    // Get course ID from parameters
    const courseId = req.params.id;
    // Find the course
    const course = await CourseModel.findById(courseId);
    if (!course)
      return res
        .status(404)
        .render('error', { title: 'Not found', message: 'Course not found' });

    // Fetch sessions for the course
    const sessions = await SessionModel.listByCourse(courseId);
    // Format sessions for display
    const rows = sessions.map((s) => ({
      id: s._id,
      start: fmtDate(s.startDateTime),
      end: fmtDate(s.endDateTime),
      capacity: s.capacity,
      booked: s.bookedCount ?? 0,
      remaining: Math.max(0, (s.capacity ?? 0) - (s.bookedCount ?? 0)),
    }));

    // Render the course page
    res.render('course', {
      title: course.title,
      course: {
        id: course._id,
        title: course.title,
        level: course.level,
        type: course.type,
        allowDropIn: course.allowDropIn,
        startDate: course.startDate ? fmtDateOnly(course.startDate) : '',
        endDate: course.endDate ? fmtDateOnly(course.endDate) : '',
        description: course.description,
      },
      sessions: rows,
    });
  } catch (err) {
    next(err);
  }
};

// Function to handle booking a course
export const postBookCourse = async (req, res, next) => {
  try {
    // Get course ID from parameters
    const courseId = req.params.id;
    // Book the course for the user
    const booking = await bookCourseForUser(req.user._id, courseId);
    // Redirect to booking confirmation
    res.redirect(`/bookings/${booking._id}?status=${booking.status}`);
  } catch (error) {
    next(error)
  }
};

// Function to handle booking a session
export const postBookSession = async (req, res, next) => {
  try {
    // Get session ID from parameters
    const sessionId = req.params.id;
    // Book the session for the user
    const booking = await bookSessionForUser(req.user._id, sessionId);
    // Redirect to booking confirmation
    res.redirect(`/bookings/${booking._id}?status=${booking.status}`);
  } catch (error) {
    next(error);
  }
};

// Function to render the booking confirmation page
export const bookingConfirmationPage = async (req, res, next) => {
  try {
    // Get booking ID from parameters
    const bookingId = req.params.bookingId;
    // Find the booking
    const booking = await BookingModel.findById(bookingId);
    if (!booking)
      return res
        .status(404)
        .render('error', { title: 'Not found', message: 'Booking not found' });

    // Render the confirmation page
    res.render('booking_confirmation', {
      title: 'Booking confirmation',
      booking: {
        id: booking._id,
        type: booking.type,
        status: req.query.status || booking.status,
        createdAt: booking.createdAt ? fmtDate(booking.createdAt) : '',
      },
    });
  } catch (err) {
    next(err);
  }
};
