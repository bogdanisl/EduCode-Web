
import type { Course } from "./Course";
import type { Lesson } from "./Lesson";
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