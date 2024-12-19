import { Card } from '@/components/Card';
import { IconArrowBack, IconCloudUpload, IconCoins, IconLoader3, IconPercentage, IconX } from '@tabler/icons-react';
import Link from 'next/link';
import React, { useState } from 'react';
import CurrencyInput from 'react-currency-input-field';
import { useAuthToken } from '../../../hooks/useAuthToken';
import { useSetAtom } from 'jotai';
import { alertShow } from '../../../store/Atom';
import { fetchWithAuth } from '../../../lib/fetchWithAuth';
import { BACKEND } from '../../../lib/utils';
import { useRouter } from 'next/router';

export interface Promotion {
    code: string;
    price?: string | number | string[];
    percent?: string | number;
    banner?: File;
    description?: string;
    start: Date | string;
    end: Date | string;
}

export default function PromotionCreatePage() {
    const router = useRouter();
    const [loading, setLoading] = useState<boolean>(false);
    const [disc, setDisc] = useState<{ field: string } | undefined>(undefined);
    const { token, refreshToken } = useAuthToken();
    const setAlert = useSetAtom(alertShow);
    const [promotion, setPromotion] = useState<Promotion>({ code: '', start: '', end: '' });
    const handlerChangeinput = (field: string, value: string | number | Date | undefined) => {
        setPromotion({ ...promotion, [field]: value });
    };

    const HandlerSubmit = async (e: React.FocusEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetchWithAuth(token, refreshToken, `${BACKEND}/promotions`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(promotion),
            });
            const result = await response.json();
            if (result.error) {
                setAlert({ type: 'error', message: `${result.message}` });
            } else {
                setAlert({ type: 'success', message: `${result.message}` });
                router.push('/promotions');
            }
        } catch (error) {
            setAlert({ type: 'error', message: `${error}` });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="mt-8 w-7/12">
            <div className="flex items-center justify-between">
                <h1 className="text-lg font-semibold text-blue-900">Formulir Data Promosi</h1>
                <div className="flex items-center justify-end gap-2">
                    <Link
                        href={'/promotions'}
                        className="flex items-center justify-center gap-1 px-4 py-2 text-sm rounded-lg bg-red-600 text-slate-100"
                    >
                        <IconArrowBack size={17} stroke={2} />
                        <span>Kembali</span>
                    </Link>
                </div>
            </div>
            <form onSubmit={HandlerSubmit} className="grid grid-cols-2 gap-3 mt-5">
                <div>
                    <label htmlFor="codePromotion" className="text-sm font-semibold">
                        Kode Promosi
                    </label>
                    <input
                        type="text"
                        placeholder="Kode Promosi"
                        name="code"
                        className={`text-sm font-medium bg-slate-100 w-full border border-slate-300 text-slate-700 px-4 py-2 rounded-lg block mt-1`}
                        value={promotion.code}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handlerChangeinput(e.target.name, e.target.value)}
                        autoComplete="off"
                    />
                </div>
                <div>
                    <label htmlFor="nameComponent" className="text-sm font-semibold">
                        Potongan
                    </label>
                    <div className="flex items-center justify-center gap-2 mt-1">
                        {!disc && (
                            <>
                                <button
                                    className="w-full py-2 bg-blue-900 text-slate-100 text-sm font-semibold rounded-lg"
                                    onClick={() => setDisc({ field: 'price' })}
                                >
                                    <div className="flex items-center justify-center">
                                        <IconCoins size={20} stroke={2} />
                                    </div>
                                </button>
                                <button
                                    className="w-full py-2 bg-blue-900 text-slate-100 text-sm font-semibold rounded-lg"
                                    onClick={() => setDisc({ field: 'percent' })}
                                >
                                    <div className="flex items-center justify-center">
                                        <IconPercentage size={20} stroke={2} />
                                    </div>
                                </button>
                            </>
                        )}
                        {disc?.field === 'price' && (
                            <div className="flex items-center justify-end gap-2 w-full">
                                <div className="text-sm font-medium bg-slate-100 w-full border border-slate-300 text-slate-700 rounded-lg  flex items-center justify-center overflow-hidden">
                                    <div className="px-2 py-2 w-2/12 bg-white flex items-center justify-center">Rp</div>
                                    <CurrencyInput
                                        className="px-4 py-2 bg-inherit outline-none w-full"
                                        decimalsLimit={0}
                                        name="price"
                                        value={promotion?.price}
                                        intlConfig={{ locale: 'id-ID' }}
                                        onValueChange={(values, name, value) => {
                                            !name ? handlerChangeinput('price', values) : handlerChangeinput(name, values);
                                        }}
                                    />
                                </div>

                                <button
                                    className="px-2 py-2 bg-pink-600 text-pink-100 rounded"
                                    onClick={() => {
                                        setDisc(undefined);
                                        setPromotion({ ...promotion, price: undefined });
                                    }}
                                >
                                    <IconX size={18} stroke={2} />
                                </button>
                            </div>
                        )}
                        {disc?.field === 'percent' && (
                            <div className="flex items-center justify-end gap-2 w-full">
                                <div className="text-sm font-medium bg-slate-100 w-full border border-slate-300 text-slate-700 rounded-lg  flex items-center justify-center overflow-hidden">
                                    <input
                                        type="text"
                                        value={promotion?.percent}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handlerChangeinput(e.target.name, e.target.value)}
                                        name="percent"
                                        placeholder="10"
                                        className="px-4 py-2 bg-inherit outline-none w-full"
                                    />
                                    <div className="px-2 py-2 w-2/12 bg-white flex items-center justify-center">%</div>
                                </div>
                                <button
                                    className="px-2 py-2 bg-pink-600 text-pink-100 rounded"
                                    onClick={() => {
                                        setDisc(undefined);
                                        setPromotion({ ...promotion, percent: undefined });
                                    }}
                                >
                                    <IconX size={18} stroke={2} />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
                <div className="col-span-2">
                    <label htmlFor="description" className="text-sm font-semibold">
                        Deskripsi
                    </label>
                    <textarea
                        name="description"
                        className={`text-sm font-medium bg-slate-100 w-full border border-slate-300 text-slate-700 px-4 py-2 rounded-lg block mt-1`}
                        placeholder="Masukan deskripsi singkat..."
                        rows={3}
                        value={promotion.description}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handlerChangeinput(e.target.name, e.target.value)}
                    />
                    <div className="flex items-center justify-end">
                        <p className="text-xs font-semibold mt-1 text-blue-900">0/1000</p>
                    </div>
                </div>

                <div>
                    <label htmlFor="start" className="text-sm font-semibold">
                        Mulai Promosi
                    </label>
                    <input
                        type="datetime-local"
                        placeholder="Kode Promosi"
                        name="start"
                        className={`text-sm font-medium bg-slate-100 w-full border border-slate-300 text-slate-700 px-4 py-2 rounded-lg block mt-1`}
                        value={
                            promotion.start instanceof Date
                                ? promotion.start.toISOString().slice(0, 16) // Convert Date to 'yyyy-MM-ddTHH:mm' format
                                : promotion.start
                        }
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handlerChangeinput(e.target.name, e.target.value)}
                        autoComplete="off"
                    />
                </div>
                <div>
                    <label htmlFor="end" className="text-sm font-semibold">
                        Batas Promosi
                    </label>
                    <input
                        type="datetime-local"
                        placeholder="Kode Promosi"
                        name="end"
                        className={`text-sm font-medium bg-slate-100 w-full border border-slate-300 text-slate-700 px-4 py-2 rounded-lg block mt-1`}
                        value={
                            promotion.end instanceof Date
                                ? promotion.end.toISOString().slice(0, 16) // Convert Date to 'yyyy-MM-ddTHH:mm' format
                                : promotion.end
                        }
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handlerChangeinput(e.target.name, e.target.value)}
                        autoComplete="off"
                    />
                </div>

                <div className="flex items-center justify-end col-span-2">
                    <button type="submit" disabled={loading} className="px-8 py-2 text-sm font-semibold bg-blue-900 text-slate-100 rounded-lg">
                        <div className="flex items-center justify-center gap-2">
                            {loading ? (
                                <>
                                    <IconLoader3 className="animate-spin" size={16} stroke={2} /> <span>Simpan</span>
                                </>
                            ) : (
                                <>
                                    <IconCloudUpload size={16} stroke={2} /> <span>Simpan</span>
                                </>
                            )}
                        </div>
                    </button>
                </div>
            </form>
        </Card>
    );
}
