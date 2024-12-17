import { Card } from '@/components/Card';
import { IconAdjustmentsDollar, IconTrash, IconX } from '@tabler/icons-react';
import React, { useState } from 'react';
import { fetchWithAuth } from '../../../../lib/fetchWithAuth';
import { useAuthToken } from '../../../../hooks/useAuthToken';
import { BACKEND, formatCurrency } from '../../../../lib/utils';
import { useSetAtom } from 'jotai';
import { alertShow } from '../../../../store/Atom';

type propsDetailQualityModal = {
    quality: any;
};

interface Sizes {
    name: string;
    pricings: {
        price: string | number;
        cogs: string | number;
    }[];
}

export const DetailQualityModal: React.FC<propsDetailQualityModal> = ({ quality }) => {
    const { token, refreshToken } = useAuthToken();
    const [modal, setModal] = useState<{ func: string; id: number } | undefined>(undefined);
    const [loading, setLoading] = useState<boolean>(false);
    const [sizes, setSizes] = useState<Sizes[]>([]);
    const setAlert = useSetAtom(alertShow);

    const fetchDetailQualitySizes = async () => {
        setLoading(true);
        try {
            const response = await fetchWithAuth(token, refreshToken, `${BACKEND}/sizes/quality/${quality.id}`);
            const result = await response.json();
            if (result.error) {
                setAlert({ type: 'warning', message: result.message });
            } else [setSizes(result.data)];
        } catch (error) {
            setAlert({ type: 'error', message: `${error}` });
        } finally {
            setLoading(false);
        }
    };
    console.log(sizes);
    return (
        <>
            <button
                onClick={() => {
                    setModal({ func: 'detail', id: quality.id });
                    fetchDetailQualitySizes();
                }}
                type="button"
                className="flex items-center justify-center gap-1 bg-cyan-300 text-cyan-700 text-sm font-semibold px-4 py-2 rounded-lg"
            >
                Detail
            </button>

            {modal?.func === 'detail' && modal?.id === quality.id && (
                <div className="fixed top-0 left-0 right-0 w-full h-screen bg-black/10 backdrop-blur-sm flex items-center justify-center">
                    <Card className="w-5/12">
                        <div className="flex items-center justify-between">
                            <h6 className="text-xl font-semibold text-blue-900">{quality.name}</h6>
                            <button onClick={() => setModal(undefined)}>
                                <IconX size={25} stroke={2.5} />
                            </button>
                        </div>

                        {sizes.map((size, index) => (
                            <div className="flex items-center justify-start gap-3 mt-3" key={index}>
                                <span className="px-4 py-2 text-sm border border-blue-900 bg-transparent text-blue-900 rounded-lg">{size.name}</span>
                                <span className="px-4 py-2 text-sm border border-blue-900 bg-transparent text-blue-900 rounded-lg">
                                    {size.pricings && formatCurrency.format(Number(size.pricings[0].price))}
                                </span>
                                <span className="px-4 py-2 text-sm border border-blue-900 bg-transparent text-blue-900 rounded-lg">
                                    {size.pricings && formatCurrency.format(Number(size.pricings[0].cogs))}
                                </span>
                                <button className="px-2 py-2 text-sm border border-blue-900 bg-transparent text-cyan-900 rounded-lg flex items-center justify-center gap-1">
                                    <IconAdjustmentsDollar size={16} stroke={2} /> <span className="text-sm font-semibold">Progressive</span>
                                </button>
                                <button className="px-2 py-2 text-sm border border-blue-900 bg-transparent text-red-500 rounded-lg">
                                    <IconTrash size={16} stroke={2} />
                                </button>
                            </div>
                        ))}
                    </Card>
                </div>
            )}
        </>
    );
};
