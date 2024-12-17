import { Card } from '@/components/Card';
import { IconCloudUpload, IconLoader3, IconMinus, IconPlus, IconRefresh, IconX } from '@tabler/icons-react';
import { useSetAtom } from 'jotai';
import React, { useCallback, useEffect, useState } from 'react';
import CurrencyInput from 'react-currency-input-field';
import { useAuthToken } from '../../../../hooks/useAuthToken';
import { alertShow } from '../../../../store/Atom';
import { fetchWithAuth } from '../../../../lib/fetchWithAuth';
import { BACKEND } from '../../../../lib/utils';

interface Sizes {
    id: number;
    name: number;
}

type propseComponentAddSizesModal = {
    qualityId: number;
    quality: any;
    fetchComponent: () => Promise<void>;
};

export const ComponentAddSizesModal: React.FC<propseComponentAddSizesModal> = ({ qualityId, quality, fetchComponent }) => {
    const { token, refreshToken } = useAuthToken();
    const [modal, setModal] = useState<{ func: string; id: number } | undefined>(undefined);
    const [loadingPrice, setLoadingPrice] = useState(false);
    const setAlert = useSetAtom(alertShow);
    const [sizes, setSizes] = useState<Sizes[]>([]);

    const [formSizes, setFormSizes] = useState<
        {
            qualityId: string | number;
            sizeId: string | number;
            price?: string | number | undefined;
            cogs?: string | number | undefined;
        }[]
    >([{ qualityId: qualityId, sizeId: 1, price: '', cogs: '' }]);

    const handleSubmitAddPrice = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoadingPrice(true);
        try {
            await new Promise((resolve) => setTimeout(resolve, 1000));

            const response = await fetchWithAuth(token, refreshToken, `${BACKEND}/sizes/quality`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formSizes),
            });

            const result = await response.json();
            if (result.error) {
                setAlert({ type: 'warning', message: result.message });
            } else {
                setModal(undefined);
                setAlert({ type: 'success', message: 'Berhasil menambahkan ukuran dan harga' });
                fetchComponent();
            }
        } catch (error) {
            setAlert({ type: 'error', message: `${error}` });
        } finally {
            setLoadingPrice(false);
        }
    };

    const handleSizesChange = (value: string | undefined, field: string, index: number) => {
        const newSizes = [...formSizes];
        newSizes[index] = { ...newSizes[index], [field]: value };
        setFormSizes(newSizes);
    };

    const addSizesInput = () => {
        setFormSizes([...formSizes, { qualityId: qualityId, sizeId: 1, price: '', cogs: '' }]);
    };

    const removeSizesInput = (index: number) => {
        const data = [...formSizes];
        if (data.length === 1) {
            setAlert({ type: 'warning', message: 'Form tidak dapat dihapus' });
        } else {
            data.splice(index, 1);
            setFormSizes(data);
        }
    };

    const fetchSizes = useCallback(async () => {
        try {
            const response = await fetchWithAuth(token, refreshToken, `${BACKEND}/sizes`);
            const result = await response.json();
            if (result.error) {
                setAlert({ type: 'warning', message: result.message });
            } else {
                setSizes(result.data);
            }
        } catch (error) {
            setAlert({ type: 'error', message: `${error}` });
        }
    }, [token, refreshToken, setAlert]);

    return (
        <td colSpan={2}>
            <button
                type="button"
                onClick={() => {
                    setModal({ func: 'sizes', id: qualityId });
                    fetchSizes();
                }}
                className={`border w-full border-dashed border-sky-400 text-center px-3 py-2 font-semibold rounded-lg hover:border-solid hover:bg-sky-400 hover:text-sky-100 transition-all ease-in-out duration-300 flex items-center justify-center gap-1`}
            >
                <IconPlus stroke={2} size={16} /> <span>Ukuran</span>
            </button>
            {/* Modal */}
            {modal?.func === 'sizes' && modal.id === qualityId && (
                <div className="fixed top-0 left-0 right-0 w-full h-full bg-black/10 backdrop-blur-sm flex items-center justify-center z-10">
                    <Card className="relative w-6/12 mx-auto">
                        <div className="flex items-center justify-between">
                            <h2 className="text-blue-900 font-semibold text-xl">Ukuran {quality.name}</h2>
                            <button type="button" onClick={() => setModal(undefined)}>
                                <IconX size={25} stroke={2.5} className="text-blue-900" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmitAddPrice}>
                            <div className="grid grid-cols-3 gap-3 mt-5">
                                {formSizes.map((formSizes, index) => (
                                    <React.Fragment key={index}>
                                        <div>
                                            <label htmlFor="priceQuality" className="text-sm font-semibold">
                                                Ukuran
                                            </label>
                                            <select
                                                className={`text-sm text-center font-medium bg-slate-100 w-full border border-slate-300 text-slate-700 px-4 py-2 rounded-lg block mt-1 appearance-none`}
                                                value={formSizes.sizeId}
                                                name="sizeId"
                                                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                                                    handleSizesChange(e.target.value, e.target.name, index)
                                                }
                                            >
                                                {sizes.map((size, index) => (
                                                    <option value={size.id} key={index}>
                                                        {size.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label htmlFor="priceQuality" className="text-sm font-semibold">
                                                Harga Jual
                                            </label>
                                            <CurrencyInput
                                                className={`text-sm font-medium bg-slate-100 w-full border border-slate-300 text-slate-700 px-4 py-2 rounded-lg block mt-1`}
                                                intlConfig={{ locale: 'id-ID', currency: 'IDR' }}
                                                placeholder="10.000.000"
                                                value={formSizes.price}
                                                decimalsLimit={0}
                                                autoComplete="off"
                                                onValueChange={(value, name, values) => {
                                                    if (values?.float === null) {
                                                        value = '0';
                                                    }
                                                    handleSizesChange(value, 'price', index);
                                                }}
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="cogsQuality" className="text-sm font-semibold">
                                                Harga Modal
                                            </label>
                                            <div className="flex justify-end gap-1">
                                                <CurrencyInput
                                                    className={`text-sm font-medium bg-slate-100 w-full border border-slate-300 text-slate-700 px-4 py-2 rounded-lg block mt-1`}
                                                    intlConfig={{ locale: 'id-ID', currency: 'IDR' }}
                                                    placeholder="10.000.000"
                                                    value={formSizes.cogs}
                                                    decimalsLimit={0}
                                                    autoComplete="off"
                                                    onValueChange={(value, name, values) => {
                                                        if (values?.float === null) {
                                                            value = '0';
                                                        }
                                                        handleSizesChange(value, 'cogs', index);
                                                    }}
                                                />
                                                <div className="flex items-center justify-center gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={addSizesInput}
                                                        className="w-full h-full flex items-center justify-center text-blue-900"
                                                    >
                                                        <IconPlus stroke={2} size={18} />
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() => removeSizesInput(index)}
                                                        className="w-full h-full flex items-center justify-center text-red-600"
                                                    >
                                                        <IconMinus stroke={2} size={18} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </React.Fragment>
                                ))}
                            </div>
                            <button
                                type="submit"
                                disabled={loadingPrice}
                                className="w-3/12 ms-auto mt-5 bg-blue-900 text-slate-100 font-semibold py-2 rounded-lg flex items-center justify-center gap-1"
                            >
                                {loadingPrice ? (
                                    <>
                                        <IconLoader3 className="animate-spin" size={18} stroke={2} /> <span>Loading...</span>
                                    </>
                                ) : (
                                    <>
                                        <IconCloudUpload size={18} stroke={2} /> <span>Simpan</span>
                                    </>
                                )}
                            </button>
                        </form>
                    </Card>
                </div>
            )}
        </td>
    );
};
