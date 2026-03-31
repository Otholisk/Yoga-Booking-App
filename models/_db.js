// Database setup and initialization using NeDB
import Datastore from 'nedb-promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { promises as fs } from 'fs';

// Get current file path for relative directory resolution
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Directory for database files, relative to this file
const dbDir = path.join(__dirname, '../db');

// Create database instances for different entities
export const usersDb = Datastore.create({
  filename: path.join(dbDir, 'users.db'),
  autoload: true,
});
export const coursesDb = Datastore.create({
  filename: path.join(dbDir, 'courses.db'),
  autoload: true,
});
export const sessionsDb = Datastore.create({
  filename: path.join(dbDir, 'sessions.db'),
  autoload: true,
});
export const bookingsDb = Datastore.create({
  filename: path.join(dbDir, 'bookings.db'),
  autoload: true,
});

// Function to initialize the database, called at startup
export async function initDb() {
  // Ensure the database directory exists
  await fs.mkdir(dbDir, { recursive: true });
  // Create indexes for efficient queries
  await usersDb.ensureIndex({ fieldName: 'email', unique: true });
  await sessionsDb.ensureIndex({ fieldName: 'courseId' });
}
