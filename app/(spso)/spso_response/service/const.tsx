export const baseURL = 'https://spss.tiendungcorp.com.vn/v1';
export const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMzQ1Iiwicm9sZSI6IlNQU08iLCJpYXQiOjE3MzE5NDgzNzIsImV4cCI6MTczNTU0ODM3Mn0.Prjkuc8Pjr4x4YxuN7SN4QAiNAwAKm-VsIRM7aQcZow';

export interface IResponse {
    spsoId: string;
    feedbackId: string;
    content: string;
    createdAt: Date | string;
    updatedAt: Date | string;
}

export interface CRUResponseResponse {
    success: boolean;
    message: string;
    data: IResponse;
}

export interface GetResponsesResponse {
    success: boolean;
    message: string;
    data: IResponse[];
}