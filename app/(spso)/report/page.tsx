import React from 'react';
import './styles/page.scss';
import { Card } from 'primereact/card';
import ReportMain from './components/report';

export default function ConfigPage() {
    return (
        <Card title="Báo cáo" className='report-main-content' >
            <div className='report-content'>
                <ReportMain />
            </div>
        </Card>
    )
}