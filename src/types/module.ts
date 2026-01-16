import type { Lesson } from "./lesson"

export interface Module {
    id: number
    courseId: number
    title: string
    description?: string
    order: number
    createdAt: Date
    updatedAt: Date
    lessons: Partial<Lesson>[]
    tempId?:number;
}

export interface CreateModule{
    title:string,
    description?:string,
    order:number,
    lessons:Lesson[]
}