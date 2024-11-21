/* eslint-disable @next/next/no-img-element */
'use client';
import { useRouter } from 'next/navigation';
import React, { useContext, useState, useRef } from 'react';
import { Button } from 'primereact/button';
import { Password } from 'primereact/password';
import { LayoutContext } from '../../../../layout/context/layoutcontext';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import { Dropdown } from 'primereact/dropdown';
import { useDispatch } from 'react-redux';
import { login } from '@/redux/authSlice/auth.slice';
import { AppDispatch } from '@/redux/store';
import { Toast } from 'primereact/toast';
import { Toast as ToastType } from 'primereact/toast';

const LoginPage = () => {
    const dispatch = useDispatch<AppDispatch>();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { layoutConfig } = useContext(LayoutContext);
    const [userType, setUserType] = useState<'customer' | 'spso'>('customer');
    const toast = useRef<ToastType>(null);

    const userTypeOptions = [
        { label: 'Khách hàng', value: 'customer' },
        { label: 'SPSO', value: 'spso' },
    ];

    const router = useRouter();
    const containerClassName = classNames('surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden', { 'p-input-filled': layoutConfig.inputStyle === 'filled' });

    const handleLogin = async () => {
        const accountPayload = { username, password };

        dispatch(login({ accountPayload, userType }))
            .then((data) => {
                if (login.fulfilled.match(data)) {
                    toast.current?.show({ severity: 'success', summary: 'Đăng nhập thành công', detail: 'Chào mừng!', life: 3000 });

                    setTimeout(() => {
                        if (userType === 'spso') {
                            router.push('/dashboard');
                        } else {
                            router.push('/home');
                        }
                    }, 1000);
                } else if (login.rejected.match(data)) {
                    toast.current?.show({ severity: 'error', summary: 'Đăng nhập thất bại', detail: 'Vui lòng kiểm tra lại tài khoản và mật khẩu!', life: 3000 });
                }
            });
    };

    return (
        <div className={containerClassName}>
            <Toast ref={toast} position="bottom-right" />
            <div className="flex flex-column align-items-center justify-content-center">
                <img src={`/layout/images/hcmut.png`} alt="HCMUT logo" className="mb-5 w-6rem flex-shrink-0" />
                <div
                    style={{
                        borderRadius: '56px',
                        padding: '0.3rem',
                        background: 'linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)',
                    }}
                >
                    <div className="w-full surface-card py-6 px-5 sm:px-8" style={{ borderRadius: '53px' }}>
                        <div className="text-center mb-5">
                            <div className="text-900 text-3xl font-medium mb-3">Chào mừng đến Smart Printing Service!</div>
                            <span className="text-600 font-medium">Đăng nhập để tiếp tục</span>
                        </div>

                        <div>
                            <label htmlFor="userType" className="block text-900 font-medium text-xl mb-2">
                                Đăng nhập bằng
                            </label>
                            <Dropdown value={userType} onChange={(e) => setUserType(e.value)} options={userTypeOptions} placeholder="Chọn loại người dùng" className="w-full mb-5" />

                            <label htmlFor="username1" className="block text-900 text-xl font-medium mb-2">
                                Tài khoản
                            </label>
                            <InputText id="username1" type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Nhập tên tài khoản" className="w-full mb-5" style={{ padding: '1rem' }} />

                            <label htmlFor="password1" className="block text-900 font-medium text-xl mb-2">
                                Mật khẩu
                            </label>
                            <Password inputId="password1" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Mật khẩu" toggleMask className="w-full mb-5" inputClassName="w-full p-3" />

                            <Button label="Đăng nhập" className="w-full p-3 text-xl mt-4" onClick={handleLogin}></Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;