import { IconCloudUpload, IconLoader3, IconMinus, IconPlus, IconX } from '@tabler/icons-react';
import React, { useCallback, useState } from 'react';
import { useAuthToken } from '../../../../hooks/useAuthToken';
import { useSetAtom } from 'jotai';
import { alertShow } from '../../../../store/Atom';
import { Card } from '@/components/Card';
import CurrencyInput from 'react-currency-input-field';
import { fetchWithAuth } from '../../../../lib/fetchWithAuth';
import { BACKEND } from '../../../../lib/utils';

interface FormQualties {
    name: string;
    price?: string | string[] | number;
    cogs?: string | string[] | number;
}

interface Sizes {
    id: number;
    name: number;
}

type propsAddQualitiesModal = {
    componentId: string | string[] | undefined;
    fetchComponent: () => Promise<void>;
};

export const AddQualtiesModal: React.FC<propsAddQualitiesModal> = ({ componentId, fetchComponent }) => {
    const [modalAddQualities, setModalAddQualities] = useState<boolean>(false);
    const { refreshToken, token } = useAuthToken();
    const setAlert = useSetAtom(alertShow);
    const [formQualties, setFormQualities] = useState<FormQualties>({
        name: '',
        price: '',
        cogs: '',
    });
    const [formSizes, setFormSizes] = useState<
        {
            sizeId: string | number;
            price?: string | number | undefined;
            cogs?: string | number | undefined;
        }[]
    >([]);
    const [sizes, setSizes] = useState<Sizes[]>([]);
    const [nextForm, setNextForm] = useState<{ field: string } | undefined>(undefined);
    const [loading, setLoading] = useState(false);

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
    const handleSizesChange = (value: string | undefined | number, field: string, index: number) => {
        const newSizes = [...formSizes];
        newSizes[index] = { ...newSizes[index], [field]: value };
        setFormSizes(newSizes);
    };
    const addSizesInput = () => {
        setFormSizes([...formSizes, { sizeId: 1, price: '', cogs: '' }]);
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
    const handleQualityChange = (value: string | number | undefined | string[], field: string) => {
        setFormQualities({ ...formQualties, [field]: value });
    };

    const submitAddQualities = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        let data;
        if (nextForm?.field === 'pricings') {
            data = {
                name: formQualties.name,
                price: formQualties.price,
                cogs: formQualties.cogs,
            };
        } else {
            data = {
                name: formQualties.name,
                qualitiesSize: [...formSizes],
            };
        }
        try {
            const response = await fetchWithAuth(token, refreshToken, `${BACKEND}/qualities/${componentId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            const result = await response.json();
            if (result.error) {
                setAlert({ type: 'error', message: result.message });
            } else {
                setModalAddQualities(false);
                fetchComponent();
                setAlert({ type: 'success', message: result.message });
            }
        } catch (error) {
            setAlert({ type: 'error', message: `${error}` });
        } finally {
            setLoading(false);
        }
    };
    return (
        <>
            <button
                type="button"
                onClick={() => setModalAddQualities(true)}
                className="flex items-center justify-center w-full h-full bg-transparent-300 border-2 border-dashed border-blue-300 text-blue-800 rounded-lg py-5 translate-x-2 -translate-y-2 ease-in-out transition-all duration-300 hover:translate-x-0 hover:translate-y-0 hover:bg-blue-300 hover:border-solid"
            >
                <IconPlus stroke={2} />
            </button>

            {/* Modal */}
            {modalAddQualities && (
                <div className="fixed top-0 left-0 right-0 w-full h-full bg-black/10 backdrop-blur-sm flex items-center justify-center z-10">
                    <Card className="relative w-6/12 mx-auto">
                        <div className="flex items-center justify-between">
                            <h2 className="text-blue-900 font-semibold text-xl">Tambah Kualitas</h2>
                            <button type="button" onClick={() => setModalAddQualities(false)}>
                                <IconX size={25} stroke={2.5} className="text-blue-900" />
                            </button>
                        </div>

                        <form onSubmit={submitAddQualities}>
                            <div className="my-5">
                                <div className={`grid grid-cols-2 gap-5`}>
                                    <div>
                                        <label htmlFor="nameQuality" className="text-sm font-semibold">
                                            Kualitas
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Kertas"
                                            name="name"
                                            value={formQualties.name}
                                            className={`text-sm font-medium bg-slate-100 w-full border border-slate-300 text-slate-700 px-4 py-2 rounded-lg block mt-1`}
                                            autoComplete="off"
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleQualityChange(e.target.value, e.target.name)}
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="nameQuality" className="text-sm font-semibold">
                                            Apakah memiliki ukuran?
                                        </label>
                                        <div className="flex items-center justify-center w-full mt-1 gap-5">
                                            {nextForm?.field === 'sizes' ? (
                                                <button
                                                    className="w-full px-5 py-2 text-sm bg-pink-600 text-slate-100 font-semibold rounded-lg"
                                                    type="button"
                                                    onClick={() => {
                                                        setNextForm(undefined);
                                                        setFormSizes([]);
                                                    }}
                                                >
                                                    Batal
                                                </button>
                                            ) : (
                                                <button
                                                    className="w-full px-5 py-2 text-sm bg-blue-900 text-slate-100 font-semibold rounded-lg"
                                                    type="button"
                                                    onClick={() => {
                                                        if (!formQualties.name) {
                                                            setAlert({ type: 'error', message: 'Nama tidak boleh kosong!' });
                                                        } else {
                                                            setNextForm({ field: 'sizes' });
                                                            fetchSizes();
                                                            setFormSizes([{ sizeId: 1, price: '', cogs: '' }]);
                                                        }
                                                    }}
                                                >
                                                    Punya
                                                </button>
                                            )}
                                            {nextForm?.field === 'pricings' ? (
                                                <button
                                                    className="w-full px-5 py-2 text-sm bg-pink-600 text-slate-100 font-semibold rounded-lg"
                                                    type="button"
                                                    onClick={() => {
                                                        setNextForm(undefined);
                                                        setFormQualities({ ...formQualties, cogs: '', price: '' });
                                                    }}
                                                >
                                                    Batal
                                                </button>
                                            ) : (
                                                <button
                                                    className="w-full px-5 py-2 text-sm bg-pink-500 text-slate-100 font-semibold rounded-lg"
                                                    type="button"
                                                    onClick={() => {
                                                        if (!formQualties.name) {
                                                            setAlert({ type: 'error', message: 'Nama tidak boleh kosong!' });
                                                        } else {
                                                            setNextForm({ field: 'pricings' });
                                                        }
                                                    }}
                                                >
                                                    Tidak
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                    {nextForm?.field === 'pricings' && (
                                        <>
                                            <div>
                                                <label htmlFor="priceQualties" className="text-sm font-semibold">
                                                    Harga Jual
                                                </label>
                                                <CurrencyInput
                                                    className={`text-sm font-medium bg-slate-100 w-full border border-slate-300 text-slate-700 px-4 py-2 rounded-lg block mt-1`}
                                                    intlConfig={{ locale: 'id-ID', currency: 'IDR' }}
                                                    placeholder="10.000.000"
                                                    value={formQualties.price}
                                                    decimalsLimit={0}
                                                    autoComplete="off"
                                                    onValueChange={(value, name, values) => {
                                                        if (values?.float === null) {
                                                            value = '0';
                                                        }
                                                        handleQualityChange(value, 'price');
                                                    }}
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="cogsQualities" className="text-sm font-semibold">
                                                    Harga Modal
                                                </label>
                                                <CurrencyInput
                                                    className={`text-sm font-medium bg-slate-100 w-full border border-slate-300 text-slate-700 px-4 py-2 rounded-lg block mt-1`}
                                                    intlConfig={{ locale: 'id-ID', currency: 'IDR' }}
                                                    placeholder="10.000.000"
                                                    value={formQualties.cogs}
                                                    decimalsLimit={0}
                                                    autoComplete="off"
                                                    onValueChange={(value, name, values) => {
                                                        if (values?.float === null) {
                                                            value = '0';
                                                        }
                                                        handleQualityChange(value, 'cogs');
                                                    }}
                                                />
                                            </div>
                                        </>
                                    )}
                                    {nextForm?.field === 'sizes' && (
                                        <div className="grid grid-cols-3 gap-3 col-span-2">
                                            {formSizes.map((formSizes, index) => (
                                                <React.Fragment key={index}>
                                                    <div>
                                                        <label htmlFor="priceQuality" className="text-sm font-semibold">
                                                            Ukuran
                                                        </label>
                                                        <select
                                                            className={`text-sm text-center font-medium bg-slate-100 w-full border border-slate-300 text-slate-700 px-4 py-2 rounded-lg block mt-1 appearance-none`}
                                                            value={Number(formSizes.sizeId)}
                                                            name="sizeId"
                                                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                                                                handleSizesChange(parseInt(e.target.value), e.target.name, index)
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
                                                                handleSizesChange(Number(value), 'price', index);
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
                                                                    handleSizesChange(Number(value), 'cogs', index);
                                                                }}
                                                            />
                                                            <div className="flex items-center justify-center gap-2">
                                                                <button
                                                                    type="button"
                                                                    className="w-full h-full flex items-center justify-center text-blue-900"
                                                                    onClick={addSizesInput}
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
                                    )}
                                </div>
                            </div>
                            <div className="flex items-center justify-end">
                                <button type="submit" className="px-5 font-semibold py-2 text-sm bg-blue-900 text-slate-100 rounded-lg">
                                    <div className="flex items-center justify-center gap-1">
                                        {loading ? (
                                            <>
                                                <IconLoader3 className="animate-spin" size={16} stroke={2} /> <span>Simpan</span>
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
                </div>
            )}
        </>
    );
};
