import { Card } from '@/components/Card';
import { useAuthToken } from '../../../hooks/useAuthToken';
import { useCallback, useEffect, useState } from 'react';
import { Loader } from '@/components/Loader';
import { useSetAtom } from 'jotai';
import { alertShow } from '../../../store/Atom';
import Link from 'next/link';
import { IconCalendarTime, IconCalendarX, IconDatabaseEdit, IconPlus, IconSettings2, IconTrash } from '@tabler/icons-react';
import { fetchWithAuth } from '../../../lib/fetchWithAuth';
import { BACKEND, formatCurrency, formatMoment } from '../../../lib/utils';
import { Promotion } from './create';

export default function PromotionListPage() {
    const { token, refreshToken } = useAuthToken();
    const [loading, setLoading] = useState<{ type: string } | undefined>(undefined);
    const setAlert = useSetAtom(alertShow);
    const [promotions, setPromotions] = useState<Promotion[]>([]);

    const fetchPromotion = useCallback(async () => {
        setLoading({ type: 'fetch' });
        try {
            const response = await fetchWithAuth(token, refreshToken, `${BACKEND}/promotions`);
            const result = await response.json();
            if (result.error) {
                setAlert({ type: 'error', message: `${result.message}` });
            }
            setPromotions(result.data);
        } catch (error) {
            setAlert({ type: 'error', message: `${error}` });
        } finally {
            setLoading(undefined);
        }
    }, [refreshToken, token, setAlert]);

    useEffect(() => {
        fetchPromotion();
    }, [fetchPromotion]);
    const deletePromotion = async (code: string) => {
        setLoading({ type: 'delete' });
        try {
            const response = await fetchWithAuth(token, refreshToken, `${BACKEND}/promotions/${code}`, {
                method: 'DELETE',
            });
            const result = await response.json();
            if (result.error) {
                setAlert({ type: 'error', message: `${result.message}` });
            }
            fetchPromotion();
        } catch (error) {
            setAlert({ type: 'error', message: `${error}` });
        } finally {
            setLoading(undefined);
        }
    };

    if (loading?.type === 'fetch') {
        return <Loader />;
    }

    return (
        <Card className="mt-8 w-9/12">
            <div className="flex items-center justify-between">
                <h1 className="text-lg font-semibold text-blue-900">List Promosi</h1>
                <div className="flex items-center justify-end gap-2">
                    <Link
                        href={'/promotions/create'}
                        className="flex items-center justify-center gap-1 bg-blue-900 text-slate-100 font-semibold text-sm px-5 py-2 rounded-lg"
                    >
                        <IconPlus size={16} stroke={2} /> <span>Promosi</span>
                    </Link>
                </div>
            </div>

            <table className="mt-8 w-full table">
                <thead className="text-sm">
                    <tr className="bg-blue-900 text-slate-100">
                        <th className="px-3 py-2 text-center"></th>
                        <th className="px-3 py-2 text-start">Kode</th>
                        <th className="px-3 py-2 text-start">Potongan</th>
                        <th>
                            <div className="flex items-center justify-center px-3">
                                <IconSettings2 size={18} stroke={2} />
                            </div>
                        </th>
                        <th>
                            <div className="flex items-center justify-end px-3">
                                <IconCalendarTime size={18} stroke={2} />
                            </div>
                        </th>
                        <th>
                            <div className="flex items-center justify-end px-3">
                                <IconCalendarX size={18} stroke={2} />
                            </div>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {promotions.map((promotion, index) => (
                        <tr key={index} className="border-b border-blue-900 text-blue-900">
                            <td className="px-3 py-2 text-sm font-medium text-blue">{index + 1}</td>
                            <td className="px-3 py-2 text-sm font-medium text-blue">{promotion.code}</td>
                            <td className="px-3 py-2 text-sm font-medium text-blue">
                                {promotion.price && promotion.percent
                                    ? `${formatCurrency.format(Number(promotion.price))} + ${promotion.percent}%`
                                    : promotion.price
                                    ? formatCurrency.format(Number(promotion.price))
                                    : `${promotion.percent}%`}
                            </td>
                            <td className="text-end px-3 py-2 text-sm font-medium text-blue">
                                <div className="flex items-center justify-center gap-3">
                                    <button onClick={() => deletePromotion(promotion.code)}>
                                        <IconTrash stroke={2} size={16} className="text-red-600" />
                                    </button>

                                    {/* <button>
                                        <IconDatabaseEdit stroke={2} size={16} />
                                    </button> */}
                                </div>
                            </td>
                            <td className="text-end px-3 py-2 text-sm font-medium text-blue">
                                {formatMoment(promotion.start).format('DD, MMMM YYYY - HH.mm')}
                            </td>
                            <td className="text-end px-3 py-2 text-sm font-medium text-blue">
                                {formatMoment(promotion.end).format('DD, MMMM YYYY - HH.mm')}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </Card>
    );
}
