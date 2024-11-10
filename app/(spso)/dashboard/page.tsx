import React from 'react'

import Header from './Header';
import Body from './Body';

import '../../../styles/dashboard/dashboard.scss'

export default function DashboardPage() {
    return (
        <div className='spso-dashboard'>
            <Header></Header>
            <Body></Body>
        </div>
    )
}