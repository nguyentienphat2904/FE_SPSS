import axios from "axios";
import { baseURL, token } from "@/app/(customer)/response/service/const";

import { CRUFeedbackResponse, GetFeedbacksResponse } from "@/app/(customer)/response/service/const";

async function createFeedback(content: string): Promise<CRUFeedbackResponse> {
    try {
        const body = {
            content: content
        };
        const response = await axios.post(
            `${baseURL}/feedback/create`,
            body,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            }
        );
        return response.data
    } catch (error: any) {
        throw error.response.data;
    }
}

async function getFeedbacks(): Promise<GetFeedbacksResponse> {
    try {
        const body = {
            "addition": {
                "sort": [],
                "page": null,
                "size": null,
                "group": []
            },
            "criteria": []
        };
        const response = await axios.post(
            `${baseURL}/feedback/search`,
            body,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            }
        );
        return response.data;
    } catch (error: any) {
        throw error.response.data;
    }
}

async function updateFeedback(id: string, content: string): Promise<CRUFeedbackResponse> {
    try {
        const body = {
            content: content
        };
        const response = await axios.put(
            `${baseURL}/feedback/update/${id}`,
            body,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            }
        );
        return response.data;
    } catch (error: any) {
        throw error.response.data;
    }
}

async function getFeedbackByID(id: string): Promise<CRUFeedbackResponse> {
    try {
        const response = await axios.get(
            `${baseURL}/feedback/search/${id}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            }
        );
        return response.data;
    } catch (error: any) {
        throw error.response.data
    }
}

export { createFeedback, getFeedbacks, getFeedbackByID, updateFeedback }