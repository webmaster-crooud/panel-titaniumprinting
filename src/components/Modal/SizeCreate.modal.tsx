import { IconCloudUpload, IconLoader3, IconPlus, IconX } from '@tabler/icons-react';
import { Card } from '../Card';
import React, { Dispatch, useState } from 'react';
import { SetStateAction } from 'jotai';
import { fetchWithAuth } from '../../../lib/fetchWithAuth';
import { BACKEND } from '../../../lib/utils';

type propsSizeCreateModal = {
    setModal: Dispatch<SetStateAction<boolean>>;
    setAlert: Dispatch<SetStateAction<{ type: string; message: string } | undefined>>;
    token: string;
    refreshToken: () => Promise<any>;
    fetchSize: () => Promise<void>;
};

interface FormSize {
    name: string;
    width: number | string;
    length: number | string;
    height: number | string;
    weight: number | string;
}

export const SizeCreateModal: React.FC<propsSizeCreateModal> = ({ setModal, setAlert, token, refreshToken, fetchSize }) => {
    const [formSize, setFormSize] = useState<FormSize[]>([
        {
            name: '',
            height: '',
            length: '',
            width: '',
            weight: '',
        },
    ]);

    const [loadingSubmit, setLoadingSubmit] = useState(false);

    const addFormSize = () => {
        setFormSize([...formSize, { name: '', height: '', length: '', weight: '', width: '' }]);
    };

    const removeFormSize = (index: number) => {
        const data = [...formSize];
        if (data.length === 1) {
            setAlert({ type: 'warning', message: 'Form tidak dapat dihapus' });
        } else {
            data.splice(index, 1);
            setFormSize(data);
        }
    };

    const handleSizeChange = (value: string | number, field: string, index: number) => {
        const newSizes = [...formSize];
        newSizes[index] = { ...newSizes[index], [field]: value };
        setFormSize(newSizes);
    };

    const handlerSubmitSize = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoadingSubmit(true);
        try {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            const response = await fetchWithAuth(token, refreshToken, `${BACKEND}/sizes`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formSize),
            });
            const result = await response.json();
            if (result.error) {
                setAlert({ type: 'error', message: result.message });
            } else {
                setAlert({ type: 'success', message: result.message });
                setModal(false);
                fetchSize();
            }
        } catch (error) {
            setAlert({ type: 'error', message: `${error}` });
        } finally {
            setLoadingSubmit(false);
        }
    };
    return (
        <div className="fixed top-0 left-0 right-0 w-full h-full bg-black/10 backdrop-blur-sm flex items-center justify-center z-10">
            <Card className="relative w-10/12 mx-auto h-[95vh] overflow-y-scroll">
                <div className="flex items-center justify-between">
                    <h2 className="text-blue-900 font-semibold text-xl">Tambah Ukuran Baru</h2>
                    <button type="button" onClick={() => setModal(false)}>
                        <IconX size={25} stroke={2.5} className="text-blue-900" />
                    </button>
                </div>

                <form onSubmit={handlerSubmitSize}>
                    <div className="my-5 grid grid-cols-3 gap-5">
                        {/* Card */}
                        {formSize.map((size, index) => (
                            <div className="bg-slate-100 w-full border border-slate-400 rounded-xl p-6 pb-8 shadow-lg" key={index}>
                                <div className="flex items-center justify-end gap-3">
                                    <button className="px-2 py-2 bg-blue-900 text-blue-100 rounded-lg" type="button" onClick={addFormSize}>
                                        <IconPlus size={20} stroke={2} />
                                    </button>

                                    {formSize.length > 1 && (
                                        <button
                                            className="px-2 py-2 bg-red-700 text-red-100 rounded-lg"
                                            type="button"
                                            onClick={() => removeFormSize(index)}
                                        >
                                            <IconX size={20} stroke={2} />
                                        </button>
                                    )}
                                </div>

                                <div>
                                    <div>
                                        <label htmlFor="sizeName" className="text-sm font-semibold">
                                            Nama Ukuran
                                        </label>
                                        <input
                                            name="name"
                                            type="text"
                                            placeholder="A4"
                                            value={size.name}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                                handleSizeChange(e.target.value, e.target.name, index)
                                            }
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
                                                    value={size.length}
                                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                                        handleSizeChange(Number(e.target.value), e.target.name, index)
                                                    }
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
                                                    value={size.width}
                                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                                        handleSizeChange(Number(e.target.value), e.target.name, index)
                                                    }
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
                                                    value={size.height}
                                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                                        handleSizeChange(Number(e.target.value), e.target.name, index)
                                                    }
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
                                                    value={size.weight}
                                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                                        handleSizeChange(Number(e.target.value), e.target.name, index)
                                                    }
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
                                        <input
                                            type="text"
                                            className="outline-none text-end bg-slate-100 w-10 text-sm"
                                            disabled
                                            value={Number(size.length) * Number(size.width)}
                                        />
                                        <p className="text-sm">
                                            CM <sup className="text-xs">2</sup>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex items-center justify-end">
                        <button type="submit" disabled={loadingSubmit} className="px-5 py-2 bg-blue-900 text-blue-100 rounded-lg">
                            <div className="flex items-center justify-center gap-1">
                                {loadingSubmit ? (
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
        </div>
    );
};
