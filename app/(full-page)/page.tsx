'use client';
/* eslint-disable @next/next/no-img-element */
import React, { useContext, useRef, useState } from 'react';
import Link from 'next/link';
import './styles/landing.scss'
import { Button } from 'primereact/button';
import { useRouter } from 'next/navigation';

const LandingPage = () => {
    const router = useRouter();

    return (
        <div className="surface-0 flex justify-content-center">
            <div id="home" className="landing-wrapper overflow-hidden flex flex-column min-h-screen">
                <div className="py-3 px-4 flex align-items-center relative  w-screen justify-content-between">
                    <Link href="/" className="layout-topbar-logo">
                        <div className='flex align-items-center justify-content-center font-semibold gap-2'>
                            <img src={`/layout/images/hcmut.png`} width="38px" height={'38px'} alt="logo" className='mr-2' />
                            <div className='flex flex-column align-items-center md:align-items-left justify-content-center font-semibold'>
                                <span className='text-lg layout-topbar-maintext w-full'>Smart</span>
                                <span className='text-lg layout-topbar-secondarytext'>Printing Service</span>
                            </div>
                        </div>
                    </Link>

                    <div className="flex justify-content-between border-top-1 lg:border-top-none surface-border">
                        <Button label="Đăng nhập" onClick={() => router.push('/auth/login')} rounded className="border-none ml-5 font-light line-height-2 bg-blue-500 text-white"></Button>
                    </div>
                </div>
                <div
                    className="flex-1"
                    style={{
                        backgroundImage: 'url("/layout/images/hcmut2.jpg")',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                >
                    <div
                        id="hero"
                        className="flex flex-column pt-4 px-4 lg:px-8 overflow-hidden"
                        style={{
                            clipPath: 'ellipse(150% 87% at 100% 13%)',
                            backgroundColor: 'rgba(255, 255, 255, 0.8)'
                        }}
                    >
                        <div className="py-8 mx-4 md:mr-8 mt-0 md:mt-4 flex gap-4 flex-column xl:flex-row justify-content-center align-items-center ">
                            <h1 className="text-6xl xl:text-7xl font-bold text-white line-height-2 flex flex-column flex-1 xl:pb-8">
                                <span className="text-3xl lg:text-5xl block text-gray-900 text-center">Chào mừng đến với</span>
                                <span className='layout-topbar-maintext w-full text-center mt-4'>Smart</span>
                                <span className='layout-topbar-secondarytext text-center'>Printing Service</span>
                            </h1>
                            <img src={`/layout/images/hcmut.png`} width="250px" height={'250px'} alt="logo" className='hidden xl:block xl:-mt-8 ' />
                            <img src={`/layout/images/hcmut.png`} width="150px" height={'150px'} alt="logo" className='xl:hidden' />

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;
