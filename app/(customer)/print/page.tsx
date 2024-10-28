import React, { useState } from 'react'
import '../../../styles/print/print.scss';

import PrintViewFile from './PrintViewFile';
import PrintConfig from './PrintConfig';
import PrintFooter from './PrintFooter';

import { Card } from 'primereact/card'

export default function PrintRegister() {

    return (
        <>
            <Card title="Đăng ký in" className='print-main-content' footer={<PrintFooter />}>
                <div className='print-content'>
                    <PrintViewFile></PrintViewFile>
                    <PrintConfig></PrintConfig>
                </div>
            </Card>
        </>

    )
}