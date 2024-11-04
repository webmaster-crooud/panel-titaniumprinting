import React from 'react';
import { jakartaSans } from '../../lib/utils';
import Head from 'next/head';
import { Navbar } from '@/components/Navbar';
import { Breadcrumb } from '@/components/Breadcrumb';
import { ErrorAlert } from '@/components/Alert/Error.alert';
import { useAtom } from 'jotai';
import { alertShow } from '../../store/Atom';
import { SuccessAlert } from '@/components/Alert/Success.alert';

export const LayoutApp = ({ children }: { children: React.ReactNode }) => {
    const [alert] = useAtom(alertShow);

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
                <section className="w-11/12 mx-auto min-h-screen pb-10">
                    <Breadcrumb />
                    {children}
                </section>
            </main>
        </>
    );
};
