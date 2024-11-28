import axios from "axios";
import { baseURL, Feedback, token } from "@/app/(customer)/response/service/const";

import { CRUFeedbackResponse, GetFeedbacksResponse } from "@/app/(customer)/response/service/const";
import { IResponse } from "@/app/(spso)/spso_response/service/const";

import { getTokenFromCookie } from "@/utils/token";

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
                    Authorization: getTokenFromCookie(),
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
                    Authorization: getTokenFromCookie(),
                }
            }
        );
        return response.data;
    } catch (error: any) {
        throw error.response.data;
    }
}

async function getFeedbackAndResponse(): Promise<Feedback[]> {
    try {
        // Get Feedback
        const body = {
            "addition": {
                "sort": [],
                "page": null,
                "size": null,
                "group": []
            },
            "criteria": []
        };
        const feedback = await axios.post(
            `${baseURL}/feedback/search`,
            body,
            {
                headers: {
                    Authorization: getTokenFromCookie(),
                }
            }
        );
        const response = await axios.post(
            `${baseURL}/feedback_response/search`,
            body,
            {
                headers: {
                    Authorization: getTokenFromCookie(),
                }
            }
        );

        const feedbackList = feedback.data.data;
        const responseList = response.data.data;
        const feedbackWithResponse = feedbackList.map((feedback: Feedback) => {
            const responseOfFeedback = responseList.find(
                (response: IResponse) => response.feedbackId === feedback.id
            );
            return {
                ...feedback,
                response: responseOfFeedback || null
            };
        });
        return feedbackWithResponse;
    } catch (error: any) {
        console.log(error);
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
                    Authorization: getTokenFromCookie(),
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
                    Authorization: getTokenFromCookie(),
                }
            }
        );
        return response.data;
    } catch (error: any) {
        throw error.response.data
    }
}

export { createFeedback, getFeedbacks, getFeedbackByID, updateFeedback, getFeedbackAndResponse }