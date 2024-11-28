import { Feedback } from "@/app/(customer)/response/service/const";

export const baseURL = 'https://spss.tiendungcorp.com.vn/v1';
export const spsoToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMzQ1Iiwicm9sZSI6IlNQU08iLCJpYXQiOjE3MzIyNDU2NDgsImV4cCI6MTczNTg0NTY0OH0.hpRDryeF8NNelQIeCjQNP7kWLCvHCVKjwOi2PVAfYz8';

export interface IResponse {
    spsoId: string;
    feedbackId: string;
    content: string;
    createdAt: Date | string;
    updatedAt: Date | string;
    feedback: Feedback | null;
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