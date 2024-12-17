import { IconCloudUp, IconCloudUpload, IconEye, IconEyeCog, IconLoader3, IconMinus, IconPlus, IconTrash, IconX } from '@tabler/icons-react';
import React, { useState } from 'react';
import { useAuthToken } from '../../../../hooks/useAuthToken';
import { useSetAtom } from 'jotai';
import { alertShow } from '../../../../store/Atom';
import { Card } from '@/components/Card';
import CurrencyInput from 'react-currency-input-field';
import { fetchWithAuth } from '../../../../lib/fetchWithAuth';
import { BACKEND } from '../../../../lib/utils';

type propsProgressiveModal = {
    index: number;
    quality: string;
    size: string;
    entityType: string;
    entityId: string | number;
    fetchComponent: () => Promise<void>;
};

interface ProgressivePricing {
    id?: number;
    entityType: string;
    entityId: string | number;
    minQty: string | number;
    maxQty: string | number;
    price: string | number;
}

export const ProgressivePricingModal: React.FC<propsProgressiveModal> = ({ index, size, quality, entityId, entityType, fetchComponent }) => {
    const [modalProgressive, setModalProgressive] = useState<{ idx: number } | undefined>(undefined);
    const { token, refreshToken } = useAuthToken();
    const setAlert = useSetAtom(alertShow);
    const [loadingProgressive, setLoadingProgressive] = useState(false);
    const [formProgressive, setFormProgressive] = useState<ProgressivePricing[]>([
        {
            entityType: entityType,
            entityId: entityId,
            maxQty: '',
            minQty: '',
            price: '',
        },
    ]);
    const [dataProgressive, setDataProgressive] = useState<ProgressivePricing[]>([
        {
            id: 0,
            entityType: '',
            entityId: '',
            maxQty: '',
            minQty: '',
            price: '',
        },
    ]);

    const addProgressiveInput = () => {
        setFormProgressive([...formProgressive, { entityId, entityType, minQty: '', maxQty: '', price: '' }]);
    };

    const removeProgressiveInput = (index: number) => {
        const data = [...formProgressive];
        if (data.length === 1) {
            setAlert({ type: 'warning', message: 'Form tidak dapat dihapus' });
        } else {
            data.splice(index, 1);
            setFormProgressive(data);
        }
    };

    const handleProgressiveChange = (value: string | undefined, field: string, index: number) => {
        const newSizes = [...formProgressive];
        newSizes[index] = { ...newSizes[index], [field]: value };
        setFormProgressive(newSizes);
    };

    const fetchProgressivePricing = async () => {
        setLoadingProgressive(true);
        try {
            const response = await fetchWithAuth(token, refreshToken, `${BACKEND}/pricings/${entityId}/${entityType}`);
            const result = await response.json();
            if (result.error) {
                setAlert({ type: 'error', message: result.message });
            } else {
                setDataProgressive(result.data);
            }
        } catch (error) {
            setAlert({ type: 'error', message: `${error}` });
        } finally {
            setLoadingProgressive(false);
        }
    };
    const handleSubmitCreate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoadingProgressive(true);
        try {
            const response = await fetchWithAuth(token, refreshToken, `${BACKEND}/pricings`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formProgressive),
            });

            const result = await response.json();
            console.log('RESULT INPUT CREATE', result);
            if (result.error) {
                setAlert({ type: 'error', message: result.message });
            } else {
                setAlert({ type: 'success', message: 'Berhasil menyimpan progressive pricings' });
                fetchProgressivePricing();
                setFormProgressive([
                    {
                        entityId,
                        entityType,
                        minQty: '',
                        maxQty: '',
                        price: '',
                    },
                ]);
            }
        } catch (error) {
            setAlert({ type: 'error', message: `${error}` });
        } finally {
            setLoadingProgressive(false);
        }
    };
    const handleDeleted = async (id: number | null | undefined) => {
        setLoadingProgressive(true);
        try {
            const response = await fetchWithAuth(token, refreshToken, `${BACKEND}/pricings/${id}`, {
                method: 'DELETE',
            });
            const result = await response.json();
            if (result.error) {
                setAlert({ type: 'error', message: result.message });
            } else {
                setAlert({ type: 'success', message: result.message });
                fetchProgressivePricing();
            }
        } catch (error) {
            setAlert({ type: 'error', message: `${error}` });
        } finally {
            setLoadingProgressive(false);
        }
    };

    return (
        <>
            <button
                className="text-cyan-800"
                onClick={() => {
                    setModalProgressive({ idx: index });
                    fetchProgressivePricing();
                }}
                type="button"
            >
                <IconEye size={14} stroke={2.5} />
            </button>

            {/* Modal */}
            {modalProgressive?.idx === index && (
                <section className="fixed top-0 left-0 right-0 w-full h-screen bg-black/10 backdrop-blur-sm flex items-center justify-center z-10">
                    <Card className="w-6/12">
                        <div className="flex items-center justify-between">
                            <h6 className="text-lg font-semibold">
                                Kualitas {quality}: {size}
                            </h6>
                            <button type="button" onClick={() => setModalProgressive(undefined)}>
                                <IconX size={25} stroke={2.5} />
                            </button>
                        </div>

                        {dataProgressive.length !== 0 && (
                            <div className="mt-5">
                                <table className="w-full table">
                                    <thead className="bg-blue-400">
                                        <tr>
                                            <th className="text-center">Min Qty</th>
                                            <th className="text-center">Max Qty</th>
                                            <th className="text-center">Price</th>
                                            <th className="text-center flex items-center justify-center">
                                                <IconEyeCog size={20} stroke={2.5} />
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-blue-300">
                                        {dataProgressive.map((data, index) => (
                                            <tr key={index}>
                                                <td className="p-2 text-xs text-center">{data.minQty}</td>
                                                <td className="p-2 text-xs text-center">{data.maxQty}</td>
                                                <td className="p-2 text-xs text-center">{data.price}</td>
                                                <td className="flex items-center justify-center p-2">
                                                    <button
                                                        className="p-1 bg-red-500 text-slate-100 rounded"
                                                        type="button"
                                                        onClick={() => handleDeleted(data ? data.id : null)}
                                                    >
                                                        <IconTrash size={14} stroke={2} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        <form onSubmit={handleSubmitCreate} className="mt-5">
                            {formProgressive.map((progressive, index) => (
                                <div className="grid grid-cols-3 gap-5 mb-4" key={index}>
                                    <div>
                                        <label htmlFor="minQuantity" className="text-sm font-semibold">
                                            Kuantitas Minimal
                                        </label>
                                        <input
                                            className={`text-sm text-center font-medium bg-slate-100 w-full border border-slate-300 text-slate-700 px-4 py-2 rounded-lg block mt-1 appearance-none`}
                                            name="minQty"
                                            type="text"
                                            value={progressive.minQty}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                                handleProgressiveChange(e.target.value, e.target.name, index)
                                            }
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="maxQty" className="text-sm font-semibold">
                                            Kuantitas Maximal
                                        </label>
                                        <input
                                            className={`text-sm text-center font-medium bg-slate-100 w-full border border-slate-300 text-slate-700 px-4 py-2 rounded-lg block mt-1 appearance-none`}
                                            name="maxQty"
                                            type="text"
                                            value={progressive.maxQty}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                                handleProgressiveChange(e.target.value, e.target.name, index)
                                            }
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="price" className="text-sm font-semibold">
                                            Harga Jual
                                        </label>
                                        <div className="flex items-center justify-between gap-5">
                                            <div className="w-full">
                                                <CurrencyInput
                                                    className={`text-sm font-medium bg-slate-100 w-full border border-slate-300 text-slate-700 px-4 py-2 rounded-lg block mt-1`}
                                                    intlConfig={{ locale: 'id-ID', currency: 'IDR' }}
                                                    placeholder="10.000.000"
                                                    decimalsLimit={0}
                                                    autoComplete="off"
                                                    value={progressive.price}
                                                    onValueChange={(value, name, values) => {
                                                        if (values?.float === null) {
                                                            value = '0';
                                                        }
                                                        handleProgressiveChange(value, 'price', index);
                                                    }}
                                                />
                                            </div>
                                            <div className="flex items-center justify-center gap-2">
                                                <button type="button" onClick={addProgressiveInput}>
                                                    <IconPlus size={20} stroke={2} />
                                                </button>
                                                <button type="button" onClick={() => removeProgressiveInput(index)}>
                                                    <IconMinus className="text-red-500" size={20} stroke={2} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            <div className="flex items-center justify-end">
                                <button type="submit" className="px-5 py-2 text-sm bg-blue-900 text-slate-100 rounded-lg">
                                    <div className="flex items-center justify-center gap-1">
                                        {loadingProgressive ? (
                                            <>
                                                <IconLoader3 className="animate-spi" size={16} stroke={2} /> <span>Simpan</span>
                                            </>
                                        ) : (
                                            <>
                                                <IconCloudUpload size={16} stroke={2} /> <span>Simpan</span>
                                            </>
                                        )}
                                    </div>
                                </button>
                            </div>
                        </form>
                    </Card>
                </section>
            )}
        </>
    );
};
