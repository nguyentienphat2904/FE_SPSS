import React from 'react';
import './styles/page.scss';
import { Card } from 'primereact/card';
import ConfigMain from './components/config';

export default function ConfigPage() {
    return (
        <Card title="Cấu hình" className='config-main-content' >
            <div className='config-content'>
                <ConfigMain />
            </div>
        </Card>
    )
}