'use client';

import '../styles/main.scss';
import { useState } from 'react';
import { Button } from "primereact/button";
import { InputText } from 'primereact/inputtext';
import { MultiSelect } from 'primereact/multiselect';
import { Calendar } from 'primereact/calendar';

export default function ConfigMain() {
    const [pageNumber, setPageNumber] = useState<number>(100);
    const [fileType, setFileType] = useState<string[]>([]);
    const [date, setDate] = useState<Date | undefined | null>(new Date());
    const fileTypes = [
        { name: '*pdf', value: 'pdf' },
        { name: '*docx', value: 'docx' },
        { name: '*pptx', value: 'pptx' },
        { name: '*png', value: 'png' },
        { name: '*jpeg', value: 'jpeg' }
    ]

    return (
        <>
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
                <div className="flex flex-column gap-2">
                    <label htmlFor="amount">Ngày cấp trang in</label>
                    <Calendar value={date} onChange={(e) => { setDate(e.value) }} showIcon />
                </div>
                <div className="flex flex-column gap-2 file-config">
                    <label htmlFor="amount">Loại file chấp nhận</label>
                    <MultiSelect
                        value={fileType}
                        onChange={(e) => setFileType(e.value)}
                        options={fileTypes}
                        optionLabel="name"
                        placeholder="Chọn..." />
                </div>
            </div>
            <div className='config-footer'>
                <Button label="Huỷ" severity="danger" outlined />
                <Button label="Lưu" severity="info" outlined />
            </div>
        </>
    )
}