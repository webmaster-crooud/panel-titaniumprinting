import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useState } from 'react';
import { BACKEND } from '../../../../lib/utils';
import { useSetAtom } from 'jotai';
import { alertShow } from '../../../../store/Atom';
import { Card } from '@/components/Card';
import { Component } from '..';
import { IconArrowBack, IconCirclePlus, IconLoader3 } from '@tabler/icons-react';
import Link from 'next/link';
import CurrencyInput from 'react-currency-input-field';

export default function DetailComponentPage() {
    const router = useRouter();
    const { componentId } = router.query;
    const [component, setComponent] = useState<Component | undefined>(undefined);
    const [loading, setLoading] = useState<{ func: string; status: boolean; idx?: string | number } | undefined>(undefined);
    const setAlert = useSetAtom(alertShow);
    const [name, setName] = useState<string | undefined>('');
    const [typeComponent, setTypeComponent] = useState('');
    const [price, setPrice] = useState<number | undefined | null>(undefined);
    const [cogs, setCogs] = useState<number | undefined | null>(undefined);

    const fetchComponent = useCallback(
        async (useLoading?: boolean) => {
            if (!componentId) {
                router.push('/components');
            }
            if (useLoading) {
                setLoading({ func: 'fetch', status: true });
            } else {
                setLoading(undefined);
            }

            try {
                if (useLoading) {
                    await new Promise((resolve) => setTimeout(resolve, 2000));
                }

                const res = await fetch(`${BACKEND}/components/${componentId}`);
                const result = await res.json();

                if (result.error === true) {
                    setAlert({ type: 'error', message: result.message });
                }
                setAlert({ type: 'success', message: result.message });
                setComponent(result.data);
                setName(result.data.name);
                setTypeComponent(result.data.typeComponent);
                setPrice(result.data.price);
                setCogs(result.data.cogs);
            } catch (error) {
                setAlert({ type: 'error', message: `${error}` });
            } finally {
                setLoading(undefined);
            }
        },
        [setAlert, router, componentId],
    );
    useEffect(() => {
        fetchComponent(true);
    }, [fetchComponent]);

    const data = {
        name,
        typeComponent,
        price: price ? price : 0,
        cogs: cogs ? cogs : 0,
    };
    const submitUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading({ func: 'update', status: true });
        if (!data.name) {
            setAlert({ type: 'error', message: 'Nama Komponen Tidak boleh kosong!' });
        } else {
            try {
                await new Promise((resolve) => setTimeout(resolve, 2000));
                const response = await fetch(`${BACKEND}/components/${componentId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data),
                });
                const result = await response.json();
                if (result.error === true) {
                    setAlert({ type: 'error', message: result.message });
                } else {
                    setAlert({ type: 'success', message: result.message });
                    router.push(`/components`);
                }
            } catch (error) {
                setAlert({ type: 'error', message: `${error}` });
            } finally {
                setLoading(undefined);
            }
        }
    };

    return (
        <>
            {loading?.func === 'fetch' ? (
                <div className="w-full h-screen flex items-center justify-center bg-black/20 fixed top-0 right-0 left-0 gap-2 backdrop-blur-sm">
                    <IconLoader3 className="animate-spin text-blue-700" size={50} />{' '}
                    <span className="text-2xl text-blue-700 animate-bounce font-medium">Loading...</span>
                </div>
            ) : (
                <>
                    <div className="flex items-center justify-between mb-8">
                        <h1 className="text-xl font-semibold text-slate-700">Pengaturan Komponen {component?.name}</h1>
                        <Link
                            href={'/components'}
                            className="px-3 py-2 text-sm bg-sky-600 text-slate-100 font-semibold flex items-center justify-center rounded-lg gap-1"
                        >
                            <IconArrowBack size={18} stroke={3} /> Kembali
                        </Link>
                    </div>
                    <div className="grid grid-cols-2 gap-5">
                        <Card>
                            <form onSubmit={submitUpdate}>
                                <div className="grid grid-cols-2 gap-5">
                                    <div className="relative w-full">
                                        <label
                                            htmlFor="componentName"
                                            className="text-sm uppercase font-semibold text-slate-700 block absolute -top-2.5 bg-slate-200 left-5"
                                        >
                                            Nama Kategori
                                        </label>

                                        <input
                                            type="text"
                                            className="px-3 py-2 text-sm bg-transparent border-2 border-slate-500 rounded-lg w-full"
                                            name="name"
                                            placeholder="Masukan nama komponen..."
                                            autoComplete="off"
                                            value={name}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                                        />
                                    </div>
                                    <div className="w-full relative">
                                        <label
                                            htmlFor="TypeComponent"
                                            className="text-sm uppercase font-semibold text-slate-700 block absolute -top-2.5 bg-slate-200 left-5"
                                        >
                                            Tipe Komponen
                                        </label>

                                        <select
                                            name="typeComponent"
                                            className="px-3 py-2 text-sm bg-transparent border-2 border-slate-500 rounded-lg w-full appearance-none text-center"
                                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setTypeComponent(e.target.value)}
                                        >
                                            <option value={undefined}>--Pilih---</option>
                                            <option value="MATERIAL" selected={typeComponent === 'MATERIAL'}>
                                                Material
                                            </option>
                                            <option value="ADDON" selected={typeComponent === 'ADDON'}>
                                                Addons
                                            </option>
                                            <option value="PROCESSING" selected={typeComponent === 'PROCESSING'}>
                                                Processing
                                            </option>
                                            <option value="CONSUMING" selected={typeComponent === 'CONSUMING'}>
                                                Consuming
                                            </option>
                                            <option value="FINISHING" selected={typeComponent === 'FINISHING'}>
                                                Finishing
                                            </option>
                                        </select>
                                    </div>

                                    {price && (
                                        <div className="relative w-full">
                                            <label
                                                htmlFor="componentPrice"
                                                className="text-sm uppercase font-semibold text-slate-700 block absolute -top-2.5 bg-slate-200 left-5"
                                            >
                                                Harga Jual
                                            </label>

                                            <CurrencyInput
                                                className="px-3 py-2 text-sm bg-transparent border-2 border-slate-500 rounded-lg w-full"
                                                intlConfig={{ locale: 'id-ID', currency: 'IDR' }}
                                                name="price"
                                                placeholder="Masukan harga jual..."
                                                decimalsLimit={0}
                                                defaultValue={price}
                                                autoComplete="off"
                                                onValueChange={(value, name, values) => setPrice(values ? values.float : 0)}
                                            />
                                        </div>
                                    )}

                                    {cogs && (
                                        <div className="relative w-full">
                                            <label
                                                htmlFor="componentPrice"
                                                className="text-sm uppercase font-semibold text-slate-700 block absolute -top-2.5 bg-slate-200 left-5"
                                            >
                                                Harga Modal
                                            </label>

                                            <CurrencyInput
                                                className="px-3 py-2 text-sm bg-transparent border-2 border-slate-500 rounded-lg w-full"
                                                intlConfig={{ locale: 'id-ID', currency: 'IDR' }}
                                                name="cogs"
                                                placeholder="Masukan harga jual..."
                                                decimalsLimit={0}
                                                defaultValue={cogs}
                                                autoComplete="off"
                                                onValueChange={(value, name, values) => setCogs(values ? values.float : undefined)}
                                            />
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-center justify-end mt-5">
                                    <button
                                        type="submit"
                                        disabled={loading?.func === 'update' && loading.status}
                                        className="flex items-center justify-center gap-1 px-3 py-2 text-sm font-semibold bg-sky-500 text-slate-100 rounded-lg disabled:opacity-60"
                                    >
                                        {loading ? (
                                            <div className="flex items-center justify-center gap-4">
                                                <IconLoader3 className="animate-spin" size={16} stroke={2} />{' '}
                                                <span className="animate-pulse">Loading...</span>
                                            </div>
                                        ) : (
                                            <> Simpan</>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </Card>

                        <Link
                            href={`/components/create/qualities/${componentId}`}
                            className=" px-3 py-2 font-semibold uppercase w-6/12 mx-auto bg-sky-500 text-slate-100 rounded-lg flex items-center justify-center"
                        >
                            <div className="flex items-center justify-center gap-1">
                                <IconCirclePlus size={25} stroke={2} /> Kualitas
                            </div>
                        </Link>
                    </div>
                </>
            )}
        </>
    );
}
