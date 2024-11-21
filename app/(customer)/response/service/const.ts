import { IResponse } from "@/app/(spso)/spso_response/service/const";

export const baseURL = 'https://spss.tiendungcorp.com.vn/v1';
export const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMzQ1Iiwicm9sZSI6IkNVU1RPTUVSIiwiaWF0IjoxNzMwNzIyMTUyLCJleHAiOjE3NjIyNTgxNTJ9.4IS3uVRiN-42dae-HeX9S3eH9DNITFU7YoSmfw_kJjM';

export interface Feedback {
    id: string;
    content: string;
    customerId: string;
    updatedAt: Date | string;
    createdAt: Date | string;
    response: boolean;
}

export interface CRUFeedbackResponse {
    success: boolean;
    message: string;
    data: Feedback;
}

export interface GetFeedbacksResponse {
    success: boolean;
    message: string;
    data: Feedback[];
}

