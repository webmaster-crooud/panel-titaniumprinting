import { IconTransform, IconLoader3, IconX } from '@tabler/icons-react';
import { Tooltip } from 'react-tippy';
import { Card } from '@/components/Card';
import React, { useState } from 'react';
import { BACKEND } from '../../../../lib/utils';
import { useSetAtom } from 'jotai';
import { alertShow } from '../../../../store/Atom';

interface Sizes {
    id: number;
    width: number;
    height: number;
    length: number;
    weight: number;
    price: number;
    cogs: number;
}

type propsQualitiesUpdateModal = {
    data: Sizes;
    qualityId: string | number;
    fetchComponents: () => Promise<void>;
};

const SizeUpdateModal: React.FC<propsQualitiesUpdateModal> = ({ data, qualityId, fetchComponents }) => {
    const [modal, setModal] = useState<{ func: string; id: number | string } | undefined>(undefined);
    const [loading, setLoading] = useState(false);
    const setAlert = useSetAtom(alertShow);
    const [width, setWidth] = useState(data ? data.width : 0);
    const [length, setLength] = useState(data?.length);
    const [height, setHeight] = useState<number>(data?.height);
    const [weight, setWeight] = useState(data?.weight);
    const [price, setPrice] = useState(data?.price);
    const [cogs, setCogs] = useState(data?.cogs);

    const submitUpdateQualities = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        try {
            await new Promise((resolve) => setTimeout(resolve, 1500));
            const response = await fetch(`${BACKEND}/components/sizes/${qualityId}/${data.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ width, length, height, weight, price, cogs }),
            });
            const result = await response.json();
            if (result.error === true) {
                setAlert({ type: 'error', message: result.message });
            }

            fetchComponents();
            setAlert({ type: 'success', message: result.message });
            setModal(undefined);
        } catch (error) {
            setAlert({ type: 'error', message: `${error}` });
            setModal(undefined);
        } finally {
            setLoading(false);
            setModal(undefined);
        }
    };

    return (
        <>
            <Tooltip title="Pengaturan" size="small" position="left">
                <button onClick={() => setModal({ func: 'sizesUpdate', id: data.id })}>
                    <IconTransform size={16} stroke={2} className="text-sky-500" />
                </button>
            </Tooltip>

            {/* Modal */}
            {modal?.func === 'sizesUpdate' && modal.id === data.id && (
                <div className="fixed top-0 left-0 right-0 w-full h-screen z-20 bg-black/5 backdrop-blur-sm">
                    <div className="w-4/12 h-full mx-auto flex items-center justify-center">
                        <Card className="w-full">
                            <div className="flex items-center justify-between mb-5">
                                <div></div>
                                <button onClick={() => setModal(undefined)}>
                                    <IconX size={25} stroke={2} />
                                </button>
                            </div>

                            <form onSubmit={submitUpdateQualities}>
                                <div className="grid grid-cols-2 gap-5">
                                    <div className="relative w-full">
                                        <label
                                            htmlFor="width"
                                            className={`text-sm uppercase font-semibold block absolute -top-2.5 bg-slate-200 left-5 text-slate-700`}
                                        >
                                            Lebar (Centimeter)
                                        </label>
                                        <input
                                            type="text"
                                            name="width"
                                            className={`px-3 py-2 text-sm bg-transparent border-2 outline-none rounded-lg w-full border-slate-500`}
                                            placeholder="Masukan lebar..."
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                setWidth(Number(e.target.value));
                                            }}
                                            value={width ? width : 0}
                                            autoComplete="off"
                                        />
                                    </div>
                                    <div className="relative w-full">
                                        <label
                                            htmlFor="height"
                                            className={`text-sm uppercase font-semibold block absolute -top-2.5 bg-slate-200 left-5 text-slate-700`}
                                        >
                                            Tinggi (Centimeter)
                                        </label>
                                        <input
                                            type="text"
                                            name="height"
                                            className={`px-3 py-2 text-sm bg-transparent border-2 outline-none rounded-lg w-full border-slate-500`}
                                            placeholder="Masukan tinggi..."
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                setHeight(Number(e.target.value));
                                            }}
                                            value={height}
                                            autoComplete="off"
                                        />
                                    </div>
                                    <div className="relative w-full">
                                        <label
                                            htmlFor="length"
                                            className={`text-sm uppercase font-semibold block absolute -top-2.5 bg-slate-200 left-5 text-slate-700`}
                                        >
                                            Panjang (Centimeter)
                                        </label>
                                        <input
                                            type="text"
                                            name="length"
                                            className={`px-3 py-2 text-sm bg-transparent border-2 outline-none rounded-lg w-full border-slate-500`}
                                            placeholder="Masukan panjang..."
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                setLength(Number(e.target.value));
                                            }}
                                            value={length}
                                            autoComplete="off"
                                        />
                                    </div>
                                    <div className="relative w-full">
                                        <label
                                            htmlFor="weight"
                                            className={`text-sm uppercase font-semibold block absolute -top-2.5 bg-slate-200 left-5 text-slate-700`}
                                        >
                                            Berat (Kilogram)
                                        </label>
                                        <input
                                            type="text"
                                            name="weight"
                                            className={`px-3 py-2 text-sm bg-transparent border-2 outline-none rounded-lg w-full border-slate-500`}
                                            placeholder="Masukan berat..."
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                setWeight(Number(e.target.value));
                                            }}
                                            value={weight}
                                            autoComplete="off"
                                        />
                                    </div>
                                    <div className="relative w-full">
                                        <label
                                            htmlFor="price"
                                            className={`text-sm uppercase font-semibold block absolute -top-2.5 bg-slate-200 left-5 text-slate-700`}
                                        >
                                            Harga Jual
                                        </label>
                                        <input
                                            type="text"
                                            name="price"
                                            className={`px-3 py-2 text-sm bg-transparent border-2 outline-none rounded-lg w-full border-slate-500`}
                                            placeholder="Masukan harga jual..."
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                setPrice(Number(e.target.value));
                                            }}
                                            value={price}
                                            autoComplete="off"
                                        />
                                    </div>
                                    <div className="relative w-full">
                                        <label
                                            htmlFor="cogs"
                                            className={`text-sm uppercase font-semibold block absolute -top-2.5 bg-slate-200 left-5 text-slate-700`}
                                        >
                                            Harga Modal
                                        </label>
                                        <input
                                            type="text"
                                            name="cogs"
                                            className={`px-3 py-2 text-sm bg-transparent border-2 outline-none rounded-lg w-full border-slate-500`}
                                            placeholder="Masukan harga modal..."
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                setCogs(Number(e.target.value));
                                            }}
                                            value={cogs}
                                            autoComplete="off"
                                        />
                                    </div>
                                </div>
                                <div className="flex items-center justify-end mt-5">
                                    <button
                                        disabled={loading}
                                        className="px-4 py-2 text-sm font-semibold bg-sky-500 rounded-lg text-slate-100 disabled:opacity-75"
                                        type="submit"
                                    >
                                        {loading ? <IconLoader3 size={18} stroke={2} className="animate-spin" /> : 'Simpan'}
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

export default SizeUpdateModal;
