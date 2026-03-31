import bcrypt from 'bcrypt';

import { CourseModel } from '../models/courseModel.js';
import { BookingModel } from '../models/bookingModel.js';
import { UserModel } from '../models/userModel.js';


export const dashboardPage = async(req, res, next) => {
    try {
        const courses = await CourseModel.list();
        res.render('organiser/dashboard', {
            title: 'Organiser Dashboard',
            courses: courses.map((c) => ({id: c._id, title: c.title, level: c.level, type: c.type})),
        });
    } catch(error) {
        next(error);
    }

};

export const addCoursePage = async(req, res) => {
    res.render('organiser/add_Course', {title: 'Add Course'});
}

export const postAddCourse = async(req, res, next) => {
    try {
        const {title, description, level, type, allowDropIn, startDate, endDate} = req.body;
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
        res.redirect('/organiser')
    } catch(error) {
        next(error);
    }
}

export const editCoursePage = async(req, res, next) => {
    try {
        const course = await CourseModel.findById(req.params.id);
        if (!course)
            return res.status(404).render('error', {title: 'Not Found', message: 'Course not found'});
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

export const postEditCourse = async(req, res, next) => {
    try {
        const { title, description, level, type, allowDropIn, startDate, endDate } = req.body;
        await CourseModel.update(req.params.id, {
            title,
            description,
            level,
            type,
            allowDropIn: allowDropIn === 'on',
            startDate,
            endDate,
        });
        res.redirect('/organiser');
    } catch (err) {
        next(err);
    }
}
export const deleteCourse = async(req, res, next) => {
    try {
        await CourseModel.delete(req.params.id);
        res.redirect('/organiser');
    } catch (err) {
        next(err);
    }

}

export const classListPage = async(req, res, next) => {
    try {
        const course = await CourseModel.findById(req.params.id);
        if (!course)
            return res.status(404).render('error', {title: 'Not Found', message: 'Course not found'});
        const bookings = await BookingModel.findByCourse(req.params.id);
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
        res.render('organiser/class_list', {
            title: `Class List – ${course.title}`,
            course: {id: course._id, title: course.title},
            bookings: bookingsWithUsers,

        });
    } catch(error) {
        next(error);
    }
};

export const usersPage = async(req, res, next) => {
    try {
        const users = await UserModel.findAll();
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

export const deleteUser = async(req, res, next) => {
    try {
        await UserModel.delete(req.params.id);
        res.redirect('/organiser/users');
    } catch(error) {
        next(error);
    }
}

export const addOrganiserPage = async(req, res) => {
    res.render('organiser/add_Organiser', {title: 'Add Organiser'});
};

export const postAddOrganiser = async (req, res, next) => {
    try {
        const {name, email} = req.body;
        const password = await bcrypt.hash('change', 10);
        await UserModel.create({ name, email, password, role: 'organiser' });
        res.redirect('/organiser/users');
    }catch(error) {
        next(error);
    }
}