'use client';

import '../styles/main.scss';
import { useState, useEffect, useRef } from 'react';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { getTokenFromCookie } from '@/utils/token';
import { searchPrinter } from '@/app/api/spso/printer';
import { ReportOperation } from '@/app/api/report';
import { Toast } from 'primereact/toast';

export default function ReportMain() {
    const toast = useRef<Toast | null>(null);
    const [viewMode, setViewMode] = useState<string>('daily');
    const [printerName, setPrinterName] = useState<string>('');
    const [startDate, setStartDate] = useState<Date | null>(new Date());
    const [reportData, setReportData] = useState<ReportData | null>(null);
    const [printers, setPrinters] = useState<{ label: string; value: string }[]>([]);

    const viewModes = [
        { label: 'Theo ngày', value: 'daily' },
        { label: 'Theo tháng', value: 'monthly' },
    ];

    const fetchPrinters = async () => {
        const response = await searchPrinter();
        const data = response.data;

        if (data) {
            const formattedPrinters = data.map((printer: any) => ({
                label: printer.name,
                value: printer.id,
            }));
            setPrinters(formattedPrinters);
        }
    };

    const fetchReport = async () => {
        if (!printerName || !startDate) {
            toast.current?.show({
                severity: 'error',
                summary: 'Lỗi',
                detail: 'Vui lòng chọn máy in và thời gian',
                life: 3000,
            });
            return;
        }

        const tokenPayload: TokenPayload = {
            token: getTokenFromCookie() || '',
        };

        if (!tokenPayload.token) {
            return;
        }

        const getReportPayload: GetReportPayload = {
            printerId: printerName,
            day: viewMode === 'daily' ? startDate.toISOString().split('T')[0] : undefined,
            month: viewMode === 'monthly' ? startDate.toISOString().slice(0, 7) : undefined,
        };

        const reportOperation = new ReportOperation();
        const response = await reportOperation.getReport(tokenPayload, getReportPayload);

        if (response.error) {
            toast.current?.show({
                severity: 'error',
                summary: 'Lỗi',
                detail: 'Không thể tải báo cáo. Vui lòng thử lại.',
                life: 3000,
            });
            console.error('Failed to fetch report data.');
        } else {
            setReportData(response.data);
            toast.current?.show({
                severity: 'success',
                summary: 'Thành công',
                detail: 'Tải báo cáo thành công!',
                life: 3000,
            });
        }
    };

    const generatePDF = () => {
        if (!reportData) {
            toast.current?.show({
                severity: 'warn',
                summary: 'Cảnh báo',
                detail: 'Chưa có dữ liệu báo cáo để tải.',
                life: 3000,
            });
            return;
        }
        const printer = printers.find((printer) => printer.value === reportData.printerId);
        const doc = new jsPDF();
        doc.setFont('arial');
        doc.setFontSize(16);
        doc.text('Bao cao in', 20, 20);

        doc.setFontSize(12);
        doc.text(`May in: ${printer?.label}`, 20, 40);
        doc.text(`Tong so tai lieu: ${reportData.documentsCount}`, 20, 50);
        doc.text(`Tong so don hang: ${reportData.totalOrders}`, 20, 60);

        let y = 80;
        reportData.ordersGroupedByStatus.forEach((status) => {
            doc.text(`${status.printingStatus}: ${status.orderCount} don hang`, 20, y);
            y += 10;
        });

        doc.save('report.pdf');
    };

    useEffect(() => {
        fetchPrinters();
    }, []);

    return (
        <div className="main-report-box">
            <Toast ref={toast} position='bottom-right' />
            <div className="flex flex-column justify-content-between align-items-center gap-4">
                <div className="w-full flex flex-column gap-2">
                    <div className="flex flex-column gap-2 w-full">
                        <label htmlFor="amount">Tên máy in</label>
                        <Dropdown
                            value={printerName}
                            onChange={(e) => setPrinterName(e.value)}
                            options={printers}
                            optionLabel="label"
                            placeholder="Chọn máy in"
                        />
                    </div>
                    <div className="flex flex-column gap-2 w-full">
                        <label htmlFor="amount">Chế độ xem</label>
                        <Dropdown
                            value={viewMode}
                            onChange={(e) => setViewMode(e.value)}
                            options={viewModes}
                            optionLabel="label"
                            placeholder="Chọn..."
                        />
                    </div>
                    <div className="flex flex-column gap-2">
                        <label htmlFor="amount">Chọn thời gian</label>
                        <Calendar
                            value={startDate}
                            onChange={(e) => setStartDate(e.value ?? null)}
                            showIcon
                        />
                    </div>
                </div>
                <div className="report-footer w-full">
                    <Button
                        label="Tạo báo cáo"
                        severity="info"
                        outlined
                        className="w-full"
                        onClick={fetchReport}
                    />
                </div>
            </div>
            <div className="custom-border-box">
                <div className="p-3 px-4 flex justify-content-between align-items-center header">
                    <h3 className="font-base text-lg text-600 pt-3">Báo cáo in</h3>
                    <Button
                        icon="pi pi-download"
                        className="p-button-rounded p-button-text p-button-secondary"
                        onClick={generatePDF}
                    />
                </div>
                <div className="p-3 border-round" style={{ height: '300px' }}>
                    <div className="flex align-items-center justify-content-center h-full w-full">
                        {reportData ? (
                            <div>
                                <p>Máy in: {reportData.printerId}</p>
                                <p>Tổng số tài liệu: {reportData.documentsCount}</p>
                                <p>Tổng số đơn hàng: {reportData.totalOrders}</p>
                                <ul>
                                    {reportData.ordersGroupedByStatus.map((status, index) => (
                                        <li key={index}>
                                            {status.printingStatus}: {status.orderCount} đơn hàng
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ) : (
                            <p>Không có dữ liệu báo cáo</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}