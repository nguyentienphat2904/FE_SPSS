import axios from "axios";

export class ReportOperation {
    private baseUrl: string;

    constructor() {
        this.baseUrl = `${process.env.NEXT_PUBLIC_BACKEND_LOGIN_ENDPOINT!}/printing_order`;
    }

    async getReport(tokenPayload: TokenPayload, getReportPayload: GetReportPayload) {
        try {
            const response = await axios.post(`${this.baseUrl}/report`, getReportPayload, {
                headers: {
                    Authorization: `Bearer ${tokenPayload.token}`,
                    "Content-Type": "application/json",
                },
            });
            return response.status >= 200 && response.status < 300
                ? { error: false, data: response.data.data as ReportData }
                : { error: true, data: null };
        } catch (err: any) {
            console.log(err);
            return { error: true, data: null };
        }
    }
}