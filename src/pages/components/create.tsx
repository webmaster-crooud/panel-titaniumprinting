import { Card } from '@/components/Card';
import { IconChevronRight, IconCirclePlus, IconCloudUpload, IconLoader3, IconX } from '@tabler/icons-react';
import { useAtom } from 'jotai';
import React, { useState } from 'react';
import { alertShow } from '../../../store/Atom';
import CurrencyInput from 'react-currency-input-field';
import { useAuthToken } from '../../../hooks/useAuthToken';
import { ComponentNextModal } from '@/components/Modal/Component/Component.next.modal';
import { fetchWithAuth } from '../../../lib/fetchWithAuth';
import { BACKEND } from '../../../lib/utils';
import { useRouter } from 'next/router';
import Link from 'next/link';

type formComponent = {
    name: string;
    typeComponent: string;
    price?: number | string;
    cogs?: number | string;
};

const typeComponent: { value: string; label: string }[] = [
    {
        value: 'MATERIAL',
        label: 'Material',
    },
    {
        value: 'PROCESSING',
        label: 'Processing',
    },
    {
        value: 'CONSUMING',
        label: 'Consuming',
    },
    {
        value: 'ADDON',
        label: 'Addon',
    },
    {
        value: 'FINISHING',
        label: 'Finishing',
    },
];

export default function CreateComponentPage() {
    const router = useRouter();
    const { refreshToken, token } = useAuthToken();
    const [loading, setLoading] = useState<boolean>(false);
    const [alert, setAlert] = useAtom(alertShow);
    const [formData, setFormData] = useState<formComponent>({
        name: '',
        typeComponent: 'MATERIAL',
        price: '',
        cogs: '',
    });
    const [formQualities, setFormQualities] = useState<{ name: string; price?: string | string[]; cogs: string | string[]; priceActived: boolean }[]>(
        [],
    );

    const [nextModal, setNextModal] = useState<boolean>(false);
    const [next, setNext] = useState<string>('');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData((prev) => {
            let result: formComponent = { ...prev };

            result[e.target.name as keyof formComponent] = e.target.value;

            return result;
        });
    };
    const handleQualitiesChange = (value: string | number, field: string, index: number) => {
        const newQualities = [...formQualities];
        newQualities[index] = { ...newQualities[index], [field]: value };
        setFormQualities(newQualities);
    };

    const addQualitiesInput = () => {
        setFormQualities([...formQualities, { name: '', price: '', cogs: '', priceActived: false }]);
    };

    const addPriceQuality = (idx: number) => {
        const newData = [...formQualities];
        newData[idx] = { ...newData[idx], priceActived: true };
        setFormQualities(newData);
    };
    const cancelAddPriceQuality = (idx: number) => {
        const newData = [...formQualities];
        newData[idx] = { ...newData[idx], priceActived: false, price: '', cogs: '' };
        setFormQualities(newData);
    };

    const removeQualitiesInput = (index: number) => {
        const data = [...formQualities];
        if (data.length === 1) {
            setAlert({ type: 'warning', message: 'Form tidak dapat dihapus' });
        } else {
            data.splice(index, 1);
            setFormQualities(data);
        }
    };

    const handleNext = (type: string) => {
        setNext(type);
        setNextModal(false);
    };
    const handleNextModal = () => {
        setLoading(true);
        try {
            if (!formData.name) {
                setAlert({ type: 'error', message: 'Nama komponen tidak boleh kosong' });
            } else {
                setNextModal(true);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const handlerFormCreate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        try {
            let response;
            if (formQualities.length !== 0) {
                response = await fetchWithAuth(token, refreshToken, `${BACKEND}/components`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: formData.name,
                        typeComponent: formData.typeComponent,
                        qualities: formQualities.map((qualities) => ({
                            name: qualities.name,
                            price: qualities.price === '' ? undefined : qualities.price,
                            cogs: qualities.cogs === '' ? undefined : qualities.cogs,
                        })),
                    }),
                });
            } else {
                response = await fetchWithAuth(token, refreshToken, `${BACKEND}/components`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData),
                });
            }
            const result = await response.json();
            if (result.error) {
                setAlert({ type: 'error', message: result.message });
            } else {
                router.push(`/components/${result.data.id}`);
                setAlert({ type: 'success', message: result.message });
            }
        } catch (error) {
            setAlert({ type: 'error', message: `${error}` });
        } finally {
            setLoading(false);
        }
    };

    console.log(formData);
    console.log(formQualities);
    console.log(formQualities.length);
    return (
        <>
            {nextModal && <ComponentNextModal setFormQualities={setFormQualities} handleNext={handleNext} />}
            {next && (
                <div className="flex items-center justify-end gap-5 mt-10">
                    <Link href={'/components'} className="px-4 py-2 bg-red-500 text-slate-100 rounded-lg text-sm font-semibold">
                        Kembali
                    </Link>
                </div>
            )}
            <form onSubmit={handlerFormCreate} className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
                <div>
                    {!next && (
                        <div className="flex items-center justify-end gap-5 mt-10">
                            <Link href={'/components'} className="px-4 py-2 bg-red-500 text-slate-100 rounded-lg text-sm font-semibold">
                                Kembali
                            </Link>
                        </div>
                    )}
                    <Card className="mt-3">
                        <div className="grid grid-cols-2 gap-5">
                            <div>
                                <label htmlFor="nameComponent" className="text-sm font-semibold">
                                    Nama Komponen
                                </label>
                                <input
                                    type="text"
                                    placeholder="Kertas"
                                    name="name"
                                    value={formData?.name}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange(e)}
                                    className={`text-sm font-medium bg-slate-100 w-full border border-slate-300 text-slate-700 px-4 py-2 rounded-lg block mt-1 ${
                                        alert && 'animate-shake animate-duration-200 animate-ease-in-out animate-alternate'
                                    }`}
                                    autoComplete="off"
                                />
                            </div>

                            <div>
                                <label htmlFor="typeCompoennt" className="text-sm font-semibold">
                                    Tipe Komponen
                                </label>
                                <select
                                    name="typeComponent"
                                    value={formData?.typeComponent}
                                    onChange={handleInputChange}
                                    className={`text-sm font-medium bg-slate-100 w-full border border-slate-300 text-slate-700 px-4 py-2 rounded-lg block appearance-none mt-1`}
                                >
                                    {typeComponent.map((data, index) => (
                                        <option value={data.value} key={index}>
                                            {data.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {!next && (
                            <div className="flex items-center justify-end mt-5">
                                <button
                                    onClick={handleNextModal}
                                    disabled={loading}
                                    type="button"
                                    className="px-5 py-2 rounded-lg bg-sky-500 text-slate-100"
                                >
                                    <div className="flex items-center justify-center gap-1">
                                        {loading ? (
                                            <>
                                                <span className="text-sm font-bold">Loading</span>
                                                <IconLoader3 className="animate-spin" size={18} stroke={3} />
                                            </>
                                        ) : (
                                            <>
                                                <span className="text-sm font-bold">Selanjutnya</span> <IconChevronRight size={18} stroke={3} />
                                            </>
                                        )}
                                    </div>
                                </button>
                            </div>
                        )}
                    </Card>
                </div>

                {next === 'qualities' && (
                    <div className="flex flex-col gap-5">
                        {formQualities.map((qualities, index) => (
                            <Card
                                key={index}
                                className={`relative ${alert && 'animate-shake animate-duration-200 animate-ease-in-out animate-alternate'} mt-3`}
                            >
                                {formQualities.length > 1 && (
                                    <div className="absolute top-5 right-5">
                                        <button type="button" onClick={() => removeQualitiesInput(index)}>
                                            <IconX size={25} stroke={2} />
                                        </button>
                                    </div>
                                )}
                                <div className={`grid grid-cols-2 gap-5 ${formQualities.length > 1 && 'mt-5'}`}>
                                    <div>
                                        <label htmlFor="nameQuality" className="text-sm font-semibold">
                                            Kualitas
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Kertas"
                                            name="name"
                                            value={qualities.name}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                                handleQualitiesChange(e.target.value, 'name', index)
                                            }
                                            className={`text-sm font-medium bg-slate-100 w-full border border-slate-300 text-slate-700 px-4 py-2 rounded-lg block mt-1`}
                                            autoComplete="off"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="nameQuality" className="text-sm font-semibold">
                                            Tambah Harga?
                                        </label>
                                        <div className="flex items-center justify-center w-full mt-1">
                                            {qualities.priceActived ? (
                                                <button
                                                    className="w-full px-5 py-2 text-sm bg-pink-600 text-slate-100 font-semibold rounded-lg"
                                                    type="button"
                                                    onClick={() => cancelAddPriceQuality(index)}
                                                >
                                                    Batal
                                                </button>
                                            ) : (
                                                <button
                                                    className="w-full px-5 py-2 text-sm bg-blue-900 text-slate-100 font-semibold rounded-lg"
                                                    type="button"
                                                    onClick={() => addPriceQuality(index)}
                                                >
                                                    Punya
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                    {qualities.priceActived && (
                                        <>
                                            <div>
                                                <label htmlFor="priceQualties" className="text-sm font-semibold">
                                                    Harga Jual
                                                </label>
                                                <CurrencyInput
                                                    className={`text-sm font-medium bg-slate-100 w-full border border-slate-300 text-slate-700 px-4 py-2 rounded-lg block mt-1`}
                                                    intlConfig={{ locale: 'id-ID', currency: 'IDR' }}
                                                    placeholder="10.000.000"
                                                    value={qualities.price}
                                                    decimalsLimit={0}
                                                    autoComplete="off"
                                                    onValueChange={(value, name, values) => {
                                                        if (values?.float === null) {
                                                            value = '0';
                                                        }
                                                        handleQualitiesChange(Number(value), 'price', index);
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
                                                    value={qualities.cogs}
                                                    decimalsLimit={0}
                                                    autoComplete="off"
                                                    onValueChange={(value, name, values) => {
                                                        if (values?.float === null) {
                                                            value = '0';
                                                        }
                                                        handleQualitiesChange(Number(value), 'cogs', index);
                                                    }}
                                                />
                                            </div>
                                        </>
                                    )}
                                </div>

                                <div className="flex items-center justify-end mt-5">
                                    <button type="button" onClick={addQualitiesInput} className="px-5 py-2 rounded-lg bg-blue-500 text-slate-100">
                                        <div className="flex items-center justify-center gap-1">
                                            <IconCirclePlus size={18} stroke={3} />
                                            <span className="text-sm font-bold">Kualitas</span>
                                        </div>
                                    </button>
                                </div>
                            </Card>
                        ))}
                        <div className="flex items-center justify-end mt-5 w-full">
                            <button disabled={loading} type="submit" className="px-5 py-2 w-full rounded-lg bg-sky-500 text-slate-100">
                                <div className="flex items-center justify-center gap-1">
                                    {loading ? (
                                        <>
                                            <span className="text-sm font-bold">Loading</span>
                                            <IconLoader3 className="animate-spin" size={18} stroke={3} />
                                        </>
                                    ) : (
                                        <>
                                            <span className="text-sm font-bold">Simpan</span> <IconCloudUpload size={18} stroke={3} />
                                        </>
                                    )}
                                </div>
                            </button>
                        </div>
                        <button
                            type="reset"
                            onClick={() => {
                                setNext('');
                                setFormQualities([]);
                            }}
                            className="px-4 py-2 bg-pink-500 text-slate-100 rounded-lg text-sm font-semibold"
                        >
                            Batal
                        </button>
                    </div>
                )}

                {next === 'pricings' && (
                    <div>
                        <Card className="mt-3">
                            <div className="grid grid-cols-2 gap-5">
                                <div>
                                    <label htmlFor="pricceComponent" className="text-sm font-semibold">
                                        Harga Jual
                                    </label>
                                    <CurrencyInput
                                        className={`text-sm font-medium bg-slate-100 w-full border border-slate-300 text-slate-700 px-4 py-2 rounded-lg block mt-1`}
                                        intlConfig={{ locale: 'id-ID', currency: 'IDR' }}
                                        placeholder="10.000.000"
                                        value={formData?.price}
                                        decimalsLimit={0}
                                        autoComplete="off"
                                        onValueChange={(value, name, values) => {
                                            if (values?.float === null) {
                                                value = '0';
                                            }
                                            setFormData({ ...formData, price: Number(value) });
                                        }}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="cogsComoponent" className="text-sm font-semibold">
                                        Harga Modal
                                    </label>
                                    <CurrencyInput
                                        className={`text-sm font-medium bg-slate-100 w-full border border-slate-300 text-slate-700 px-4 py-2 rounded-lg block mt-1`}
                                        intlConfig={{ locale: 'id-ID', currency: 'IDR' }}
                                        placeholder="10.000.000"
                                        value={formData?.cogs}
                                        decimalsLimit={0}
                                        autoComplete="off"
                                        onValueChange={(value, name, values) => setFormData({ ...formData, cogs: Number(value) })}
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-end mt-5">
                                <button type="submit" className="px-5 py-2 rounded-lg bg-sky-500 text-slate-100">
                                    <div className="flex items-center justify-center gap-1">
                                        <div className="flex items-center justify-center gap-1">
                                            {loading ? (
                                                <>
                                                    <span className="text-sm font-bold">Loading</span>
                                                    <IconLoader3 className="animate-spin" size={18} stroke={3} />
                                                </>
                                            ) : (
                                                <>
                                                    <span className="text-sm font-bold">Simpan</span> <IconCloudUpload size={18} stroke={3} />
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </button>
                            </div>
                        </Card>
                        <div className="flex items-center justify-end w-full mt-5">
                            <button
                                type="reset"
                                onClick={() => setNext('')}
                                className="px-4 py-2 w-full bg-pink-500 text-slate-100 rounded-lg text-sm font-semibold"
                            >
                                Batal
                            </button>
                        </div>
                    </div>
                )}
            </form>
        </>
    );
}
