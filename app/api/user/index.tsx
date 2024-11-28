import axios from "axios";

export class UserOperation {
    private baseUrl: string;

    constructor() {
        this.baseUrl = `${process.env.NEXT_PUBLIC_BACKEND_LOGIN_ENDPOINT!}/auth`;
    }

    async loginByCustomer(accountPayload: AccountPayload) {
        try {
            const response = await axios.post(`${this.baseUrl}/customer/login`, accountPayload,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

            return response.status >= 200 && response.status < 300
                ? { error: false, data: { ...response.data.data, type: "customer" } as CustomerInfoLogin }
                : { error: true, data: null };
        } catch (err: any) {
            console.log(err);
            return { error: true, data: null };
        }
    }

    async loginBySPSO(accountPayload: AccountPayload) {
        try {
            const response = await axios.post(`${this.baseUrl}/spso/login`, accountPayload,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

            return response.status >= 200 && response.status < 300
                ? { error: false, data: { ...response.data.data, type: "spso" } as SPSOInfoLogin }
                : { error: true, data: null };
        } catch (err: any) {
            console.log(err);
            return { error: true, data: null };
        }
    }

    async getCustomerInfo(tokenPayload: TokenPayload) {
        try {
            const response = await axios.get(`${this.baseUrl}/customer`, {
                headers: {
                    Authorization: `Bearer ${tokenPayload.token}`,
                    "Content-Type": "application/json",
                },
            });

            return response.status >= 200 && response.status < 300
                ? { error: false, data: { ...response.data.data, type: "customer" } as CustomerInfo }
                : { error: true, data: null };
        } catch (err: any) {
            console.log(err);
            return { error: true, data: null };
        }
    }

    async getSPSOInfo(tokenPayload: TokenPayload) {
        try {
            const response = await axios.get(`${this.baseUrl}/spso`, {
                headers: {
                    Authorization: `Bearer ${tokenPayload.token}`,
                    "Content-Type": "application/json",
                },
            });

            return response.status >= 200 && response.status < 300
                ? { error: false, data: { ...response.data.data, type: "spso" } as SPSOInfo }
                : { error: true, data: null };
        } catch (err: any) {
            console.log(err);
            return { error: true, data: null };
        }
    }
}