import axios from "axios";
import { BASE_URL, token } from "@/app/(spso)/dashboard/const";

export const searchPrinterOrder = async () => {
    try {
        const body = {
            addition: {},
            criteria: []
        }
        const response = await axios.post(`${BASE_URL}/printing_order/search`, body, {
            headers: {
                Authorization: `Bearer ${token}`
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
                Authorization: `Bearer ${token}`
            }
        })
        return response.data;
    } catch (error: any) {
        throw error.response.data;
    }
}