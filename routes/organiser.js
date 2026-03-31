// Routes for organiser-specific pages and actions
import {Router} from 'express';
import {requiredOrganiser} from '../middlewares/requireAuth.js';
import {
    dashboardPage,
    addCoursePage,
    postAddCourse,
    editCoursePage,
    postEditCourse,
    deleteCourse,
    classListPage,
    usersPage,
    deleteUser,
    addOrganiserPage,
    postAddOrganiser,
} from '../controllers/organiserController.js';

// Create a new router instance
const router = Router();
// Apply organiser requirement to all routes
router.use(requiredOrganiser);
// Route for organiser dashboard
router.get('/', dashboardPage);
// Routes for adding courses
router.get('/courses/add', addCoursePage);
router.post('/courses/add', postAddCourse);
// Routes for editing courses
router.get('/courses/:id/edit', editCoursePage);
router.post('/courses/:id/edit', postEditCourse);
// Route for deleting courses
router.post('/courses/:id/delete', deleteCourse);
// Route for viewing class list for a course
router.get('/courses/:id/classlist', classListPage);
// Route for managing users
router.get('/users', usersPage);
// Route for deleting users
router.post('/users/:id/delete', deleteUser);
// Routes for adding organisers
router.get('/users/add-organiser', addOrganiserPage);
router.post('/users/add-organiser', postAddOrganiser);

// Export the router
export default router;