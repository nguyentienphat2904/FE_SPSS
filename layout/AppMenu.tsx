/* eslint-disable @next/next/no-img-element */

import React, { useContext } from 'react';
import AppMenuitem from './AppMenuitem';
import { LayoutContext } from './context/layoutcontext';
import { MenuProvider } from './context/menucontext';
import Link from 'next/link';
import { AppMenuItem } from '@/types';

const AppMenu = () => {
    const { layoutConfig } = useContext(LayoutContext);

    const model: AppMenuItem[] = [
        {
            label: 'Trang chủ',
            items: [{ label: 'Nhà của tôi', icon: 'pi pi-fw pi-home', to: '/home' }]
        },
        {
            label: 'Dịch vụ',
            items: [
                { label: 'Đăng ký in', icon: 'pi pi-fw pi-print', to: '/print' },
                { label: 'Mua giấy in', icon: 'pi pi-fw pi-shopping-cart', to: '/purchase' },
                { label: 'Phản hồi', icon: 'pi pi-fw pi-bookmark', to: '/response' },
            ]
        },
        {
            label: 'SPSO',
            items: [
                { label: 'Thống kê', icon: 'pi pi-fw pi-chart-bar', to: '/dashboard' },
                { label: 'Quản lý máy in', icon: 'pi pi-fw pi-print', to: '/printers' },
                { label: 'Cấu hình', icon: 'pi pi-fw pi-cog', to: '/config' },
                { label: 'Báo cáo', icon: 'pi pi-fw pi-paperclip', to: '/spso_response' },
                { label: 'Phản hồi', icon: 'pi pi-fw pi-file-word', to: '/report' },
            ]
        }
    ];

    return (
        <MenuProvider>
            <ul className="layout-menu">
                {model.map((item, i) => {
                    return !item?.seperator ? <AppMenuitem item={item} root={true} index={i} key={item.label} /> : <li className="menu-separator"></li>;
                })}
            </ul>
        </MenuProvider>
    );
};

export default AppMenu;
