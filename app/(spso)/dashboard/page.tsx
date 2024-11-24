"use client"
import React from 'react'

import Header from './Header';
import Body from './Body';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

import '../../../styles/dashboard/dashboard.scss'

export default function DashboardPage() {
    const userType = useSelector((state: RootState) => state.auth.userInfo?.type);
    if (userType !== 'spso') return <div>Không được phép truy cập.</div>

    return (
        <div className='spso-dashboard'>
            <Header></Header>
            <Body></Body>
        </div>
    )
}