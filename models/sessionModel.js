// Model for handling session-related database operations
import { sessionsDb } from './_db.js';

export const SessionModel = {
  // Create a new session
  async create(session) {
    return sessionsDb.insert(session);
  },
  // List sessions for a specific course, sorted by start date
  async listByCourse(courseId) {
    return sessionsDb.find({ courseId }).sort({ startDateTime: 1 });
  },
  // Find a session by its ID
  async findById(id) {
    return sessionsDb.findOne({ _id: id });
  },
  // Increment the booked count for a session
  async incrementBookedCount(id, delta = 1) {
    const s = await this.findById(id);
    if (!s) throw new Error('Session not found');
    const next = (s.bookedCount ?? 0) + delta;
    if (next < 0) throw new Error('Booked count cannot be negative');
    await sessionsDb.update({ _id: id }, { $set: { bookedCount: next } });
    return this.findById(id);
  }
};
