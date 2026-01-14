import type { TaskOption } from "./TaskOption";

export interface Task{
    id:number,
    lessonId:number,
    title:string,
    description:string,
    type:'quiz'|'code'|'text',
    order:number,
    language: string,
    correctOutput?:string,
    startCode?:string,
    createdAt:Date,
    updatedAt:Date,
    options?:TaskOption[]
    tempId?:number;
}