// Controller for handling the courses list page with filtering, searching, and pagination
import { CourseModel } from '../models/courseModel.js';
import { SessionModel } from '../models/sessionModel.js';

// Helper function to format ISO date string to date only (e.g., "Jan 1, 2023")
const fmtDateOnly = (iso) =>
  iso
    ? new Date(iso).toLocaleDateString('en-GB', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : '';

// Helper function to format ISO date string to date and time (e.g., "Mon, Jan 1, 2023, 10:00")
const fmtDateTime = (iso) =>
  iso
    ? new Date(iso).toLocaleString('en-GB', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : 'TBA';

// Main function to handle the courses list page
export const coursesListPage = async (req, res, next) => {
  try {
    // Extract query parameters for filters and pagination
    const {
      level, // Filter by difficulty level
      type, // Filter by course type
      dropin, // Filter by drop-in availability
      q, // Search query for title or description
      page = '1', // Current page number (1-based)
      pageSize = '10', // Number of items per page
    } = req.query;

    // Initialise filter object for database query
    const filter = {};
    if (level) filter.level = level;
    if (type) filter.type = type;
    if (dropin === 'yes') filter.allowDropIn = true;
    if (dropin === 'no') filter.allowDropIn = false;

    // Retrieve courses from database based on filters
    let courses = await CourseModel.list(filter);

    // Perform client-side text search if query provided
    const needle = (q || '').trim().toLowerCase();
    if (needle) {
      courses = courses.filter(
        (c) =>
          c.title?.toLowerCase().includes(needle) ||
          c.description?.toLowerCase().includes(needle)
      );
    }

    // Sort courses by start date, then by title
    courses.sort((a, b) => {
      const ad = a.startDate
        ? new Date(a.startDate).getTime()
        : Number.MAX_SAFE_INTEGER;
      const bd = b.startDate
        ? new Date(b.startDate).getTime()
        : Number.MAX_SAFE_INTEGER;
      if (ad !== bd) return ad - bd;
      return (a.title || '').localeCompare(b.title || '');
    });

    // Calculate pagination details
    const p = Math.max(1, parseInt(page, 10) || 1);
    const ps = Math.max(1, parseInt(pageSize, 10) || 10);
    const total = courses.length;
    const totalPages = Math.max(1, Math.ceil(total / ps));
    const start = (p - 1) * ps;
    const pageItems = courses.slice(start, start + ps);

    // Enrich course data with session information
    const cards = await Promise.all(
      pageItems.map(async (c) => {
        const sessions = await SessionModel.listByCourse(c._id);
        const first = sessions[0];
        return {
          id: c._id,
          title: c.title,
          level: c.level,
          type: c.type,
          allowDropIn: c.allowDropIn,
          startDate: fmtDateOnly(c.startDate),
          endDate: fmtDateOnly(c.endDate),
          nextSession: first ? fmtDateTime(first.startDateTime) : 'TBA',
          sessionsCount: sessions.length,
          description: c.description,
        };
      })
    );

    // Prepare pagination object for the view
    const pagination = {
      page: p,
      pageSize: ps,
      total,
      totalPages,
      hasPrev: p > 1,
      hasNext: p < totalPages,
      prevLink: p > 1 ? buildLink(req, p - 1, ps) : null,
      nextLink: p < totalPages ? buildLink(req, p + 1, ps) : null,
    };

    // Render the courses page with data
    res.render('courses', {
      title: 'Courses',
      filters: {
        level,
        type,
        dropin,
        q,
      },
      courses: cards,
      pagination,
    });
  } catch (err) {
    next(err);
  }
};

// Helper function to build pagination links while preserving query parameters
function buildLink(req, page, pageSize) {
  // Construct base URL
  const url = new URL(
    `${req.protocol}://${req.get('host')}${req.originalUrl.split('?')[0]}`
  );
  // Copy existing query parameters
  const params = new URLSearchParams(req.query);
  // Update page and pageSize
  params.set('page', String(page));
  params.set('pageSize', String(pageSize));
  // Return the full URL with updated params
  return `${url.pathname}?${params.toString()}`;
}
