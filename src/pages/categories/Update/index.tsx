import React, { useState } from 'react';
import { DataCategories } from '..';
import { useSetAtom } from 'jotai';
import { alertShow } from '../../../../store/Atom';
import { BACKEND } from '../../../../lib/utils';
import { IconLoader3 } from '@tabler/icons-react';

type propsFormUpdateCategories = {
    id: number | undefined;
    name: string | undefined;
    fetchCategories: () => Promise<void>;
};
export const FormUpdateCategories: React.FC<propsFormUpdateCategories> = ({ id, name, fetchCategories }) => {
    const [loading, setLoading] = useState(false);
    const [errorValidation, setErrorValidation] = useState<{ name: string; message: string } | undefined>(undefined);
    const [nameUpdate, setNameUpdate] = useState<string | undefined>(name);
    const setAlert = useSetAtom(alertShow);

    const handlerChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNameUpdate(e.target.value);
        setErrorValidation(undefined);
    };

    const submitUpdateCategory = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!name) {
            setErrorValidation({ name: 'name', message: 'Nama Kategor tidak boleh kosong!' });
            return;
        } else {
            setLoading(true);
            try {
                await new Promise((resolve) => setTimeout(resolve, 1500));
                const response = await fetch(`${BACKEND}/categories/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name: nameUpdate }),
                });

                const result = await response.json();
                if (result.error === true) {
                    setAlert({ type: 'error', message: `${result.message}` });
                } else {
                    setAlert({ type: 'success', message: `${result.message}` });
                    fetchCategories();
                }
            } catch (error) {
                setAlert({ type: 'error', message: `${error}` });
            } finally {
                setLoading(false);
            }
        }
    };
    return (
        <>
            <form onSubmit={submitUpdateCategory}>
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
                    value={nameUpdate}
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
        </>
    );
};
