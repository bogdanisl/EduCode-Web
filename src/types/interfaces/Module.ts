import type { Lesson } from "./Lesson"

export interface Module {
    id: number
    courseId: number
    title: string
    description?: string
    order: number
    createdAt: Date
    updatedAt: Date
    lessons: Partial<Lesson>[]
}

export interface CreateModule{
    title:string,
    description?:string,
    order:number,
    lessons:Lesson[]
}