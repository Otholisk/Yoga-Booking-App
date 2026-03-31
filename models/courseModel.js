// Model for handling course-related database operations
import { coursesDb } from './_db.js';

export const CourseModel = {
  // Create a new course
  async create(course) {
    return coursesDb.insert(course);
  },
  // Find a course by its ID
  async findById(id) {
    return coursesDb.findOne({ _id: id });
  },
  // List courses with optional filter
  async list(filter = {}) {
    return coursesDb.find(filter);
  },
  // Update a course with given patch
  async update(id, patch) {
    await coursesDb.update({ _id: id }, { $set: patch });
    return this.findById(id);
  },
  // Delete a course by ID
  async delete(id) {
    return coursesDb.remove({ _id: id }, {});
  }
};
