// Controller for organiser-related pages and actions, such as managing courses and users
import bcrypt from 'bcrypt';

import { CourseModel } from '../models/courseModel.js';
import { BookingModel } from '../models/bookingModel.js';
import { UserModel } from '../models/userModel.js';

// Function to render the organiser dashboard page
export const dashboardPage = async(req, res, next) => {
    try {
        // Fetch all courses from the database
        const courses = await CourseModel.list();
        // Render the dashboard with course list
        res.render('organiser/dashboard', {
            title: 'Organiser Dashboard',
            courses: courses.map((c) => ({id: c._id, title: c.title, level: c.level, type: c.type})),
        });
    } catch(error) {
        next(error);
    }

};

// Function to render the add course page
export const addCoursePage = async(req, res) => {
    res.render('organiser/add_Course', {title: 'Add Course'});
}

// Function to handle adding a new course
export const postAddCourse = async(req, res, next) => {
    try {
        // Extract course details from request body
        const {title, description, level, type, allowDropIn, startDate, endDate} = req.body;
        // Create the course in the database
        await CourseModel.create({
            title,
            description,
            level,
            type,
            allowDropIn: allowDropIn === 'on',
            startDate,
            endDate,
            sessionIds: [],
        });
        // Redirect to organiser dashboard
        res.redirect('/organiser')
    } catch(error) {
        next(error);
    }
}

// Function to render the edit course page
export const editCoursePage = async(req, res, next) => {
    try {
        // Find the course by ID
        const course = await CourseModel.findById(req.params.id);
        if (!course)
            return res.status(404).render('error', {title: 'Not Found', message: 'Course not found'});
        // Render the edit page with course data
        res.render('organiser/edit_Course', {
            title: 'Edit Course',
            course: {
                id: course._id,
                title: course.title,
                description: course.description,
                level: course.level,
                type: course.type,
                allowDropIn: course.allowDropIn,
                startDate: course.startDate,
                endDate: course.endDate,
                isLevelBeginner: course.level === 'beginner',
                isLevelIntermediate: course.level === 'intermediate',
                isLevelAdvanced: course.level === 'advanced',
                isTypeWeekly: course.type === 'WEEKLY_BLOCK',
                isTypeWeekend: course.type === 'WEEKEND_WORKSHOP',
                isAllowDropIn: course.allowDropIn === true,
            }
        });
    } catch(error) {
        next(error);
    }
}

// Function to handle editing a course
export const postEditCourse = async(req, res, next) => {
    try {
        // Extract updated course details
        const { title, description, level, type, allowDropIn, startDate, endDate } = req.body;
        // Update the course in the database
        await CourseModel.update(req.params.id, {
            title,
            description,
            level,
            type,
            allowDropIn: allowDropIn === 'on',
            startDate,
            endDate,
        });
        // Redirect to organiser dashboard
        res.redirect('/organiser');
    } catch (err) {
        next(err);
    }
}

// Function to delete a course
export const deleteCourse = async(req, res, next) => {
    try {
        // Delete the course from the database
        await CourseModel.delete(req.params.id);
        // Redirect to organiser dashboard
        res.redirect('/organiser');
    } catch (err) {
        next(err);
    }

}

// Function to render the class list page for a course
export const classListPage = async(req, res, next) => {
    try {
        // Find the course by ID
        const course = await CourseModel.findById(req.params.id);
        if (!course)
            return res.status(404).render('error', {title: 'Not Found', message: 'Course not found'});
        // Find all bookings for the course
        const bookings = await BookingModel.findByCourse(req.params.id);
        // Enrich bookings with user information
        const bookingsWithUsers = await Promise.all(
            bookings.map(async (b) => {
                const user = await UserModel.findById(b.userId);
                return {
                    id: b._id,
                    userId: b.userId,
                    userName: user ? user.name : 'Unknown',
                    type: b.type,
                    status: b.status,
                    createdAt: b.createdAt,
                }
            })
        )
        // Render the class list page
        res.render('organiser/class_list', {
            title: `Class List – ${course.title}`,
            course: {id: course._id, title: course.title},
            bookings: bookingsWithUsers,

        });
    } catch(error) {
        next(error);
    }
};

// Function to render the users management page
export const usersPage = async(req, res, next) => {
    try {
        // Fetch all users
        const users = await UserModel.findAll();
        // Render the users page
        res.render('organiser/users', {
            title: 'Manage Users',
            users: users.map((u) => ({
                id: u._id,
                name: u.name,
                email: u.email,
                role: u.role,
                isSelf: u.id === req.user._id,
            })),
        });
    } catch(error) {
        next(error);
    }
}

// Function to delete a user
export const deleteUser = async(req, res, next) => {
    try {
        // Delete the user from the database
        await UserModel.delete(req.params.id);
        // Redirect to users page
        res.redirect('/organiser/users');
    } catch(error) {
        next(error);
    }
}

// Function to render the add organiser page
export const addOrganiserPage = async(req, res) => {
    res.render('organiser/add_Organiser', {title: 'Add Organiser'});
};

// Function to handle adding a new organiser
export const postAddOrganiser = async (req, res, next) => {
    try {
        // Extract name and email from request
        const {name, email} = req.body;
        // Hash a default password
        const password = await bcrypt.hash('change', 10);
        // Create the organiser user
        await UserModel.create({ name, email, password, role: 'organiser' });
        // Redirect to users page
        res.redirect('/organiser/users');
    }catch(error) {
        next(error);
    }
}