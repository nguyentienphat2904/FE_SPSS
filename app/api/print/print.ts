import axios from "axios";
import { baseUrl, PrinterResponse, PrinterShow } from "@/app/(customer)/print/const";
import Body from "@/app/(spso)/dashboard/Body";
import { getTokenFromCookie } from "@/utils/token";
import { blob } from "stream/consumers";

export const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file); // 'file' là key mà API mong đợi

    try {
        const response = await axios.post(
            `${baseUrl}/document/upload`,
            formData,
            {
                headers: {
                    Authorization: getTokenFromCookie()
                }
            }
        );
        return response.data;
    } catch (error: any) {
        throw error.response.data;
    }
};

export const deleteFile = async (id: string) => {
    try {
        const response = await axios.delete(
            `${baseUrl}/document/delete/${id}`,
            {
                headers: {
                    Authorization: getTokenFromCookie()
                }
            }
        );
        return response.data;
    } catch (error: any) {
        throw error.response.data;
    }
}

export const getUserInfo = async () => {
    try {
        const response = await axios.get(
            `${baseUrl}/auth/customer`,
            {
                headers: {
                    Authorization: getTokenFromCookie()
                }
            }
        );
        return response.data;
    } catch (error: any) {
        throw error.response.data;
    }
}

export const getPlace = async () => {
    try {
        const body = {
            "addition": {
                "sort": [],
                "page": null,
                "size": null,
                "group": []
            },
            "criteria": [
                {
                    "field": "active",
                    "operator": "=",
                    "value": true
                }
            ]
        }
        const response = await axios.post(
            `${baseUrl}/printer/search`,
            body,
            {
                headers: {
                    Authorization: getTokenFromCookie()
                }
            }
        );
        const printerList = response.data.data;
        const printerShows: PrinterShow[] = printerList.map((printer: PrinterResponse) => ({
            id: printer.id,
            name: `${printer.name} - ${printer.location.branch} - ${printer.location.block} - ${printer.location.room}`
        }));
        return printerShows;
    } catch (error: any) {
        throw error.response.data;
    }
}

enum Orientation {
    "LANDSCAPE",
    "PORTRAIT"
}

enum Size {
    "A4", "A5", "A3", "A2", "A1", "A0"
}

export const createPrintOrder = async (numFaces: number, orientation: string, size: string, documentId: string, printerId: string) => {
    try {
        const body = {
            numFaces: numFaces,
            orientation: orientation,
            size: size,
            documentId: documentId,
            printerId: printerId
        }
        const response = await axios.post(
            `${baseUrl}/printing_order/create`,
            body,
            {
                headers: {
                    Authorization: getTokenFromCookie()
                }
            }
        );
        return response.data;
    } catch (error: any) {
        throw error.response.data;
    }
}

export const downloadPrintOrder = async (id: string) => {
    try {
        const response = await axios.get(
            `${baseUrl}/document/download/${id}`,
            {
                headers: {
                    Authorization: getTokenFromCookie()
                },
                responseType: 'blob'
            }
        );
        return response;
    } catch (error: any) {
        throw error.response.data;
    }
}

export const confirmStatus = async (id: string, status: string) => {
    try {
        const response = await axios.get(
            `${baseUrl}/printing_order/confirm_status`,
            {
                headers: {
                    Authorization: getTokenFromCookie()
                },
                params: {
                    id,
                    status,
                },
            }
        );
        return response.data;
    } catch (error: any) {
        throw error.response.data;
    }
}