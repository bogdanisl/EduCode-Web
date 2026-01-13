import type { Module } from "./Module";
import type { Category } from "./CourseCategory";

export interface Course{
    id:number,
    title:string,
    description:string,
    lead?:string,
    difficulty:'beginner'|'intermediate'|'advanced',
    categoryId:number,
    createdBy?:number,
    rating?:number,
    tags?:string[],
    modules:Module[],
    category:Category
}
