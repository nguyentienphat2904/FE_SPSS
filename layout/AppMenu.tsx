/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from 'react';
import AppMenuitem from './AppMenuitem';
import { MenuProvider } from './context/menucontext';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { AppMenuItem } from '@/types';
import { useRouter } from 'next/navigation';
import { fetchUserInfo } from '@/redux/authSlice/auth.slice';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';

const AppMenu = () => {
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();
    const userType = useSelector((state: RootState) => state.auth.userInfo?.type);
    const [showLoginMessage, setShowLoginMessage] = useState(false);

    const customerModel: AppMenuItem[] = [
        {
            label: 'Trang chủ',
            items: [{ label: 'Nhà của tôi', icon: 'pi pi-fw pi-home', to: '/home' }],
        },
        {
            label: 'Dịch vụ',
            items: [
                { label: 'Đăng ký in', icon: 'pi pi-fw pi-print', to: '/print' },
                { label: 'Mua giấy in', icon: 'pi pi-fw pi-shopping-cart', to: '/purchase' },
                { label: 'Phản hồi', icon: 'pi pi-fw pi-bookmark', to: '/response' },
            ],
        },
    ];

    const spsoModel: AppMenuItem[] = [
        {
            label: 'Trang chủ',
            items: [
                { label: 'Thống kê', icon: 'pi pi-fw pi-chart-bar', to: '/dashboard' },
            ],
        },
        {
            label: 'Quản lý',
            items: [
                { label: 'Quản lý máy in', icon: 'pi pi-fw pi-print', to: '/printers' },
                { label: 'Báo cáo', icon: 'pi pi-fw pi-paperclip', to: '/report' },
                { label: 'Phản hồi', icon: 'pi pi-fw pi-file-word', to: '/spso_response' },
            ],
        },
        {
            label: 'Cấu hình hệ thống',
            items: [
                { label: 'Cấu hình', icon: 'pi pi-fw pi-cog', to: '/config' },
            ],
        },
    ];

    let model: AppMenuItem[] = [];
    if (userType === 'customer') {
        model = customerModel;
    } else if (userType === 'spso') {
        model = spsoModel;
    }

    useEffect(() => {
        dispatch(fetchUserInfo())
            .then((data) => {
                if (fetchUserInfo.rejected.match(data)) {
                    setShowLoginMessage(true);
                }
            });
    }, [dispatch]);

    const handleLoginMessageClose = () => {
        setShowLoginMessage(false);
        router.push('/auth/login');
    };

    if (userType === undefined) {
        return (
            <div className="flex align-items-center justify-content-center h-full">
                <Dialog
                    visible={showLoginMessage}
                    onHide={handleLoginMessageClose}
                    header="Thông báo"
                    footer={
                        <Button label="Đăng nhập" icon="pi pi-sign-in" onClick={handleLoginMessageClose} />
                    }
                    style={{ width: '400px' }}
                >
                    <p>Bạn chưa đăng nhập, vui lòng đăng nhập để tiếp tục.</p>
                </Dialog>
                <i className="pi pi-spin pi-spinner text-4xl" />
            </div>
        );
    }

    return (
        <>
            <MenuProvider>
                <ul className="layout-menu">
                    {model.map((item, i) => (
                        <AppMenuitem item={item} root={true} index={i} key={item.label} />
                    ))}
                </ul>
            </MenuProvider>
        </>
    );
};

export default AppMenu;