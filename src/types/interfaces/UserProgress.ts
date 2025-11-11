import type { User } from "../../context/AuthProvider";
import type { Course } from "./Course";
import type { Lesson } from "./Lesson";

export interface UserProgress{
    id:number,
    userId:number,
    courseId:number,
    progressPercent:number,
    lessonId:number,
    isCompleted:boolean,
    createdAt:Date,
    updatedAt:Date,
    lastViewedAt:Date,
    user:User,
    course:Course,
    lesson:Lesson
}