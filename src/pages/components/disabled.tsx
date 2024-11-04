import { Card } from '@/components/Card';
import { IconCirclePlus, IconLoader3 } from '@tabler/icons-react';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { BACKEND } from '../../../lib/utils';
import { useSetAtom } from 'jotai';
import { alertShow } from '../../../store/Atom';
import { ComponentsTable } from './Table/Components.table';
import { NavigationCard } from '@/components/Card/Navigation.card';
import { Component } from '.';

type propsLoading = {
    func: string;
    status: boolean;
    id?: string | number;
};

export const navCardComponent = [
    { title: 'List Komponen', url: '/components' },
    { title: 'Disabled Layanan', url: '/components/disabled' },
];

export default function DisabledComponentsPage() {
    const [components, setComponents] = useState<Component[]>([]);
    const [loading, setLoading] = useState<propsLoading | undefined>(undefined);
    const setAlert = useSetAtom(alertShow);

    const fetchComponents = useCallback(
        async (useLoading?: boolean) => {
            if (useLoading) {
                setLoading({ func: 'fetch', status: true });
            } else {
                setLoading(undefined);
            }

            try {
                if (useLoading) {
                    await new Promise((resolve) => setTimeout(resolve, 2000));
                }
                const res = await fetch(`${BACKEND}/components/disabled`);
                const result = await res.json();
                if (result.error === true) {
                    setAlert({ type: 'error', message: result.message });
                }
                console.log(result.data);
                setComponents(result.data);
            } catch (error) {
                setAlert({ type: 'error', message: `${error}` });
            } finally {
                setLoading(undefined);
            }
        },
        [setAlert],
    );

    useEffect(() => {
        fetchComponents(true);
    }, [fetchComponents]);

    console.log(components);
    return (
        <>
            <div className="flex items-center justify-between mt-3 mb-5">
                <h1 className="font-semibold text-xl text-slate-700">Data Komponen</h1>
                <Link
                    href={'/components/create'}
                    className="px-3 py-2 text-sm bg-cyan-600 text-slate-100 flex items-center justify-center gap-1 rounded-lg"
                >
                    <IconCirclePlus size={18} stroke={2} /> Komponen
                </Link>
            </div>
            {loading?.func === 'fetch' ? (
                <div className="w-full h-screen flex items-center justify-center bg-black/20 fixed top-0 right-0 left-0 gap-2 backdrop-blur-sm">
                    <IconLoader3 className="animate-spin text-blue-700" size={50} />{' '}
                    <span className="text-2xl text-blue-700 animate-bounce font-medium">Loading...</span>
                </div>
            ) : (
                <>
                    <NavigationCard navCard={navCardComponent} />
                    <div className="grid grid-cols-3 gap-5">
                        <ComponentsTable fetchComponents={fetchComponents} components={components} type="Material" />
                        <ComponentsTable fetchComponents={fetchComponents} components={components} type="Addon" />
                        <ComponentsTable fetchComponents={fetchComponents} components={components} type="Finishing" />
                        <ComponentsTable fetchComponents={fetchComponents} components={components} type="Processing" />
                        <ComponentsTable fetchComponents={fetchComponents} components={components} type="Consuming" />
                    </div>{' '}
                </>
            )}
        </>
    );
}
