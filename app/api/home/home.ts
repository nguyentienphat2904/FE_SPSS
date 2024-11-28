import axios from "axios";
import { BASE_URL } from "@/app/(customer)/home/service/const";
import { headers } from "next/dist/client/components/headers";
import { getTokenFromCookie } from "@/utils/token";

export const getUserInfo = async () => {
    try {
        const response = await axios.get(
            `${BASE_URL}/auth/customer`,
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