import axios from 'axios'
import { BASE_URL } from '@/app/(spso)/printers/service/const'
import { getTokenFromCookie } from '@/utils/token'

export const searchPrinter = async () => {
    try {
        const body = {
            addition: {},
            criteria: []
        }
        const response = await axios.post(`${BASE_URL}/printer/search`, body, {
            headers: {
                Authorization: getTokenFromCookie()
            }
        })
        return response.data;
    } catch (error: any) {
        throw error.response.data;
    }
}

export const getLocation = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/printer_location/`, {
            headers: {
                Authorization: getTokenFromCookie()
            }
        })
        return response.data;
    } catch (error: any) {
        throw error.response.data
    }
}

export const createPrinter = async (body: any) => {
    try {
        const response = await axios.post(`${BASE_URL}/printer/create`, body, {
            headers: {
                Authorization: getTokenFromCookie()
            }
        })
        return response.data;
    } catch (error: any) {
        throw error.response.data
    }
}

export const delPrinter = async (id: any) => {
    try {
        const response = await axios.delete(`${BASE_URL}/printer/delete/${id}`, {
            headers: {
                Authorization: getTokenFromCookie()
            }
        })
        return response.data;
    } catch (error: any) {
        // Bỏ qua lỗi từ server
        console.error('Failed to delete printer:', error.response?.data || error.message);
        return { success: false, message: 'Failed to delete printer. Please try again later.' };
    }
}

export const updatePrinter = async (id: any, body: any) => {
    try {
        const response = await axios.put(`${BASE_URL}/printer/update/${id}`, body, {
            headers: {
                Authorization: getTokenFromCookie()
            }
        })
    } catch (error) {

    }
}