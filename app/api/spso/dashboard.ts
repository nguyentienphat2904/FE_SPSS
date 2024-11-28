import axios from "axios";
import { BASE_URL } from "@/app/(spso)/dashboard/const";
import { getTokenFromCookie } from "@/utils/token";

export const searchPrinterOrder = async () => {
    try {
        const body = {
            addition: {},
            criteria: []
        }
        const response = await axios.post(`${BASE_URL}/printing_order/search`, body, {
            headers: {
                Authorization: getTokenFromCookie()
            }
        })
        return response.data;
    } catch (error: any) {
        throw error.response.data;
    }
}

export const searchDocName = async (id: any) => {
    try {
        const body = {
            addition: {},
            criteria: []
        }
        const response = await axios.get(`${BASE_URL}/document/${id}`, {
            headers: {
                Authorization: getTokenFromCookie()
            }
        })
        return response.data;
    } catch (error: any) {
        throw error.response.data;
    }
}