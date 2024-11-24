'use client'
import React, { useState } from 'react'
import { useEffect } from 'react'
import { Card } from 'primereact/card'
import { searchPrinterOrder } from '@/app/api/spso/dashboard'
import { searchPrinter } from '@/app/api/spso/printer'

import { PrintingOrder } from './const'
import { Printer } from '../printers/service/const'
import { getFeedbackAndResponse } from '@/app/api/feedback/feedback'

export default function Header() {
    const [printingOrder, setPrintingOrder] = useState<PrintingOrder[]>([])
    const [printer, setPrinter] = useState<Printer[]>([])
    const [countFeedback, setCountFeedback] = useState<number>(0)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await searchPrinterOrder();
                if (response.data) {
                    setPrintingOrder(response.data);
                }
            } catch (error: any) {
                const mes = error.message;
                console.error("Error fetching groups:", mes)
            }
        }

        const fetchFeedback = async () => {
            try {
                const feedback = await getFeedbackAndResponse();
                let count = 0;
                feedback?.forEach((f) => {
                    if (!f.response) count++;
                })
                setCountFeedback(count);
            } catch {

            }
        }

        fetchData();
        fetchFeedback();
    }, [])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await searchPrinter();
                if (response.data) {
                    setPrinter(response.data);
                }
            } catch (error: any) {
                const mes = error.message;
                console.error("Error fetching groups:", mes)
            }
        }
        fetchData();
    }, [])

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };


    const countPaid = printingOrder.filter(item => item.printingStatus === "PENDING").length;
    const countPrinter = printer.filter(item => item.active === true).length;

    return (
        <div className='dashboard-header'>
            <Card title="Số bản in đang chờ">
                <div className='flex justify-content-between'>
                    <div>
                        <div className="text-900 font-medium text-xl text-red-500 font-bold font-italic">{countPaid}</div>
                    </div>
                    <div className="flex align-items-center justify-content-center border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                        <i className="pi pi-clone text-purple-500 text-xl" />
                    </div>
                </div>
            </Card>
            <Card title="Số máy in đang hoạt động">
                <div className='flex justify-content-between'>
                    <div>
                        <div className="text-900 font-medium text-xl text-red-500 font-bold font-italic">{countPrinter}</div>
                    </div>
                    <div className="flex align-items-center justify-content-center border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                        <i className="pi pi-print text-purple-500 text-xl" />
                    </div>
                </div>
                <p style={{
                    fontSize: '14px',
                    marginTop: '5px',
                    fontStyle: 'italic',
                    color: 'green'
                }}>trên tổng số {printer.length} máy</p>
            </Card>
            <Card title="Doanh thu ngày">
                <div className='flex justify-content-between'>
                    <div>
                        <div className="text-900 font-medium text-xl text-red-500 font-bold font-italic">{formatCurrency(100000)}</div>
                    </div>
                    {/* <div className="flex align-items-center justify-content-center border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                        <i className="pi pi-wallet text-purple-500 text-xl" />
                    </div> */}
                </div>
            </Card>
            <Card title="Số phản hồi chưa xử lý">
                <div className='flex justify-content-between'>
                    <div>
                        <div className="text-900 font-medium text-xl text-red-500 font-bold font-italic">{countFeedback}</div>
                    </div>
                    {/* <div className="flex align-items-center justify-content-center border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                        <i className="pi pi-reply text-purple-500 text-xl" />
                    </div> */}
                </div>
            </Card>
        </div>
    )
}
