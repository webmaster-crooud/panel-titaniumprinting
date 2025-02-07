import { IconTransform, IconLoader3, IconX } from '@tabler/icons-react';

import { Card } from '@/components/Card';
import React, { useState } from 'react';
import { BACKEND } from '../../../lib/utils';
import { useSetAtom } from 'jotai';
import { alertShow } from '../../../store/Atom';

interface Qualities {
    id: number | string;
    name: string;
    orientation: boolean;
}

type propsQualitiesUpdateModal = {
    data: Qualities;
    componentId: string;
    fetchComponents: () => Promise<void>;
};

const QualitiesUpdateModal: React.FC<propsQualitiesUpdateModal> = ({ data, componentId, fetchComponents }) => {
    const [modal, setModal] = useState<{ func: string; id: number | string } | undefined>(undefined);
    const [name, setName] = useState<string>(data?.name);
    const [orientation, setOrientation] = useState(data?.orientation);
    const [loading, setLoading] = useState(false);
    const setAlert = useSetAtom(alertShow);

    const submitUpdateQualities = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        try {
            await new Promise((resolve) => setTimeout(resolve, 1500));
            const response = await fetch(`${BACKEND}/components/qualities/${componentId}/${data.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, orientation }),
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
            <button onClick={() => setModal({ func: 'qualities', id: data.id })}>
                <IconTransform size={16} stroke={2} className="text-sky-500" />
            </button>

            {/* Modal */}
            {modal?.func === 'qualities' && modal.id === data.id && (
                <div className="fixed top-0 left-0 right-0 w-full h-screen z-20 bg-black/5 backdrop-blur-sm">
                    <div className="w-4/12 h-full mx-auto flex items-center justify-center">
                        <Card className="w-full">
                            <div className="flex items-center justify-between">
                                <h2 className="font-semibold">{data.name}</h2>
                                <button onClick={() => setModal(undefined)}>
                                    <IconX size={25} stroke={2} />
                                </button>
                            </div>

                            <form onSubmit={submitUpdateQualities}>
                                <div className="flex items-center justify-center gap-5  mt-5">
                                    <div className="relative w-full">
                                        <label
                                            htmlFor="NameComponent"
                                            className={`text-sm uppercase font-semibold block absolute -top-2.5 bg-slate-200 left-5`}
                                        >
                                            Kualitas
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            className={`px-3 py-2 text-sm bg-transparent border-2 outline-none rounded-lg w-full border-slate-700`}
                                            placeholder="Masukan Nama Komponen..."
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                setName(e.target.value);
                                            }}
                                            value={name}
                                            autoComplete="off"
                                        />
                                    </div>
                                    <div className="relative w-full">
                                        <label
                                            htmlFor="NameComponent"
                                            className={`text-sm uppercase font-semibold block bg-slate-200 text-slate-700`}
                                        >
                                            Orientasi?
                                        </label>
                                        {/* <div className="flex items-center justify-start gap-5">
                                            <div className="flex items-center">
                                                <input
                                                    id="checked-checkbox"
                                                    type="radio"
                                                    value={orientation}
                                                    checked={orientation === true}
                                                    onChange={() => setOrientation(true)}
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
                                                    checked={orientation === false}
                                                    value={!orientation}
                                                    onChange={() => setOrientation(false)}
                                                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded outline-none ring-0"
                                                />
                                                <label htmlFor="default-checkbox" className="ms-2 text-sm font-medium text-slate-700">
                                                    Tidak
                                                </label>
                                            </div>
                                        </div> */}
                                    </div>
                                </div>

                                <div className="flex items-center justify-end">
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

export default QualitiesUpdateModal;
