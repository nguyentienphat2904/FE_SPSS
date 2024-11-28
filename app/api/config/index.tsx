import axios from "axios";

export class ConfigOperation {
    private baseUrl: string;

    constructor() {
        this.baseUrl = `${process.env.NEXT_PUBLIC_BACKEND_LOGIN_ENDPOINT!}/config`;
    }

    async getDefaultGrantedPages(tokenPayload: TokenPayload) {
        try {
            const response = await axios.get(`${this.baseUrl}/get`, {
                headers: {
                    Authorization: `Bearer ${tokenPayload.token}`,
                    "Content-Type": "application/json",
                },
            });
            return response.status >= 200 && response.status < 300
                ? { error: false, data: response.data.data.defaultGrantedPages || 100 }
                : { error: true, data: null };
        } catch (err: any) {
            console.log(err);
            return { error: true, data: null };
        }
    }

    async updateDefaultGrantedPages(tokenPayload: TokenPayload, updateGrantedPagesPayload: UpdateGrantedPagesPayload) {
        try {
            const response = await axios.put(`${this.baseUrl}/update`, updateGrantedPagesPayload,
                {
                    headers: {
                        Authorization: `Bearer ${tokenPayload.token}`,
                        "Content-Type": "application/json",
                    },
                });

            return response.status >= 200 && response.status < 300
                ? { error: false, data: true }
                : { error: true, data: null };
        } catch (err: any) {
            console.log(err);
            return { error: true, data: null };
        }
    }
}