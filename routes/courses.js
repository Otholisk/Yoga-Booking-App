// routes/courses.js
import { Router } from "express";
import { CourseModel } from "../models/courseModel.js";
import { SessionModel } from "../models/sessionModel.js";

const router = Router();

// List courses
router.get("/", async (req, res, next) => {
  try {
  const courses = await CourseModel.list();
  res.json(courses);
  } catch (error){
  next(error);
  }
});

// Create course
router.post("/", async (req, res, next) => {
  try {
    const course = await CourseModel.create(req.body);
    res.status(201).json({course});
  } catch (error){
    next(error);
  }
});

// Get course + sessions
router.get("/:id", async (req, res, next) => {
  try {
    const course = await CourseModel.findById(req.params.id);
    if (!course) return res.status(404).json({error: "Course not found"});
    const sessions = await SessionModel.listByCourse(course._id);
    res.json({course, sessions});
  } catch (error){
    next(error);
  }
});

export default router;
