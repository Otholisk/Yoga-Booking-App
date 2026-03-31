// Service for handling booking logic
import { CourseModel } from '../models/courseModel.js';
import { SessionModel } from '../models/sessionModel.js';
import { BookingModel } from '../models/bookingModel.js';

// Helper function to check if all sessions can be reserved
const canReserveAll = (sessions) =>
  sessions.every((s) => (s.bookedCount ?? 0) < (s.capacity ?? 0));

// Function to book an entire course for a user
export async function bookCourseForUser(userId, courseId) {
  // Find the course
  const course = await CourseModel.findById(courseId);
  if (!course) throw new Error('Course not found');
  // Get all sessions for the course
  const sessions = await SessionModel.listByCourse(courseId);
  if (sessions.length === 0) throw new Error('Course has no sessions');

  // Determine booking status
  let status = 'CONFIRMED';
  if (!canReserveAll(sessions)) {
    status = 'WAITLISTED';
  } else {
    // Increment booked count for each session
    for (const s of sessions) await SessionModel.incrementBookedCount(s._id, 1);
  }

  // Create the booking
  return BookingModel.create({
    userId,
    courseId,
    type: 'COURSE',
    sessionIds: sessions.map((s) => s._id),
    status,
  });
}

// Function to book a single session for a user
export async function bookSessionForUser(userId, sessionId) {
  // Find the session
  const session = await SessionModel.findById(sessionId);
  if (!session) throw new Error('Session not found');
  // Find the associated course
  const course = await CourseModel.findById(session.courseId);
  if (!course) throw new Error('Course not found');

  // Check if drop-in is allowed
  if (!course.allowDropIn && course.type === 'WEEKLY_BLOCK') {
    const err = new Error('Drop-in not allowed for this course');
    err.code = 'DROPIN_NOT_ALLOWED';
    throw err;
  }

  // Determine booking status
  let status = 'CONFIRMED';
  if ((session.bookedCount ?? 0) >= (session.capacity ?? 0)) {
    status = 'WAITLISTED';
  } else {
    // Increment booked count for the session
    await SessionModel.incrementBookedCount(session._id, 1);
  }

  // Create the booking
  return BookingModel.create({
    userId,
    courseId: course._id,
    type: 'SESSION',
    sessionIds: [session._id],
    status,
  });
}
