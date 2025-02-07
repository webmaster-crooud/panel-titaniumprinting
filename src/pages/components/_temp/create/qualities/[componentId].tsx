import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useSetAtom } from 'jotai';
import Link from 'next/link';
import { IconArrowBack, IconCirclePlus, IconLoader3, IconX } from '@tabler/icons-react';
import { Tooltip } from 'react-tippy';
import { Card } from '@/components/Card';
import CurrencyInput from 'react-currency-input-field';
import { BACKEND } from '../../../../../../lib/utils';
import { alertShow } from '../../../../../../store/Atom';

interface DataSize {
    width: number | string | null;
    height: number | string | null;
    weight: number | string | null;
    price: number | string | null;
    cogs: number | string | null;
    length: number | string | null;
}

export default function CreateQualityPage() {
    const router = useRouter();
    const { componentId } = router.query;
    const [loading, setLoading] = useState(false);
    const [nameComponent, setNameComponent] = useState<string>('');
    const [name, setName] = useState<string>('');
    const [orientationChecked, setOrientationChecked] = useState(false);

    const setAlert = useSetAtom(alertShow);
    const [errorValidation, setErrorValidation] = useState<{ type: string; message: string } | undefined>(undefined);
    const [sizes, setSizes] = useState<DataSize[]>([{ width: 0, cogs: 0, height: 0, length: 0, price: 0, weight: 0 }]);

    useEffect(() => {
        const getNameComponent = async () => {
            const response = await fetch(`${BACKEND}/components/${componentId}`);
            const result = await response.json();

            if (result.error === true) {
                setAlert({ type: 'error', message: result.message });
            }
            setNameComponent(result.data?.name);
        };

        getNameComponent();
    }, [componentId, setAlert]);

    const handlerAddNewSize = () => {
        const addSize: DataSize = {
            weight: 0,
            height: 0,
            width: 0,
            length: 0,
            cogs: 0,
            price: 0,
        };
        setSizes([...sizes, addSize]);
    };

    const removeFields = (index: number) => {
        const data = [...sizes];
        data.splice(index, 1);
        setSizes(data);
    };

    type SizeKeys = keyof DataSize;

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const data = [...sizes];
        const key = e.target.name as SizeKeys;

        data[index][key] = Number(e.target.value);

        setSizes(data);
    };

    const submitCreateQualitiesSizes = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        try {
            await new Promise((resolve) => setTimeout(resolve, 2000));
            const response = await fetch(`${BACKEND}/components/qualities/${componentId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name,
                    orientation: orientationChecked,
                    sizes: sizes,
                }),
            });
            const result = await response.json();
            if (result.error === true) {
                setAlert({ type: 'error', message: result.message });
                return;
            }
            setAlert({ type: 'success', message: result.message });
            router.push(`/components/update/${componentId}`);
        } catch (error) {
            setAlert({ type: 'error', message: `${error}` });
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="relative py-8">
            <div className="flex items-center justify-between">
                <h1 className="text-xl font-bold text-slate-800">Komponen &quot;{nameComponent}&quot;</h1>
                <Link href={'/components'} className="px-3 py-2 text-sm font-semibold bg-red-600 text-slate-100 rounded-lg">
                    <Tooltip title="List Komponen" arrow size="small" position="bottom">
                        <div className="flex items-center justify-center gap-1">
                            <IconArrowBack size={18} stroke={2.5} /> <span>Kembali</span>
                        </div>
                    </Tooltip>
                </Link>
            </div>

            <form onSubmit={submitCreateQualitiesSizes} className="grid grid-cols-2 gap-5 mt-8 items-start">
                <Card>
                    <h2 className="font-semibold text-lg">Formulir Data Kualitas</h2>
                    <div className="flex items-center justify-center gap-5  mt-5">
                        <div className="relative w-full">
                            <label
                                htmlFor="NameComponent"
                                className={`text-sm uppercase font-semibold block absolute -top-2.5 bg-blue-100 left-5 ${
                                    errorValidation?.type === 'name' ? 'text-red-500' : 'text-slate-700'
                                }`}
                            >
                                Kualitas
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
                        </div>
                        <div className="relative w-full">
                            <label htmlFor="NameComponent" className={`text-sm uppercase font-semibold block bg-blue-100 text-slate-700`}>
                                Orientasi?
                            </label>
                            <div className="flex items-center justify-start gap-5">
                                <div className="flex items-center">
                                    <input
                                        id="checked-checkbox"
                                        type="radio"
                                        checked={orientationChecked === true}
                                        onChange={() => setOrientationChecked(true)}
                                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded outline-none ring-0"
                                    />
                                    <label htmlFor="checked-checkbox" className="ms-2 text-sm font-medium text-slate-700">
                                        Punya
                                    </label>
                                </div>
                                <div className="flex items-center">
                                    <input
                                        id="default-checkbox"
                                        type="radio"
                                        checked={orientationChecked === false}
                                        onChange={() => setOrientationChecked(false)}
                                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded outline-none ring-0"
                                    />
                                    <label htmlFor="default-checkbox" className="ms-2 text-sm font-medium text-slate-700">
                                        Tidak
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-end mt-5">
                        <button disabled={loading} className="px-4 py-2 text-sm font-semibold bg-sky-600 text-slate-100 rounded-lg">
                            {loading ? (
                                <div className="flex items-center justify-center gap-1">
                                    <IconLoader3 size={18} stroke={2} className="animate-spin" /> Loading
                                </div>
                            ) : (
                                'Simpan'
                            )}
                        </button>
                    </div>
                </Card>
                <div>
                    {sizes.map((size, index) => (
                        <Card key={index} className="mb-7">
                            <div className="flex items-center justify-between mb-3">
                                <h1 className="font-semibold">Data Ukuran Kualitas {nameComponent}</h1>
                                {sizes.length === 1 ? null : (
                                    <button type="button" onClick={() => removeFields(index)}>
                                        <IconX size={30} stroke={2} />
                                    </button>
                                )}
                            </div>
                            <div className="p-3">
                                <div className="grid grid-cols-2 gap-5">
                                    <div className="relative w-full">
                                        <label
                                            htmlFor="width"
                                            className={`text-sm uppercase font-semibold block absolute -top-2.5 bg-blue-100 left-5 text-slate-700`}
                                        >
                                            Lebar (Centimeter)
                                        </label>
                                        <input
                                            type="number"
                                            name="width"
                                            className={`px-3 py-2 text-sm bg-transparent border-2 outline-none rounded-lg w-full border-slate-500`}
                                            placeholder="Masukan lebar..."
                                            onChange={(e) => handleFormChange(e, index)}
                                            value={size.width ? size.width : 0}
                                            autoComplete="off"
                                        />
                                    </div>
                                    <div className="relative w-full">
                                        <label
                                            htmlFor="height"
                                            className={`text-sm uppercase font-semibold block absolute -top-2.5 bg-blue-100 left-5 text-slate-700`}
                                        >
                                            Tinggi (Centimeter)
                                        </label>
                                        <input
                                            type="number"
                                            name="height"
                                            className={`px-3 py-2 text-sm bg-transparent border-2 outline-none rounded-lg w-full border-slate-500`}
                                            placeholder="Masukan tinggi..."
                                            onChange={(e) => handleFormChange(e, index)}
                                            value={size.height ? size.height : 0}
                                            autoComplete="off"
                                        />
                                    </div>
                                    <div className="relative w-full">
                                        <label
                                            htmlFor="length"
                                            className={`text-sm uppercase font-semibold block absolute -top-2.5 bg-blue-100 left-5 text-slate-700`}
                                        >
                                            Panjang (Centimeter)
                                        </label>
                                        <input
                                            type="number"
                                            name="length"
                                            className={`px-3 py-2 text-sm bg-transparent border-2 outline-none rounded-lg w-full border-slate-500`}
                                            placeholder="Masukan panjang..."
                                            onChange={(e) => handleFormChange(e, index)}
                                            value={size.length ? size.length : 0}
                                            autoComplete="off"
                                        />
                                    </div>
                                    <div className="relative w-full">
                                        <label
                                            htmlFor="weight"
                                            className={`text-sm uppercase font-semibold block absolute -top-2.5 bg-blue-100 left-5 text-slate-700`}
                                        >
                                            Berat (Kilogram)
                                        </label>
                                        <input
                                            type="number"
                                            name="weight"
                                            className={`px-3 py-2 text-sm bg-transparent border-2 outline-none rounded-lg w-full border-slate-500`}
                                            placeholder="Masukan berat..."
                                            onChange={(e) => handleFormChange(e, index)}
                                            value={size.weight ? size.weight : 0}
                                            autoComplete="off"
                                        />
                                    </div>
                                    <div className="relative w-full">
                                        <label
                                            htmlFor="price"
                                            className={`text-sm uppercase font-semibold block absolute -top-2.5 bg-blue-100 left-5 text-slate-700`}
                                        >
                                            Harga Jual
                                        </label>
                                        <input
                                            type="number"
                                            name="price"
                                            className={`px-3 py-2 text-sm bg-transparent border-2 outline-none rounded-lg w-full border-slate-500`}
                                            placeholder="Masukan harga jual..."
                                            onChange={(e) => handleFormChange(e, index)}
                                            value={size.price ? size.price : 0}
                                            autoComplete="off"
                                        />
                                    </div>
                                    <div className="relative w-full">
                                        <label
                                            htmlFor="cogs"
                                            className={`text-sm uppercase font-semibold block absolute -top-2.5 bg-blue-100 left-5 text-slate-700`}
                                        >
                                            Harga Modal
                                        </label>
                                        <input
                                            type="number"
                                            name="cogs"
                                            className={`px-3 py-2 text-sm bg-transparent border-2 outline-none rounded-lg w-full border-slate-500`}
                                            placeholder="Masukan harga beli..."
                                            onChange={(e) => handleFormChange(e, index)}
                                            value={size.cogs ? size.cogs : 0}
                                            autoComplete="off"
                                        />
                                    </div>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={handlerAddNewSize}
                                className="px-4 py-2 text-sm font-semibold bg-sky-600 text-slate-100 rounded-lg mt-5"
                            >
                                <div className="flex items-center justify-center gap-1">
                                    <IconCirclePlus size={19} stroke={2} /> <span>Tambah</span>
                                </div>
                            </button>
                        </Card>
                    ))}
                </div>
            </form>
        </section>
    );
}
