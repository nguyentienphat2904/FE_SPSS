'use client';

import '../styles/main.scss';
import { useState } from 'react';
import { Button } from 'primereact/button';
import { Image } from 'primereact/image';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';

export default function ReportMain() {
    const [printerName, setPrinterName] = useState<number>(1);
    const [viewMode, setViewMode] = useState<string>('daily');
    const [startDate, setStartDate] = useState<Date | undefined | null>(new Date());
    const [endDate, setEndDate] = useState<Date | undefined | null>(new Date());
    const [imageSrc, setImageSrc] = useState<string>('/layout/images/hcmut.png'); // ảnh mặc định

    const printers = [
        { label: 'M01', value: 1 },
        { label: 'M02', value: 2 },
        { label: 'M03', value: 3 },
    ];

    const viewModes = [
        { label: 'Theo ngày', value: 'daily' },
        { label: 'Theo tuần', value: 'weekly' },
        { label: 'Theo tháng', value: 'monthly' },
    ];

    // Hàm để xử lý sự kiện tải ảnh
    const handleDownload = () => {
        const link = document.createElement('a');
        link.href = imageSrc;
        link.download = 'report-image.png'; // tên file khi tải xuống
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className='main-report-box'>
            <div className='flex flex-column justify-content-between align-items-center gap-4'>
                <div className='w-full flex flex-column gap-2'>
                    <div className="flex flex-column gap-2 w-full">
                        <label htmlFor="amount">Tên máy in</label>
                        <Dropdown value={printerName}
                            onChange={(e) => setPrinterName(e.value)}
                            options={printers}
                            optionLabel="label"
                            placeholder="Chọn máy in"
                        />
                    </div>
                    <div className="flex flex-column gap-2 w-full">
                        <label htmlFor="amount">Chế độ xem</label>
                        <Dropdown value={viewMode}
                            onChange={(e) => setViewMode(e.value)}
                            options={viewModes}
                            optionLabel="label"
                            placeholder="Chọn..."
                        />
                    </div>
                    <div className="flex flex-column gap-2">
                        <label htmlFor="amount">Ngày bắt đầu</label>
                        <Calendar value={startDate} onChange={(e) => { setStartDate(e.value) }} showIcon />
                    </div>
                    <div className="flex flex-column gap-2">
                        <label htmlFor="amount">Ngày kết thúc</label>
                        <Calendar value={endDate} onChange={(e) => { setEndDate(e.value) }} showIcon />
                    </div>
                </div>
                <div className='report-footer w-full'>
                    <Button label="Tạo báo cáo" severity="info" outlined className='w-full' />
                </div>
            </div>
            <div className="custom-border-box">
                <div className='p-3 px-4 flex justify-content-between align-items-center header'>
                    <h3 className="font-base text-lg text-600 pt-3">Báo cáo in</h3>
                    <Button icon="pi pi-download" className="p-button-rounded p-button-text p-button-secondary" onClick={handleDownload} />
                </div>

                <div className="p-3 border-round" style={{ height: '300px' }}>
                    <Image src={imageSrc} alt="Report Image" style={{ width: '100%', height: 'auto' }} preview />
                </div>
            </div>

        </div>
    );
}