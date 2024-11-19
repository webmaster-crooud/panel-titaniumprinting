import { Card } from '@/components/Card';
import { IconArrowBack, IconCloudUp, IconLoader3 } from '@tabler/icons-react';
import Link from 'next/link';
import React, { useState } from 'react';
import CurrencyInput from 'react-currency-input-field';
import { BACKEND, formatCurrency } from '../../../../lib/utils';
import ComponentsModal from '../Modal/Components.modal';
import { useSetAtom } from 'jotai';
import { alertShow } from '../../../../store/Atom';
import { useRouter } from 'next/router';

export default function CreateComponentPage() {
    const router = useRouter();
    const [addPrice, setAddPrice] = useState(false);
    const [modal, setModal] = useState(false);
    const [name, setName] = useState<string>('');
    const [typeComponent, setTypeComponent] = useState<string | undefined>(undefined);
    const [price, setPrice] = useState<number | undefined | null>(undefined);
    const [cogs, setCogs] = useState<number | undefined | null>(undefined);
    const [loading, setLoading] = useState<{ func: string; status: boolean } | undefined>(undefined);
    const setAlert = useSetAtom(alertShow);
    const [errorValidation, setErrorValidation] = useState<{ type: string; message: string } | undefined>(undefined);

    const priceChange = price ? price : 0;
    const cogsChange = cogs ? cogs : 0;
    const profit = priceChange - cogsChange;

    const data = {
        name,
        typeComponent,
        price,
        cogs,
    };

    const sumbitCreate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading({ func: 'create', status: true });
        if (!data.name) {
            setAlert({ type: 'error', message: 'Nama Komponen Tidak boleh kosong!' });
        } else {
            if (!data.price && !data.cogs) {
                try {
                    await new Promise((resolve) => setTimeout(resolve, 2000));
                    const response = await fetch(`${BACKEND}/components`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(data),
                    });
                    const result = await response.json();
                    if (result.error === true) {
                        setAlert({ type: 'error', message: result.message });
                    }
                    setAlert({ type: 'success', message: result.message });
                    router.push(`/components/create/qualities/${result.data.id}`);
                } catch (error) {
                    setAlert({ type: 'error', message: `${error}` });
                } finally {
                    setLoading(undefined);
                }
            } else {
                try {
                    await new Promise((resolve) => setTimeout(resolve, 2000));
                    const response = await fetch(`${BACKEND}/components`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(data),
                    });
                    const result = await response.json();
                    if (result.error === true) {
                        setAlert({ type: 'error', message: result.message });
                    }

                    setAlert({ type: 'success', message: result.message });
                    setName('');
                    setTypeComponent('');
                    setPrice(null);
                    setCogs(null);
                } catch (error) {
                    setAlert({ type: 'error', message: `${error}` });
                } finally {
                    setLoading(undefined);
                    setAddPrice(false);
                }
            }
        }
    };

    return (
        <form className="w-full grid grid-cols-2 gap-5" onSubmit={sumbitCreate}>
            <Card className="full">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-xl font-semibold text-slate-700">Tambah Data Komponen</h1>
                    <Link
                        href={'/components'}
                        className="flex items-center justify-center gap-1 text-sm px-3 py-2 bg-red-600 text-slate-100 font-medium rounded-lg"
                    >
                        <IconArrowBack size={20} stroke={2} /> Kembali
                    </Link>
                </div>

                <div className="flex items-start justify-center gap-5 w-full">
                    <div className="w-full relative">
                        <label
                            htmlFor="NameComponent"
                            className={`text-sm uppercase font-semibold block absolute -top-2.5 bg-slate-200 left-5 ${
                                errorValidation?.type === 'name' ? 'text-red-500' : 'text-slate-700'
                            }`}
                        >
                            Nama Komponen
                        </label>
                        <input
                            type="text"
                            name="name"
                            className={`px-3 py-2 text-sm bg-transparent border-2 outline-none rounded-lg w-full ${
                                errorValidation?.type === 'name' ? 'border-red-500' : 'border-slate-500'
                            }`}
                            placeholder="Masukan Nama Komponen..."
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                setName(e.target.value);
                                setErrorValidation(undefined);
                            }}
                            value={name}
                            autoComplete="off"
                        />
                        {errorValidation?.type === 'name' && <small className="text-red-500">{errorValidation.message}</small>}
                    </div>

                    <div className="w-full relative">
                        <label
                            htmlFor="TypeComponent"
                            className="text-sm uppercase font-semibold text-slate-700 block absolute -top-2.5 bg-slate-200 left-5"
                        >
                            Tipe Komponen
                        </label>
                        <select
                            name="typeComponent"
                            className="px-3 py-2 text-sm bg-transparent border-2 border-slate-500 rounded-lg w-full appearance-none text-center"
                            defaultValue={''}
                            value={typeComponent}
                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setTypeComponent(e.target.value)}
                        >
                            <option value={''}>--Pilih---</option>
                            <option value="MATERIAL" selected={typeComponent === 'MATERIAL'}>
                                Material
                            </option>
                            <option value="ADDON" selected={typeComponent === 'ADDON'}>
                                Addons
                            </option>
                            <option value="PROCESSING" selected={typeComponent === 'PROCESSING'}>
                                Processing
                            </option>
                            <option value="CONSUMING" selected={typeComponent === 'CONSUMING'}>
                                Consuming
                            </option>
                            <option value="FINISHING" selected={typeComponent === 'FINISHING'}>
                                Finishing
                            </option>
                        </select>
                    </div>
                </div>

                <ComponentsModal
                    setErrorValidation={setErrorValidation}
                    modal={modal}
                    setModal={setModal}
                    setAddPrice={setAddPrice}
                    addPrice={addPrice}
                    name={name}
                    setAlert={setAlert}
                    submitCreate={sumbitCreate}
                    loading={loading}
                />
            </Card>
            {addPrice && (
                <Card className="full">
                    <h1 className="text-xl font-semibold text-slate-700 mb-10">Harga</h1>

                    <div className="flex items-center justify-center gap-5 w-full">
                        <div className="w-full relative">
                            <label
                                htmlFor="priceComponent"
                                className="text-sm uppercase font-semibold text-slate-700 block absolute -top-2.5 bg-slate-200 left-5"
                            >
                                Harga Jual
                            </label>
                            <CurrencyInput
                                className="px-3 py-2 text-sm bg-transparent border-2 border-slate-500 rounded-lg w-full"
                                intlConfig={{ locale: 'id-ID', currency: 'IDR' }}
                                name="price"
                                placeholder="Masukan harga jual..."
                                decimalsLimit={0}
                                autoComplete="off"
                                onValueChange={(value, name, values) => setPrice(values ? values.float : undefined)}
                            />
                        </div>
                        <div className="w-full relative">
                            <label
                                htmlFor="priceComponent"
                                className="text-sm uppercase font-semibold text-slate-700 block absolute -top-2.5 bg-slate-200 left-5"
                            >
                                Harga Modal
                            </label>
                            <CurrencyInput
                                className="px-3 py-2 text-sm bg-transparent border-2 border-slate-500 rounded-lg w-full"
                                intlConfig={{ locale: 'id-ID', currency: 'IDR' }}
                                name="cogs"
                                placeholder="Masukan harga modal..."
                                decimalsLimit={0}
                                autoComplete="off"
                                onValueChange={(value, name, values) => setCogs(values ? values.float : undefined)}
                            />
                        </div>
                    </div>

                    <div className="flex justify-between items-center w-full mt-5">
                        <div>
                            <p>
                                <b>Keuntungan: </b>
                                {formatCurrency.format(profit)}
                            </p>
                        </div>
                        <button
                            type="submit"
                            disabled={loading?.status}
                            className=" text-sm font-semibold px-3 py-2 bg-blue-600 text-slate-100 rounded-lg"
                        >
                            <div className="flex items-center justify-center gap-1">
                                {loading?.func === 'create' ? (
                                    <>
                                        <IconLoader3 className="animate-spin" size={18} /> <span className="animate-bounce">Menyimpan...</span>
                                    </>
                                ) : (
                                    <>
                                        Simpan <IconCloudUp size={18} />
                                    </>
                                )}
                            </div>
                        </button>
                    </div>
                </Card>
            )}
        </form>
    );
}

// 'price', values?.float ? Number(values.float) : undefined;
