import React from 'react'

import { Card } from 'primereact/card'

export default function Header() {

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    return (
        <div className='dashboard-header'>
            <Card title="Số bản in đang chờ">
                <div className='flex justify-content-between'>
                    <div>
                        <div className="text-900 font-medium text-xl text-red-500 font-bold font-italic">50</div>
                    </div>
                    <div className="flex align-items-center justify-content-center border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                        <i className="pi pi-clone text-purple-500 text-xl" />
                    </div>
                </div>
            </Card>
            <Card title="Số máy in đang hoạt động">
                <div className='flex justify-content-between'>
                    <div>
                        <div className="text-900 font-medium text-xl text-red-500 font-bold font-italic">15</div>
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
                }}>trên tổng số 20 máy</p>
            </Card>
            <Card title="Doanh thu ngày">
                <div className='flex justify-content-between'>
                    <div>
                        <div className="text-900 font-medium text-xl text-red-500 font-bold font-italic">{formatCurrency(100000)}</div>
                    </div>
                    <div className="flex align-items-center justify-content-center border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                        <i className="pi pi-wallet text-purple-500 text-xl" />
                    </div>
                </div>
            </Card>
            <Card title="Số phản hồi chưa xử lý">
                <div className='flex justify-content-between'>
                    <div>
                        <div className="text-900 font-medium text-xl text-red-500 font-bold font-italic">5</div>
                    </div>
                    <div className="flex align-items-center justify-content-center border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                        <i className="pi pi-reply text-purple-500 text-xl" />
                    </div>
                </div>
            </Card>
        </div>
    )
}
