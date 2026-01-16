export interface Article{
    id: number;
    title: string;
    subtitle: string;
    content: string;
    photo: string;
    createdAt: Date | string;
    updatedAt: Date | string;
}