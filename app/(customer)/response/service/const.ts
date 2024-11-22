import { IResponse } from "@/app/(spso)/spso_response/service/const";

export const baseURL = 'https://spss.tiendungcorp.com.vn/v1';
export const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMzQ1Iiwicm9sZSI6IkNVU1RPTUVSIiwiaWF0IjoxNzMyMjQ1NjI3LCJleHAiOjE3MzU4NDU2Mjd9.cPy5nSbkoEmG_VY69Xw36PS6-2fLwKYVyknB2t6Jwz4';

export interface Feedback {
    id: string;
    content: string;
    customerId: string;
    updatedAt: Date | string;
    createdAt: Date | string;
    response: IResponse | null;
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