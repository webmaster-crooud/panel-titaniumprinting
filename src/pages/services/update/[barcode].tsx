import { NavigationCard } from '@/components/Card/Navigation.card';
import { navCard } from '..';
import { Card } from '@/components/Card';
import React, { useCallback, useEffect, useId, useState } from 'react';
import Select, { MultiValue } from 'react-select';
import { useRouter } from 'next/router';
import { IconLoader3, IconTrash } from '@tabler/icons-react';
import { BACKEND } from '../../../../lib/utils';
import { useSetAtom } from 'jotai';
import { alertShow } from '../../../../store/Atom';
import { useAuthToken } from '../../../../hooks/useAuthToken';
import { fetchWithAuth } from '../../../../lib/fetchWithAuth';

export interface DataServiceDetail {
    barcode: string;
    name: string;
    service_product: {
        products: {
            name: string;
            totalPrice: number;
            totalCogs: number;
        };
    }[];
}

export default function CreateServicePage() {
    const router = useRouter();
    const { barcode } = router.query;
    const uniqueId = useId();
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState<string | undefined>(undefined);
    const setAlert = useSetAtom(alertShow);
    const { token, refreshToken } = useAuthToken();
    const fetchDetailService = useCallback(async () => {
        if (!barcode) return;

        setLoading(true);
        try {
            await new Promise((resolve) => setTimeout(resolve, 1500));
            const response = await fetchWithAuth(token, refreshToken, `${BACKEND}/services/${barcode}`);
            const result = await response.json();

            if (result.error === true) {
                console.error(result.message);
                return;
            }

            if (result.data) {
                setName(result.data.name);
            }
        } catch (error) {
            console.error('Error fetching service details:', error);
        } finally {
            setLoading(false);
        }
    }, [barcode, refreshToken, token]);
    useEffect(() => {
        fetchDetailService();
    }, [fetchDetailService]);

    const submitUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!name) {
            console.log('ERROR');
        } else {
            setLoading(true);
            try {
                await new Promise((resolve) => setTimeout(resolve, 1500));
                const response = await fetchWithAuth(token, refreshToken, `${BACKEND}/services/${barcode}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: name,
                    }),
                });
                const result = await response.json();
                if (result.error === true) {
                    setAlert({ type: 'error', message: result.message });
                } else {
                    setAlert({ type: 'success', message: result.message });
                    router.push('/services');
                }
            } catch (error) {
                console.log('ERROR');
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <section className="relative py-8">
            <NavigationCard navCard={navCard} />
            <div className="grid grid-cols-5 gap-5 items-start">
                <Card className={`${loading ? 'animate-pulse' : 'animate-none'} col-span-3 rounded-tl-none`}>
                    <form onSubmit={submitUpdate}>
                        <div className="grid grid-cols-2 gap-5 mt-5">
                            <div>
                                <label htmlFor="nameService" className="font-semibold text-sm block">
                                    Layanan
                                </label>
                                <input
                                    type="text"
                                    className="px-3 mt-2 py-2 rounded-lg w-full bg-slate-50 outline-none"
                                    autoComplete="off"
                                    autoFocus
                                    required
                                    value={name}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                                    placeholder="Masukan nama layanan..."
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="px-3 py-2 bg-blue-600 text-slate-100 rounded-lg text-sm mt-3 float-end disabled:opacity-75"
                        >
                            {loading ? (
                                <div className="flex items-center justify-center gap-2">
                                    <IconLoader3 size={16} stroke={2} className="animate-spin" /> Loading ...
                                </div>
                            ) : (
                                'Simpan'
                            )}
                        </button>
                    </form>
                </Card>
            </div>
        </section>
    );
}
