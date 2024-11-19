import { IconLoader3, IconTransform, IconUpload, IconX } from '@tabler/icons-react';
import React, { useState } from 'react';
import { Tooltip } from 'react-tippy';
import { DetailProducts } from '../../pages/products/[barcode]';
import { Card } from '@/components/Card';
import { useSetAtom } from 'jotai';
import { alertShow } from '../../../store/Atom';
import { BACKEND } from '../../../lib/utils';

type propsProductUpdateModal = {
    product?: DetailProducts;
    barcode?: string;
    fetchProduct: () => Promise<void>;
};
export const ProductUpdateModal: React.FC<propsProductUpdateModal> = ({ product, barcode, fetchProduct }) => {
    const [openModal, setOpenModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const setAlert = useSetAtom(alertShow);
    const [name, setName] = useState(product?.name ? product.name : '');
    const [slug, setSlug] = useState(product?.slug ? product.slug : '');
    const [description, setDescription] = useState(product?.description ? product.description : '');

    const submitUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        try {
            await new Promise((resolve) => setTimeout(resolve, 2000));
            const response = await fetch(`${BACKEND}/products/update/${barcode}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name,
                    slug,
                    description,
                }),
            });
            const result = await response.json();
            if (result.error === true) {
                setAlert({ type: 'error', message: result.message });
            } else {
                fetchProduct();
                setAlert({ type: 'success', message: result.message });
            }
        } catch (error) {
            setAlert({ type: 'error', message: `${error}` });
        } finally {
            setLoading(false);
            setOpenModal(false);
        }
    };
    return (
        <>
            <Tooltip title="Perubahan" size="small" position="top" arrow>
                <button className="text-blue-500 mt-1.5" onClick={() => setOpenModal(true)}>
                    <IconTransform size={17} stroke={2} />
                </button>
            </Tooltip>

            {/* Modal */}
            {openModal && (
                <div className="fixed top-0 left-0 right-0 w-full h-screen z-[22]">
                    <div className="flex items-center justify-center h-full w-full bg-black/10 backdrop-blur-sm">
                        <Card className="w-4/12 mx-auto">
                            <div className="flex items-center justify-end">
                                <button onClick={() => setOpenModal(false)}>
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
                                            Nama Produk
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            className="px-3 py-2 text-sm bg-slate-200 w-full border-2 border-slate-800 rounded-lg outline-none"
                                            value={name}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                                            autoComplete="off"
                                            required
                                        />
                                    </div>
                                    <div className="relative mb-6">
                                        <label
                                            htmlFor="slugProduct"
                                            className="uppercase text-sm font-semibold text-slate-800 bg-slate-200 absolute -top-2.5 left-3"
                                        >
                                            Slug Produk
                                        </label>
                                        <input
                                            type="text"
                                            name="slug"
                                            className="px-3 py-2 text-sm bg-slate-200 w-full border-2 border-slate-800 rounded-lg outline-none"
                                            value={slug}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSlug(e.target.value)}
                                            autoComplete="off"
                                            required
                                        />
                                    </div>
                                    <div className="relative">
                                        <label
                                            htmlFor="descriptionProduct"
                                            className="uppercase text-sm font-semibold text-slate-800 bg-slate-200 absolute -top-2.5 left-3"
                                        >
                                            Deskripsi Produk
                                        </label>
                                        <textarea
                                            name="description"
                                            className="px-3 py-2 text-sm bg-slate-200 w-full border-2 border-slate-800 rounded-lg outline-none"
                                            value={description}
                                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
                                            autoComplete="off"
                                            required
                                            rows={3}
                                        />
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
