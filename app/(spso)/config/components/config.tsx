'use client';

import '../styles/main.scss';
import { useEffect, useRef, useState } from 'react';
import { Button } from "primereact/button";
import { InputText } from 'primereact/inputtext';
import { ConfigOperation } from '@/app/api/config';
import { getTokenFromCookie } from '@/utils/token';
import { Toast } from 'primereact/toast';

export default function ConfigMain() {
    const configOp = new ConfigOperation();
    const [pageNumber, setPageNumber] = useState<number>(100);
    const [initialPageNumber, setInitialPageNumber] = useState<number>(100);
    const toast = useRef<Toast | null>(null);

    const handleFetchData = async () => {
        const token = getTokenFromCookie();
        if (!token) return;
        const response = await configOp.getDefaultGrantedPages({ token });
        if (response.data) {
            setPageNumber(response.data);
            setInitialPageNumber(response.data);
        }
    }

    const handleUpdateData = async () => {
        const token = getTokenFromCookie();
        if (!token) return;
        if (initialPageNumber === pageNumber) {
            toast.current?.show({ severity: 'error', summary: 'Thông báo', detail: 'Vui lòng thay đổi số trang muốn cấu hình', life: 3000 });
            return;
        }
        const response = await configOp.updateDefaultGrantedPages({ token }, { defaultGrantedPages: pageNumber })
        if (response.data) {
            setInitialPageNumber(pageNumber)
            toast.current?.show({ severity: 'success', summary: 'Thông báo', detail: 'Cấu hình thành công', life: 3000 });
        }
    }

    useEffect(() => {
        handleFetchData();
    }, []);

    return (
        <>
            <Toast ref={toast} position="bottom-right" />

            <div className='main-config-box'>
                <div className="flex flex-column gap-2">
                    <label htmlFor="amount">Số trang in cấp mặc định</label>
                    <InputText
                        placeholder='Nhập số bản in'
                        id="page_amount"
                        type='number'
                        min={1} value={pageNumber.toString()}
                        onChange={(e) => { setPageNumber(parseInt(e.target.value)) }} />
                </div>
            </div>
            <div className='config-footer'>
                <Button label="Huỷ" severity="danger" outlined onClick={handleFetchData} />
                <Button label="Lưu" severity="info" outlined onClick={handleUpdateData} />
            </div>
        </>
    )
}