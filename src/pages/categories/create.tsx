import { NavigationCard } from '@/components/Card/Navigation.card';
import { navCardCategories } from '../../../lib/nav.card';
import { Card } from '@/components/Card';
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { BACKEND } from '../../../lib/utils';
import { useSetAtom } from 'jotai';
import { alertShow } from '../../../store/Atom';
import { IconLoader3 } from '@tabler/icons-react';
import { useAuthToken } from '../../../hooks/useAuthToken';
import { fetchWithAuth } from '../../../lib/fetchWithAuth';

export default function CreateCategoriesPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [errorValidation, setErrorValidation] = useState<{ name: string; message: string } | undefined>(undefined);
    const [name, setName] = useState<string>('');
    const setAlert = useSetAtom(alertShow);
    const { token, refreshToken } = useAuthToken();

    const handlerChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value);
        setErrorValidation(undefined);
    };

    const submitCategory = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!name) {
            setErrorValidation({ name: 'name', message: 'Nama Kategor tidak boleh kosong!' });
            return;
        } else {
            setLoading(true);
            try {
                await new Promise((resolve) => setTimeout(resolve, 1500));
                const response = await fetchWithAuth(token, refreshToken, `${BACKEND}/categories`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name }),
                });

                const result = await response.json();
                if (result.error === true) {
                    setAlert({ type: 'error', message: `${result.message}` });
                } else {
                    setAlert({ type: 'success', message: `${result.message}` });
                    router.push('/categories');
                }
            } catch (error) {
                setAlert({ type: 'error', message: `${error}` });
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <section className="relative py-8">
            <NavigationCard navCard={navCardCategories} />
            <Card className="w-5/12 rounded-tl-none">
                <form onSubmit={submitCategory}>
                    <label htmlFor="categoryName" className="font-semibold mb-1 block ms-2">
                        Kategori
                    </label>
                    <input
                        type="text"
                        className={`px-3 py-2 text-sm rounded-lg w-full bg-white outline-none border-2 ${
                            errorValidation?.name === 'name' ? 'border-red-500' : 'border-white'
                        }`}
                        autoComplete="off"
                        autoFocus
                        placeholder="Nama kategori..."
                        value={name}
                        onChange={handlerChangeName}
                    />
                    <small className="text-red-600">{errorValidation?.name === 'name' && errorValidation.message}</small>
                    <div className="w-full flex items-center justify-end">
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-5 py-2 rounded-lg bg-blue-600 text-slate-100 text-sm font-semibold mt-5 disabled:opacity-70 flex items-center justify-center gap-1"
                        >
                            {loading ? (
                                <>
                                    <IconLoader3 size={16} stroke={2} className="animate-spin" /> Loading...
                                </>
                            ) : (
                                'Simpan'
                            )}
                        </button>
                    </div>
                </form>
            </Card>
        </section>
    );
}
