import { Card } from '@/components/Card';
import { IconCirclePlus, IconX } from '@tabler/icons-react';
import React from 'react';

export const ComponentNextModal: React.FC<{ handleNext: (types: string) => void; setFormQualities: ([]) => void }> = ({
    handleNext,
    setFormQualities,
}) => {
    return (
        <div className="fixed w-full h-screen bg-black/20 backdrop-blur top-0 left-0 z-10 flex items-center justify-center">
            <Card className="w-11/12 sm:w-8/12 md:w-4/12">
                <p>Apakah anda ingin menambahkan kualitas komponen?</p>

                <div className="flex items-center justify-end w-full mt-5 gap-5">
                    <button onClick={() => handleNext('pricings')} type="button" className="px-5 py-2 rounded-lg bg-pink-500 text-slate-100">
                        <div className="flex items-center justify-center gap-1">
                            <IconX size={16} stroke={3} /> <span className="text-xs font-bold">Tidak</span>
                        </div>
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            handleNext('qualities');
                            setFormQualities([{ name: '', price: '', cogs: '' }]);
                        }}
                        className="px-5 py-2 rounded-lg bg-sky-500 text-slate-100"
                    >
                        <div className="flex items-center justify-center gap-1">
                            <IconCirclePlus size={16} stroke={3} /> <span className="text-xs font-bold">Tambah</span>
                        </div>
                    </button>
                </div>
            </Card>
        </div>
    );
};
