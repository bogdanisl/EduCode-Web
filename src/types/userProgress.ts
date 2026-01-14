
import type { Course } from "./course";
import type { Lesson } from "./lesson";
import type { User } from "./user";

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