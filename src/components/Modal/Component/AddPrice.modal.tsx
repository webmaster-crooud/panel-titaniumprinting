import { Card } from '@/components/Card';
import { IconCloudUpload, IconLoader3, IconPlus, IconRefresh, IconX } from '@tabler/icons-react';
import { useSetAtom } from 'jotai';
import React, { useState } from 'react';
import CurrencyInput from 'react-currency-input-field';
import { useAuthToken } from '../../../../hooks/useAuthToken';
import { alertShow } from '../../../../store/Atom';
import { fetchWithAuth } from '../../../../lib/fetchWithAuth';
import { BACKEND } from '../../../../lib/utils';

type propseComponentAddPriceModal = {
    componentId: string | string[] | undefined;
    qualityId: number;
    quality: any;
    fetchComponent: () => Promise<void>;
};

export const ComponentAddPriceModal: React.FC<propseComponentAddPriceModal> = ({ componentId, qualityId, quality, fetchComponent }) => {
    const [modal, setModal] = useState<{ func: string; id: number } | undefined>(undefined);
    const [loadingPrice, setLoadingPrice] = useState(false);
    const { token, refreshToken } = useAuthToken();
    const setAlert = useSetAtom(alertShow);

    const [formPricing, setFormPricing] = useState<{
        price?: string | number | undefined;
        cogs?: string | number | undefined;
    }>({ price: '', cogs: '' });

    const handleSubmitAddPrice = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoadingPrice(true);
        try {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            const data = {
                componentId: componentId,
                qualityId: qualityId,
                price: formPricing.price,
                cogs: formPricing.cogs,
            };
            const response = await fetchWithAuth(token, refreshToken, `${BACKEND}/pricings`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            const result = await response.json();
            if (result.error) {
                setAlert({ type: 'warning', message: result.message });
            } else {
                setModal(undefined);
                setAlert({ type: 'success', message: 'Berhasil menambahkan harga kualitas' });
                fetchComponent();
            }
        } catch (error) {
            setAlert({ type: 'error', message: `${error}` });
        } finally {
            setLoadingPrice(false);
        }
    };
    return (
        <td>
            <button
                type="button"
                onClick={() => setModal({ func: 'pricings', id: qualityId })}
                className={`border w-full border-dashed border-sky-400 text-center px-3 py-2 font-semibold rounded-lg hover:border-solid hover:bg-sky-400 hover:text-sky-100 transition-all ease-in-out duration-300 flex items-center justify-center gap-1`}
            >
                {quality.pricings?.length === 0 ? (
                    <>
                        <IconPlus stroke={2} size={16} /> <span>Harga</span>
                    </>
                ) : (
                    <>
                        <IconRefresh stroke={2} size={16} /> <span>Harga</span>
                    </>
                )}
            </button>
            {/* Modal */}
            {modal?.func === 'pricings' && modal.id === qualityId && (
                <div className="fixed top-0 left-0 right-0 w-full h-full bg-black/10 backdrop-blur-sm flex items-center justify-center z-10">
                    <Card className="relative w-6/12 mx-auto">
                        <div className="flex items-center justify-between">
                            <h2 className="text-blue-900 font-semibold text-xl">Harga {quality.name}</h2>
                            <button type="button" onClick={() => setModal(undefined)}>
                                <IconX size={25} stroke={2.5} className="text-blue-900" />
                            </button>
                        </div>

                        <form className="grid grid-cols-2 gap-5 mt-5" onSubmit={handleSubmitAddPrice}>
                            <div>
                                <label htmlFor="priceQuality" className="text-sm font-semibold">
                                    Harga Jual
                                </label>
                                <CurrencyInput
                                    className={`text-sm font-medium bg-slate-100 w-full border border-slate-300 text-slate-700 px-4 py-2 rounded-lg block mt-1`}
                                    intlConfig={{ locale: 'id-ID', currency: 'IDR' }}
                                    placeholder="10.000.000"
                                    value={formPricing.price}
                                    decimalsLimit={0}
                                    autoComplete="off"
                                    onValueChange={(value, name, values) => {
                                        if (values?.float === null) {
                                            value = '0';
                                        }
                                        setFormPricing({ ...formPricing, price: Number(value) });
                                    }}
                                />
                            </div>

                            <div>
                                <label htmlFor="cogsQuality" className="text-sm font-semibold">
                                    Harga Modal
                                </label>
                                <CurrencyInput
                                    className={`text-sm font-medium bg-slate-100 w-full border border-slate-300 text-slate-700 px-4 py-2 rounded-lg block mt-1`}
                                    intlConfig={{ locale: 'id-ID', currency: 'IDR' }}
                                    placeholder="10.000.000"
                                    value={formPricing.cogs}
                                    decimalsLimit={0}
                                    autoComplete="off"
                                    onValueChange={(value, name, values) => {
                                        if (values?.float === null) {
                                            value = '0';
                                        }
                                        setFormPricing({ ...formPricing, cogs: Number(value) });
                                    }}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loadingPrice}
                                className="col-start-2 bg-blue-900 text-slate-100 font-semibold py-2 rounded-lg flex items-center justify-center gap-1"
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
