import { NavigationCard } from '@/components/Card/Navigation.card';
import { navCard } from '.';
import { Card } from '@/components/Card';
import Select, { MultiValue } from 'react-select';
import React, { useEffect, useId, useState } from 'react';

import { useRouter } from 'next/router';
import { IconLoader3 } from '@tabler/icons-react';
import { BACKEND } from '../../../lib/utils';
import { DataCategories } from '../categories';
import { useSetAtom } from 'jotai';
import { alertShow } from '../../../store/Atom';
import { useAuthToken } from '../../../hooks/useAuthToken';
import { fetchWithAuth } from '../../../lib/fetchWithAuth';

interface Services {
    name: string;
}

export default function CreateServicePage() {
    const router = useRouter();
    const uniqueId = useId();
    const setAlert = useSetAtom(alertShow);
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState<string>('');
    const { token, refreshToken } = useAuthToken();

    // Formated Input Form to JSON stringify
    const data: Services = {
        name,
    };

    const submitCreate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!name) {
            console.log('ERROR');
        } else {
            setLoading(true);
            try {
                await new Promise((resolve) => setTimeout(resolve, 1500));
                const response = await fetchWithAuth(token, refreshToken, `${BACKEND}/services`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data),
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
            <div className="grid grid-cols-4 gap-5 items-start">
                <Card className="col-span-2 rounded-tl-none">
                    <form onSubmit={submitCreate}>
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
