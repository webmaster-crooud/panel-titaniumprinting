import { IconCheck, IconCirclePlus, IconLoader3, IconTransform, IconTrash, IconUpload, IconX } from '@tabler/icons-react';
import React, { useEffect, useState } from 'react';

import { Card } from '@/components/Card';
import { BACKEND } from '../../../lib/utils';
import { useSetAtom } from 'jotai';
import { alertShow } from '../../../store/Atom';
import { useAuthToken } from '../../../hooks/useAuthToken';
import { fetchWithAuth } from '../../../lib/fetchWithAuth';

interface Categories {
    categoryId: number | string;
}

type propsCategoriesProductModal = {
    categoryId: string | number;
    barcode: string | number;
    fetchProduct: () => Promise<void>;
};

type propsCategoriesCreateProductModal = {
    fetchProduct: () => Promise<void>;
    barcode: string | number;
};

export const CategoriesUpdateProductModal: React.FC<propsCategoriesProductModal> = ({ categoryId, barcode, fetchProduct }) => {
    const [modal, setModal] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [categories, setCategories] = useState<Categories>({ categoryId: categoryId });
    const [categoryList, setCategoryList] = useState<{ id: number; name: string }[]>([]);
    const setAlert = useSetAtom(alertShow);

    const { token, refreshToken } = useAuthToken();
    useEffect(() => {
        const fetchCategoryList = async () => {
            try {
                const response = await fetchWithAuth(token, refreshToken, `${BACKEND}/categories`);
                const result = await response.json();
                if (result.error === true) {
                    setAlert({ type: 'error', message: result.message });
                }
                setCategoryList(result.data);
            } catch (error) {
                setAlert({ type: 'error', message: `${error}` });
            }
        };
        fetchCategoryList();
    }, [setAlert, token, refreshToken]);

    const OptionCategory = () => {
        if (categoryList) {
            return categoryList.map((category, index) => (
                <option value={category.id} key={index}>
                    {category.name}
                </option>
            ));
        }
    };

    const submitUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        try {
            await new Promise((resolve) => setTimeout(resolve, 1500));
            const response = await fetchWithAuth(token, refreshToken, `${BACKEND}/products/update/category/${barcode}/${categoryId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(categories),
            });
            const result = await response.json();
            if (result.error === true) {
                setAlert({ type: 'error', message: result.message });
            } else {
                setAlert({ type: 'success', message: result.message });
                setModal(false);
                fetchProduct();
            }
        } catch (error) {
            setAlert({ type: 'error', message: `${error}` });
        } finally {
            setLoading(false);
        }
    };
    return (
        <>
            <button className="text-blue-500" type="button" onClick={() => setModal(true)}>
                <IconTransform size={17} stroke={2} />
            </button>

            {/* Update Modal */}
            {modal && (
                <div className="fixed top-0 left-0 right-0 w-full h-screen z-[22]">
                    <div className="flex items-center justify-center h-full w-full bg-black/10 backdrop-blur-sm">
                        <Card className="w-4/12 mx-auto">
                            <div className="flex items-center justify-end">
                                <button onClick={() => setModal(false)}>
                                    <IconX size={25} stroke={2} />
                                </button>
                            </div>

                            {/* Card body */}
                            <form onSubmit={submitUpdate}>
                                <div className="my-5">
                                    <div className="relative mb-6">
                                        <label
                                            htmlFor="nameProduct"
                                            className="uppercase text-sm font-semibold text-slate-800 bg-slate-200 absolute -top-2.5 left-3"
                                        >
                                            Kategori Produk
                                        </label>
                                        <select
                                            name="categoryId"
                                            className="px-3 py-2 text-sm appearance-none text-center bg-slate-200 w-full border-2 border-slate-800 rounded-lg outline-none"
                                            value={categories.categoryId}
                                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                                                setCategories({ categoryId: parseInt(e.target.value) })
                                            }
                                        >
                                            <OptionCategory />
                                        </select>
                                    </div>
                                </div>

                                <div className="flex items-center justify-end">
                                    <button
                                        disabled={loading}
                                        type="submit"
                                        className="px-3 py-2 text-sm text-slate-100 bg-sky-500 rounded-lg disabled:opacity-70"
                                    >
                                        <div className="flex items-center justify-center gap-1">
                                            {loading ? (
                                                <IconLoader3 className="animate-spin" size={17} stroke={2} />
                                            ) : (
                                                <IconUpload size={17} stroke={2} />
                                            )}{' '}
                                            <span>Simpan</span>
                                        </div>
                                    </button>
                                </div>
                            </form>
                        </Card>
                    </div>
                </div>
            )}
        </>
    );
};

export const CategoriesCreateProductModal: React.FC<propsCategoriesCreateProductModal> = ({ fetchProduct, barcode }) => {
    const [modalCreate, setModalCreate] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [categories, setCategories] = useState<Categories>({ categoryId: '' });
    const [categoryList, setCategoryList] = useState<{ id: number; name: string }[]>([]);
    const setAlert = useSetAtom(alertShow);

    const { token, refreshToken } = useAuthToken();
    useEffect(() => {
        const fetchCategoryList = async () => {
            try {
                const response = await fetchWithAuth(token, refreshToken, `${BACKEND}/categories`);
                const result = await response.json();
                if (result.error === true) {
                    setAlert({ type: 'error', message: result.message });
                }
                setCategoryList(result.data);
            } catch (error) {
                setAlert({ type: 'error', message: `${error}` });
            }
        };
        fetchCategoryList();
    }, [setAlert, token, refreshToken]);

    const OptionCategory = () => {
        if (categoryList) {
            return categoryList.map((category, index) => (
                <option value={category.id} key={index}>
                    {category.name}
                </option>
            ));
        }
    };

    const submitCreate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        try {
            await new Promise((resolve) => setTimeout(resolve, 1500));
            const response = await fetchWithAuth(token, refreshToken, `${BACKEND}/products/category/create`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    categoryId: categories.categoryId,
                    barcode: barcode,
                }),
            });
            const result = await response.json();
            if (result.error === true) {
                setAlert({ type: 'error', message: result.message });
            } else {
                setAlert({ type: 'success', message: result.message });
                setModalCreate(false);
                fetchProduct();
            }
        } catch (error) {
            setAlert({ type: 'error', message: `${error}` });
        } finally {
            setLoading(false);
        }
    };
    return (
        <>
            <button className="bg-blue-500 text-slate-100 px-3 py-1 mt-1 text-sm rounded-full" type="button" onClick={() => setModalCreate(true)}>
                <div className="flex items-center justify-center gap-1">
                    <IconCirclePlus size={17} stroke={2} /> <span>Tambah Kategori</span>
                </div>
            </button>

            {/* Update Modal */}
            {modalCreate && (
                <div className="fixed top-0 left-0 right-0 w-full h-screen z-[22]">
                    <div className="flex items-center justify-center h-full w-full bg-black/10 backdrop-blur-sm">
                        <Card className="w-4/12 mx-auto">
                            <div className="flex items-center justify-end">
                                <button onClick={() => setModalCreate(false)}>
                                    <IconX size={25} stroke={2} />
                                </button>
                            </div>

                            {/* Card body */}
                            <form onSubmit={submitCreate}>
                                <div className="my-5">
                                    <div className="relative mb-6">
                                        <label
                                            htmlFor="nameProduct"
                                            className="uppercase text-sm font-semibold text-slate-800 bg-slate-200 absolute -top-2.5 left-3"
                                        >
                                            Kategori Produk
                                        </label>
                                        <select
                                            name="categoryId"
                                            className="px-3 py-2 text-sm appearance-none text-center bg-slate-200 w-full border-2 border-slate-800 rounded-lg outline-none"
                                            value={categories.categoryId}
                                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                                                setCategories({ categoryId: parseInt(e.target.value) })
                                            }
                                        >
                                            <option value={undefined} selected>
                                                --Pilih Kategori---
                                            </option>
                                            <OptionCategory />
                                        </select>
                                    </div>
                                </div>

                                <div className="flex items-center justify-end">
                                    <button
                                        disabled={loading}
                                        type="submit"
                                        className="px-3 py-2 text-sm text-slate-100 bg-sky-500 rounded-lg disabled:opacity-70"
                                    >
                                        <div className="flex items-center justify-center gap-1">
                                            {loading ? (
                                                <IconLoader3 className="animate-spin" size={17} stroke={2} />
                                            ) : (
                                                <IconUpload size={17} stroke={2} />
                                            )}{' '}
                                            <span>Simpan</span>
                                        </div>
                                    </button>
                                </div>
                            </form>
                        </Card>
                    </div>
                </div>
            )}
        </>
    );
};
export const CategoriesDeletedProductModal: React.FC<propsCategoriesProductModal> = ({ categoryId, barcode, fetchProduct }) => {
    const [modalDelete, setModalDelete] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const setAlert = useSetAtom(alertShow);
    const submitDelete = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        try {
            await new Promise((resolve) => setTimeout(resolve, 1500));
            const response = await fetch(`${BACKEND}/products/delete/category/${barcode}/${categoryId}`, {
                method: 'DELETE',
            });
            const result = await response.json();
            if (result.error === true) {
                setAlert({ type: 'error', message: result.message });
            } else {
                setAlert({ type: 'success', message: result.message });
                setModalDelete(false);
                fetchProduct();
            }
        } catch (error) {
            setAlert({ type: 'error', message: `${error}` });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <button className="text-red-500" type="button" onClick={() => setModalDelete(true)}>
                <IconTrash size={16} stroke={2} />
            </button>

            {/* Modal */}
            {modalDelete && (
                <div className="fixed top-0 left-0 right-0 w-full h-screen z-[22]">
                    <div className="flex items-center justify-center h-full w-full bg-black/10 backdrop-blur-sm">
                        <Card className="w-4/12 mx-auto">
                            <div className="flex items-center justify-end">
                                <button onClick={() => setModalDelete(false)}>
                                    <IconX size={25} stroke={2} />
                                </button>
                            </div>

                            {/* Card body */}
                            <form onSubmit={submitDelete}>
                                <div className="my-5">
                                    <p className="text-base font-medium">Apakah anda yakin menghapus kategori ini?</p>
                                </div>

                                <div className="flex items-center justify-end">
                                    <button
                                        disabled={loading}
                                        type="submit"
                                        className="px-3 py-2 text-sm text-slate-100 bg-sky-500 rounded-lg disabled:opacity-70"
                                    >
                                        <div className="flex items-center justify-center gap-1">
                                            {loading ? (
                                                <IconLoader3 className="animate-spin" size={17} stroke={2} />
                                            ) : (
                                                <IconCheck className="animate-pulse" size={17} stroke={2} />
                                            )}{' '}
                                            <span>Hapus</span>
                                        </div>
                                    </button>
                                </div>
                            </form>
                        </Card>
                    </div>
                </div>
            )}
        </>
    );
};
