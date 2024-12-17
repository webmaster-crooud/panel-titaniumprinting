import React, { useEffect } from 'react';
import { jakartaSans } from '../../lib/utils';
import Head from 'next/head';
import { Navbar } from '@/components/Navbar';
import { Breadcrumb } from '@/components/Breadcrumb';
import { ErrorAlert } from '@/components/Alert/Error.alert';
import { useAtom } from 'jotai';
import { alertShow } from '../../store/Atom';
import { SuccessAlert } from '@/components/Alert/Success.alert';
import { Header } from '@/components/Header';

import { useRouter } from 'next/router';
import { useAuthToken } from '../../hooks/useAuthToken';
import { WarningAlert } from '@/components/Alert/Warning.alert';

export const LayoutApp = ({ children }: { children: React.ReactNode }) => {
    const router = useRouter();
    const [alert] = useAtom(alertShow);
    const { refreshToken } = useAuthToken();

    useEffect(() => {
        const interval = setInterval(async () => {
            try {
                await refreshToken(); // Refresh token setiap beberapa menit
            } catch (error) {
                console.error('Failed to refresh token', error);
            }
        }, 1 * 60 * 1000); // Refresh token setiap 5 menit

        return () => clearInterval(interval); // Bersihkan interval saat komponen unmount
    }, [refreshToken]);

    return (
        <>
            <Head>
                <link rel="shortcut icon" href="/assets/logo.svg" type="image/x-icon" />
                <title>Dashboard | Titanium Printing</title>
            </Head>

            <Navbar />
            <main className={`${jakartaSans.className} relative overflow-x-hidden mt-24`}>
                {alert?.type === 'error' && <ErrorAlert />}
                {alert?.type === 'success' && <SuccessAlert />}
                {alert?.type === 'warning' && <WarningAlert />}
                <section className="w-11/12 mx-auto min-h-screen pb-10">
                    <Breadcrumb />
                    <Header />
                    {children}
                </section>
            </main>
        </>
    );
};
