import React from 'react'

import { Card } from 'primereact/card'

import PrintOrder from './PrintOrder'
import Income from './Income'

export default function Body() {
    return (
        <div className='dashboard-body'>
            <Card title="Thông báo">
                <PrintOrder></PrintOrder>
            </Card>
            <Card title="Doanh thu">
                <Income></Income>
            </Card>
        </div>
    )
}
