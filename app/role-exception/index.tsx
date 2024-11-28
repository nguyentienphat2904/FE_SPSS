'use client';

import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";

interface RoleProps {
    children: React.ReactNode;
    type: 'customer' | 'spso';
}

export const HandleRoleException = ({ children, type }: RoleProps) => {
    const userType = useSelector((state: RootState) => state.auth.userInfo?.type);
    if (userType === undefined) {
        return (
            <div className="flex align-items-center justify-content-center h-full" style={{ minHeight: 200 }}>
                <i className="pi pi-spin pi-spinner text-4xl" />
            </div>
        )
    } else if (userType !== type) {
        return (
            <div className="flex align-items-center justify-content-center h-full" style={{ minHeight: 200 }}>
                Bạn không thể sử dụng chức năng này
            </div>
        )
    }
    return children
}