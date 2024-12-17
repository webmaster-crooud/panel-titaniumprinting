import { IconAdjustmentsCog, IconCloudUpload, IconLoader3, IconX } from '@tabler/icons-react';
import { Size, Tooltip } from 'react-tippy';
import React, { useCallback, useEffect, useState } from 'react';
import { useSetAtom } from 'jotai';
import { alertShow } from '../../../store/Atom';
import { Card } from '../Card';
import { fetchWithAuth } from '../../../lib/fetchWithAuth';
import { useAuthToken } from '../../../hooks/useAuthToken';
import { BACKEND } from '../../../lib/utils';

interface Sizes {
    id: number | string;
    name: string;
    width: number | string;
    height: number | string;
    length: number | string;
    weight: number | string;
}

type propsQualitiesUpdateModal = {
    sizeId: number | null;
    fetchSize: () => Promise<void>;
};

export const SizeUpdateModal: React.FC<propsQualitiesUpdateModal> = ({ sizeId, fetchSize }) => {
    const { token, refreshToken } = useAuthToken();
    const [loading, setLoading] = useState(false);
    const setAlert = useSetAtom(alertShow);
    const [modal, setModal] = useState<{ sizeId: number | null } | undefined>(undefined);
    const [formSize, setFormSize] = useState<Sizes>({
        id: 0,
        name: '',
        height: 0,
        length: 0,
        weight: 0,
        width: 0,
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormSize((prev) => {
            let result: Sizes = { ...prev };

            result[e.target.name as keyof Sizes] = e.target.value;

            return result;
        });
    };

    const fetchDetailSize = async () => {
        setLoading(true);
        try {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            const response = await fetchWithAuth(token, refreshToken, `${BACKEND}/sizes/${sizeId}`);
            const result = await response.json();
            if (result.error) {
                setModal(undefined);
                setAlert({ type: 'error', message: result.message });
            } else {
                setFormSize(result.data);
            }
        } catch (error) {
            setAlert({ type: 'error', message: `${error}` });
        } finally {
            setLoading(false);
        }
    };

    const handlerUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        try {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            const response = await fetchWithAuth(token, refreshToken, `${BACKEND}/sizes/${sizeId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formSize),
            });
            const result = await response.json();
            if (result.error) {
                setAlert({ type: 'error', message: result.message });
            } else {
                setModal(undefined);
                setFormSize({
                    id: 0,
                    name: '',
                    height: 0,
                    length: 0,
                    weight: 0,
                    width: 0,
                });
                setAlert({ type: 'success', message: result.message });
                fetchSize();
            }
        } catch (error) {
            setAlert({ type: 'error', message: `${error}` });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Tooltip title="Pengaturan" size="small" arrow position="top">
                <button
                    type="button"
                    onClick={() => {
                        setModal({ sizeId });
                        fetchDetailSize();
                    }}
                >
                    <IconAdjustmentsCog stroke={2} size={18} className="text-blue-700 mt-1.5" />
                </button>
            </Tooltip>

            {/* Modal */}

            {modal?.sizeId === sizeId && (
                <div className="fixed top-0 left-0 right-0 w-full h-full bg-black/10 backdrop-blur-sm flex items-center justify-center z-10">
                    {loading ? (
                        <Card className="relative w-4/12 mx-auto">
                            <div className="flex items-center justify-center w-full h-36">
                                <IconLoader3 size={25} stroke={2.5} className="animate-spin" />
                            </div>
                        </Card>
                    ) : (
                        <Card className="relative w-4/12 mx-auto">
                            <div className="flex items-center justify-between">
                                <h2 className="text-blue-900 font-semibold text-xl">Tambah Ukuran Baru</h2>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setModal(undefined);
                                        setFormSize({
                                            id: 0,
                                            name: '',
                                            height: 0,
                                            length: 0,
                                            weight: 0,
                                            width: 0,
                                        });
                                    }}
                                >
                                    <IconX size={25} stroke={2.5} className="text-blue-900" />
                                </button>
                            </div>

                            <form onSubmit={handlerUpdate}>
                                <div className="my-5">
                                    {/* Card */}

                                    <div className="bg-slate-100 w-full border border-slate-400 rounded-xl p-6 pb-8 shadow-lg">
                                        <div>
                                            <div>
                                                <label htmlFor="sizeName" className="text-sm font-semibold">
                                                    Nama Ukuran
                                                </label>
                                                <input
                                                    name="name"
                                                    type="text"
                                                    placeholder="A4"
                                                    value={formSize.name}
                                                    onChange={handleInputChange}
                                                    className={`text-sm font-medium bg-slate-100 w-full border border-slate-300 text-slate-700 px-4 py-2 rounded-lg block mt-1`}
                                                    autoComplete="off"
                                                />
                                            </div>
                                            <div className="grid grid-cols-2 gap-3 my-3">
                                                <div>
                                                    <label htmlFor="sizeLength" className="text-sm font-semibold">
                                                        Panjang
                                                    </label>
                                                    <div className="flex items-center justify-end bg-slate-100 w-full border border-slate-300 text-slate-700 rounded-lg mt-1 overflow-hidden">
                                                        <input
                                                            name="length"
                                                            type="text"
                                                            placeholder="20"
                                                            value={formSize.length}
                                                            onChange={handleInputChange}
                                                            className={`text-sm font-medium px-4 py-2 w-full bg-slate-100 outline-none`}
                                                            autoComplete="off"
                                                        />
                                                        <div className="text-sm py-2 px-4 font-bold bg-slate-300 text-blue-800">CM</div>
                                                    </div>
                                                </div>
                                                <div>
                                                    <label htmlFor="sizeWidth" className="text-sm font-semibold">
                                                        Lebar
                                                    </label>
                                                    <div className="flex items-center justify-end bg-slate-100 w-full border border-slate-300 text-slate-700 rounded-lg mt-1 overflow-hidden">
                                                        <input
                                                            type="text"
                                                            placeholder="20"
                                                            name="width"
                                                            value={formSize.width}
                                                            onChange={handleInputChange}
                                                            className={`text-sm font-medium px-4 py-2 w-full bg-slate-100 outline-none`}
                                                            autoComplete="off"
                                                        />
                                                        <div className="text-sm py-2 px-4 font-bold bg-slate-300 text-blue-800">CM</div>
                                                    </div>
                                                </div>
                                                <div>
                                                    <label htmlFor="sizeHeight" className="text-sm font-semibold">
                                                        Tinggi
                                                    </label>
                                                    <div className="flex items-center justify-end bg-slate-100 w-full border border-slate-300 text-slate-700 rounded-lg mt-1 overflow-hidden">
                                                        <input
                                                            type="text"
                                                            placeholder="20"
                                                            name="height"
                                                            value={formSize.height}
                                                            onChange={handleInputChange}
                                                            className={`text-sm font-medium px-4 py-2 w-full bg-slate-100 outline-none`}
                                                            autoComplete="off"
                                                        />
                                                        <div className="text-sm py-2 px-4 font-bold bg-slate-300 text-blue-800">CM</div>
                                                    </div>
                                                </div>
                                                <div>
                                                    <label htmlFor="sizeWeight" className="text-sm font-semibold">
                                                        Berat
                                                    </label>
                                                    <div className="flex items-center justify-end bg-slate-100 w-full border border-slate-300 text-slate-700 rounded-lg mt-1 overflow-hidden">
                                                        <input
                                                            type="text"
                                                            placeholder="20"
                                                            name="weight"
                                                            value={formSize.weight}
                                                            onChange={handleInputChange}
                                                            className={`text-sm font-medium px-4 py-2 w-full bg-slate-100 outline-none`}
                                                            autoComplete="off"
                                                        />
                                                        <div className="text-sm py-2 px-4 font-bold bg-slate-300 text-blue-800">G</div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-start gap-1">
                                                <label htmlFor="sizeDimension" className="text-sm font-semibold">
                                                    Luas:
                                                </label>
                                                <span>{Number(formSize.length) * Number(formSize.width)}</span>
                                                <p className="text-sm">
                                                    CM <sup className="text-xs">2</sup>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-end">
                                    <button type="submit" disabled={loading} className="px-5 py-2 bg-blue-900 text-blue-100 rounded-lg">
                                        <div className="flex items-center justify-center gap-1">
                                            {loading ? (
                                                <>
                                                    <IconLoader3 className="animate-spin" size={16} stroke={2} />{' '}
                                                    <span className="text-sm font-semibold">Proses</span>
                                                </>
                                            ) : (
                                                <>
                                                    <IconCloudUpload size={16} stroke={2} /> <span className="text-sm font-semibold">Simpan</span>
                                                </>
                                            )}
                                        </div>
                                    </button>
                                </div>
                            </form>
                        </Card>
                    )}
                </div>
            )}
        </>
    );
};
