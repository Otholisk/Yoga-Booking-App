// Model for handling user-related database operations
import { usersDb } from './_db.js';

export const UserModel = {
  // Create a new user
  async create(user) {
    return usersDb.insert(user);
  },
  // Find a user by email
  async findByEmail(email) {
    return usersDb.findOne({ email });
  },
  // Find a user by ID
  async findById(id) {
    return usersDb.findOne({ _id: id });
  },
  // Find all users
  async findAll() {
    return usersDb.find({});
  },
  // Update a user with changes
  async update(id, changes) {
    await usersDb.update({ _id: id }, { $set: changes });
    return usersDb.findOne({ _id: id });
  },
  // Delete a user by ID
  async delete(id) {
    return usersDb.remove({_id: id}, {});
  }
};
