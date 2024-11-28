import axios from "axios";
import { baseURL, token } from "@/app/(customer)/purchase/service/const";

import { Purchase, CreatePurchaseResponse, GetPurchaseResponse } from "@/app/(customer)/purchase/service/const";
import { getTokenFromCookie } from "@/utils/token";

async function createPurchase(numPages: number): Promise<CreatePurchaseResponse> {
    try {
        const body = {
            numPages: numPages
        }
        const response = await axios.post(
            `${baseURL}/purchasing_pages_order/create`,
            body,
            {
                headers: {
                    Authorization: getTokenFromCookie(),
                },
            }
        );
        return response.data;
    } catch (error: any) {
        throw error.response.data;
    }
}

async function getPurchase(): Promise<GetPurchaseResponse> {
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
            `${baseURL}/purchasing_pages_order/search`,
            body,
            {
                headers: {
                    Authorization: getTokenFromCookie(),
                },
            }
        );
        return response.data;
    } catch (error: any) {
        throw error.response.data;
    }
}

async function getPurchaseByID(id: string) {
    try {

    } catch (error) {

    }
}

export { createPurchase, getPurchase, getPurchaseByID }