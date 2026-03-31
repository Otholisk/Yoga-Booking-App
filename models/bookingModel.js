// Model for handling booking-related database operations
import { bookingsDb } from './_db.js';

export const BookingModel = {
  // Create a new booking with timestamp
  async create(booking) {
    return bookingsDb.insert({ ...booking, createdAt: new Date().toISOString() });
  },
  // Find a booking by its ID
  async findById(id) {
    return bookingsDb.findOne({ _id: id });
  },
  // List all bookings for a specific user, sorted by creation date descending
  async listByUser(userId) {
    return bookingsDb.find({ userId }).sort({ createdAt: -1 });
  },
  // Cancel a booking by updating its status
  async cancel(id) {
    await bookingsDb.update({ _id: id }, { $set: { status: 'CANCELLED' } });
    return this.findById(id);
  },
  // Find all bookings for a specific course
  async findByCourse(courseId) {
    return bookingsDb.find({ courseId });
  },
};
