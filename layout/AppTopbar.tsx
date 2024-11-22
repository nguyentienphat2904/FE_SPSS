import Link from 'next/link';
import { classNames } from 'primereact/utils';
import React, { forwardRef, useContext, useImperativeHandle, useRef, useState } from 'react';
import { AppTopbarRef } from '@/types';
import { LayoutContext } from './context/layoutcontext';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import { logout } from '@/redux/authSlice/auth.slice';
import { useRouter } from 'next/navigation';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { OverlayPanel } from 'primereact/overlaypanel';

const AppTopbar = forwardRef<AppTopbarRef>((props, ref) => {
    const { layoutConfig, layoutState, onMenuToggle, showProfileSidebar } = useContext(LayoutContext);
    const menubuttonRef = useRef(null);
    const topbarmenuRef = useRef(null);
    const topbarmenubuttonRef = useRef(null);
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();
    const op = useRef<OverlayPanel>(null);

    useImperativeHandle(ref, () => ({
        menubutton: menubuttonRef.current,
        topbarmenu: topbarmenuRef.current,
        topbarmenubutton: topbarmenubuttonRef.current,
    }));

    const handleLogout = () => {
        confirmDialog({
            message: 'Xác nhận thoát phiên đăng nhập?',
            header: 'Xác nhận',
            icon: 'pi pi-exclamation-triangle w-1 h-1',
            acceptLabel: 'Xác nhận',
            rejectLabel: 'Đóng',
            accept: () => {
                dispatch(logout());
                router.push('/');
            },
            reject: () => {
                op.current?.hide();
            }
        });
    };

    return (
        <div className="layout-topbar">
            <Link href="/" className="layout-topbar-logo">
                <div className='flex align-items-center justify-content-center font-semibold gap-2'>
                    <img src={`/layout/images/hcmut.png`} width="38px" height={'35px'} alt="logo" className='hidden md:block' />
                    <div className='flex flex-column align-items-center md:align-items-left justify-content-center font-semibold'>
                        <span className='text-lg layout-topbar-maintext w-full text-center md:text-left'>Smart</span>
                        <span className='text-lg layout-topbar-secondarytext'>Printing Service</span>
                    </div>
                </div>
            </Link>

            <button ref={menubuttonRef} type="button" className="p-link layout-menu-button layout-topbar-button" onClick={onMenuToggle}>
                <i className="pi pi-bars" />
            </button>

            <div ref={topbarmenuRef} className={classNames('layout-topbar-menu', { 'layout-topbar-menu-mobile-active': layoutState.profileSidebarVisible })}>
                <button type="button" className="p-link layout-topbar-button" onClick={(e) => { op.current ? op.current.toggle(e) : null }}>
                    <i className="pi pi-user"></i>
                    <span></span>
                </button>
            </div>

            <OverlayPanel ref={op} className="overlay-panel">
                <button type="button" className="p-link layout-topbar-button" onClick={handleLogout}>
                    <i className="pi pi-sign-out" style={{ marginRight: '8px' }} />
                    <span>Đăng xuất</span>
                </button>
            </OverlayPanel>

            <ConfirmDialog />
        </div>
    );
});

AppTopbar.displayName = 'AppTopbar';

export default AppTopbar;