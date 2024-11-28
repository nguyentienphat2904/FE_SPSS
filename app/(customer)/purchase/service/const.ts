export const baseURL = 'http://localhost:3010/v1';
export const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMzQ1Iiwicm9sZSI6IkNVU1RPTUVSIiwiaWF0IjoxNzMwNzIyMTUyLCJleHAiOjE3NjIyNTgxNTJ9.4IS3uVRiN-42dae-HeX9S3eH9DNITFU7YoSmfw_kJjM';

export interface Purchase {
    id: string;
    numPages: number;
    cost: number;
    status: string;
    customerId: string;
    updatedAt: Date;
    createdAt: Date;
}

export interface CreatePurchaseResponse {
    success: boolean;
    message: string;
    data: Purchase;
}

export interface GetPurchaseResponse {
    success: boolean;
    message: string;
    data: Purchase[];
}