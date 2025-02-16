import {
    IconCloudUpload,
    IconTransform,
    IconEyeOff,
    IconLoader3,
    IconNumber123,
    IconSearch,
    IconSettings2,
    IconTrash,
    IconX,
} from '@tabler/icons-react';
import { DataCategories } from '../../pages/categories';
import React, { useState } from 'react';

import { useSetAtom } from 'jotai';
import { alertShow } from '../../../store/Atom';
import { BACKEND } from '../../../lib/utils';

const CategoriesTable = ({
    categories,
    fetchCategories,
    handlerUpdate,
    update,
    setUpdate,
}: {
    categories: DataCategories[];
    fetchCategories: any;
    handlerUpdate?: any;
    update?: any;
    setUpdate?: any;
}) => {
    const [search, setSearch] = useState<string>('');
    const [loadingDeleted, setLoadingDeleted] = useState<{ status: boolean; id: number } | undefined>(undefined);
    const [loadingDisabled, setLoadingDisabled] = useState<{ status: boolean; id: number } | undefined>(undefined);
    const setAlert = useSetAtom(alertShow);
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    };
    categories = categories?.filter((category) => category?.name.toLocaleLowerCase().includes(search?.toLowerCase()));

    const handleDeletedCategory = async (id: number) => {
        setLoadingDeleted({ status: true, id });
        try {
            await new Promise((resolve) => setTimeout(resolve, 1500));
            const response = await fetch(`${BACKEND}/categories/${id}`, {
                method: 'DELETE',
            });
            const result = await response.json();
            if (result.error === true) {
                setAlert({ type: 'error', message: result.message });
                return;
            } else {
                setAlert({ type: 'success', message: result.message });
                fetchCategories();
            }
        } catch (error) {
            setAlert({ type: 'error', message: 'Terjadi Kesalahan Fatal!' });
        } finally {
            setLoadingDeleted(undefined);
        }
    };
    const handleDisabledCategory = async (id: number) => {
        setLoadingDisabled({ status: true, id });
        try {
            await new Promise((resolve) => setTimeout(resolve, 1500));
            const response = await fetch(`${BACKEND}/categories/${id}`, {
                method: 'PATCH',
            });
            const result = await response.json();
            if (result.error === true) {
                setAlert({ type: 'error', message: result.message });
                return;
            } else {
                setAlert({ type: 'success', message: result.message });
                fetchCategories();
            }
        } catch (error) {
            setAlert({ type: 'error', message: 'Terjadi Kesalahan Fatal!' });
        } finally {
            setLoadingDisabled(undefined);
        }
    };

    return (
        <>
            <div className="flex items-center justify-center mb-5 border border-slate-400 rounded-lg w-8/12 mx-auto">
                <input
                    type="text"
                    className="w-full rounded-l-lg bg-blue-50 text-slate-800 px-3 py-2 text-sm outline-none"
                    placeholder="Cari Kategori..."
                    autoComplete="off"
                    value={search}
                    onChange={handleSearch}
                />
                <div className="px-3 py-2 bg-slate-50 rounded-r-lg">
                    <IconSearch size={20} stroke={2} />
                </div>
            </div>
            <table className="w-full">
                <thead className="bg-slate-600 text-slate-50">
                    <tr>
                        <th>
                            <div className="flex items-center justify-center">
                                <IconNumber123 size={18} />
                            </div>
                        </th>
                        <th className="py-1 font-medium text-start text-sm">Nama Kategori</th>
                        <th>
                            <div className="flex items-center justify-center">
                                <IconSettings2 size={18} />
                            </div>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {categories?.map((category, index) => (
                        <tr className="border-b border-slate-400 text-slate-600" key={index}>
                            <td className="text-center">{index + 1}</td>
                            <td className="py-2 font-medium text-start">{category.name}</td>
                            <td className="pe-2">
                                {category.flag === 'ACTIVED' ? (
                                    <div className="flex items-center justify-center gap-2">
                                        {update?.status && update?.id === category.id ? (
                                            <button type="button" onClick={() => setUpdate(undefined)}>
                                                <IconX size={20} stroke={2} className="text-red-600" />
                                            </button>
                                        ) : (
                                            <button type="button" onClick={() => handlerUpdate(category.id, category.name)}>
                                                <IconTransform size={20} stroke={2} className="text-blue-600" />
                                            </button>
                                        )}

                                        <button onClick={() => handleDisabledCategory(category.id)}>
                                            {loadingDisabled?.id === category.id ? (
                                                <IconLoader3 size={20} stroke={2} className="animate-spin text-slate-800" />
                                            ) : (
                                                <IconEyeOff size={20} stroke={2} className="text-red-600" />
                                            )}
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center gap-2">
                                        <button onClick={() => handleDisabledCategory(category.id)}>
                                            {loadingDisabled?.id === category.id ? (
                                                <IconLoader3 size={18} stroke={2} className="animate-spin text-slate-800" />
                                            ) : (
                                                <IconCloudUpload size={20} stroke={2} className="text-blue-600" />
                                            )}
                                        </button>
                                        <button onClick={() => handleDeletedCategory(category.id)}>
                                            {loadingDeleted?.id === category.id ? (
                                                <IconLoader3 size={18} stroke={2} className="animate-spin text-slate-800" />
                                            ) : (
                                                <IconTrash size={18} stroke={2} className="text-red-600" />
                                            )}
                                        </button>
                                    </div>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );
};
export default CategoriesTable;
