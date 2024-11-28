import axios from "axios";
import { baseURL, spsoToken } from "@/app/(spso)/spso_response/service/const";

import { CRUResponseResponse, GetResponsesResponse } from "@/app/(spso)/spso_response/service/const";

import { getTokenFromCookie } from "@/utils/token";

async function createResponse(content: string, feedbackId: string): Promise<CRUResponseResponse> {
    try {
        const body = {
            content: content,
            feedbackId: feedbackId
        }
        const response = await axios.post(
            `${baseURL}/feedback_response/create`,
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

async function getResponses(): Promise<GetResponsesResponse> {
    try {
        const body = {
            "addition": {
                "sort": [],
                "page": null,
                "size": null,
                "group": []
            },
            "criteria": []
        }
        const response = await axios.post(
            `${baseURL}/feedback_response/search`,
            body,
            {
                headers: {
                    Authorization: getTokenFromCookie(),
                }
            }
        );
        console.log(response);
        return response.data;
    } catch (error: any) {
        console.log(error);
        throw error.response.data;
    }
}

async function updateResponse(id: string, content: string): Promise<CRUResponseResponse> {
    try {
        const body = {
            content: content
        };
        const response = await axios.put(
            `${baseURL}/feedback_response/update/${id}`,
            body,
            {
                headers: {
                    Authorization: getTokenFromCookie(),
                }
            }
        );
        return response.data;
    } catch (error: any) {
        console.log(error)
        throw error.response.data;
    }
}

async function getResponseByFeedbackIdAndSPSOId(feedbackId: string, spsoId: string): Promise<CRUResponseResponse> {
    try {
        const response = await axios.get(
            `${baseURL}/feedback_response/search_by_feedback_id_and_spso_id`,
            {
                headers: {
                    Authorization: getTokenFromCookie(),
                },
                params: {
                    feedbackId: feedbackId,
                    spsoId: spsoId
                }
            }
        );
        return response.data;
    } catch (error: any) {
        throw error.response.data;
    }
}

export { createResponse, getResponses, updateResponse, getResponseByFeedbackIdAndSPSOId }