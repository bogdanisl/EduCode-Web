import type { Module } from "./module";
import type { Task } from "./task";

export interface Lesson {
    id: number,
    moduleId: number,
    title: string,
    description: string,
    difficultyLevel: 'beginner' | 'intermediate' | 'advanced',
    order: number,
    createdAt: Date,
    updatedAt: Date,
    module:Module
    tasks:Task[]
    tempId?:number;
}