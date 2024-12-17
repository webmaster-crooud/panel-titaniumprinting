import { useRouter } from 'next/router';
import { useAuthToken } from '../../../hooks/useAuthToken';
import React, { useCallback, useEffect, useState } from 'react';
import { fetchWithAuth } from '../../../lib/fetchWithAuth';

import { useSetAtom } from 'jotai';
import { alertShow } from '../../../store/Atom';
import { IconArrowBack, IconEye, IconPlus, IconTrash } from '@tabler/icons-react';
import { Card } from '@/components/Card';
import Link from 'next/link';
import { BACKEND, formatCurrency, formatMoment } from '../../../lib/utils';
import { Loader } from '@/components/Loader';
import { ComponentAddSizesModal } from '@/components/Modal/Component/AddSize.modal';
import { DetailQualityModal } from '@/components/Modal/Component/DetailQuality.modal';
import { ProgressivePricingModal } from '@/components/Modal/Component/ProgressivePricing.modal';
import { AddQualtiesModal } from '@/components/Modal/Component/AddQualities.modal';

interface Component {
    name: string;
    typeComponent: string;
    flag: string;
    createdAt: Date | string;
    updatedAt: Date | string;
    price: number | string | null;
    cogs: number | string | null;

    qualities: {
        id: number;
        flag: string;
        name: string;
        price: number | string | null;
        cogs: number | string | null;
        qualitiesSize?: {
            id: number;
            sizes: {
                name: string;
            };
            price: number | string | null;
            cogs: number | string | null;
        }[];
    }[];
}

export default function DetailPageComponent() {
    const [loading, setLoading] = useState<{ field: string } | undefined>(undefined);
    const router = useRouter();
    const { componentId } = router.query;
    const { token, refreshToken } = useAuthToken();
    const [component, setComponent] = useState<Component>({
        name: '',
        typeComponent: '',
        flag: '',
        createdAt: '',
        updatedAt: '',
        cogs: null,
        price: null,
        qualities: [
            {
                name: '',
                id: 0,
                flag: '',
                cogs: null,
                price: null,
                qualitiesSize: [],
            },
        ],
    });
    const setAlert = useSetAtom(alertShow);

    const fetchDetailComponent = useCallback(async () => {
        if (!componentId) return;
        setLoading({ field: 'component' });
        try {
            await new Promise((resolve) => setTimeout(resolve, 1000));

            const response = await fetchWithAuth(token, refreshToken, `${BACKEND}/components/${componentId}`);
            const result = await response.json();
            if (result.error) {
                setAlert({ type: 'error', message: result.message });
            } else {
                setComponent(result.data);
                console.log(result);
            }
        } catch (error) {
            setAlert({ type: 'error', message: `${error}` });
        } finally {
            setLoading(undefined);
        }
    }, [token, refreshToken, componentId, setAlert]);
    useEffect(() => {
        fetchDetailComponent();
    }, [fetchDetailComponent]);

    if (loading) {
        return <Loader />;
    }

    const handleDeletedQualtySize = async (qualitySizeId: number) => {
        setLoading({ field: 'component' });
        try {
            const response = await fetchWithAuth(token, refreshToken, `${BACKEND}/sizes/quality/${qualitySizeId}`, {
                method: 'DELETE',
            });

            const result = await response.json();
            if (result.error) {
                setAlert({ type: 'error', message: result.message });
            } else {
                setAlert({ type: 'success', message: result.message });
                fetchDetailComponent();
            }
        } catch (error) {
            setAlert({ type: 'error', message: `${error}` });
        } finally {
            setLoading(undefined);
        }
    };

    const handleDeletedQuality = async (id: number) => {
        setLoading({ field: 'component' });
        try {
            const response = await fetchWithAuth(token, refreshToken, `${BACKEND}/qualities/${componentId}/${id}`, {
                method: 'DELETE',
            });
            const result = await response.json();
            if (result.error) {
                setAlert({ type: 'error', message: result.message });
            } else {
                setAlert({ type: 'success', message: result.message });
                fetchDetailComponent();
            }
        } catch (error) {
            setAlert({ type: 'error', message: `${error}` });
        } finally {
            setLoading(undefined);
        }
    };

    if (loading) {
        return <Loader />;
    }
    return (
        <>
            <div className="grid grid-cols-4 mt-8 gap-5">
                <Card className="col-span-3">
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-bold text-slate-900">Detail Komponen</h1>
                        <div className="flex items-center justify-end gap-3">
                            <Link
                                href={'/components/create'}
                                type="button"
                                className="px-4 py-2 text-sm font-semibold text-blue-700 bg-blue-300 rounded-lg flex items-center justify-center gap-1"
                            >
                                <IconPlus stroke={2} size={16} /> <span>Kompenen</span>
                            </Link>
                            <Link
                                href={'/components'}
                                className="px-4 py-2 text-sm font-semibold text-slate-100 bg-red-500 rounded-lg flex items-center justify-center gap-1"
                            >
                                <IconArrowBack size={16} stroke={2} /> <span>Kembali</span>
                            </Link>
                        </div>
                    </div>
                    <table className="table w-full text-sky-800 mt-5">
                        <tbody>
                            <tr className="text-sm">
                                <th className="bg-sky-400 rounded-tl-lg text-start px-3 py-2 font-medium text-slate-100">Nama Komponen</th>
                                <td className="bg-sky-300 rounded-tr-lg text-start px-3 py-2">{component.name}</td>
                            </tr>
                            <tr className="text-sm border border-b-sky-100">
                                <th className="bg-sky-400 text-start px-3 py-2 font-medium text-slate-100">Tipe Komponen</th>
                                <td className="bg-sky-300 text-start px-3 py-2">{component.typeComponent}</td>
                            </tr>
                            {component.price && (
                                <tr className="text-sm border border-b-sky-100">
                                    <th className="bg-sky-400 text-start px-3 py-2 font-medium text-slate-100">Harga Modal</th>
                                    <td className="bg-sky-300 text-start px-3 py-2">{formatCurrency.format(Number(component.price))}</td>
                                </tr>
                            )}
                            {component.cogs && (
                                <tr className="text-sm border border-b-sky-100">
                                    <th className="bg-sky-400 text-start px-3 py-2 font-medium text-slate-100">Harga Jual</th>
                                    <td className="bg-sky-300 text-start px-3 py-2">{formatCurrency.format(Number(component.cogs))}</td>
                                </tr>
                            )}
                            {component.price && component.cogs && (
                                <tr className="text-sm border border-b-sky-100">
                                    <th className="bg-sky-400 text-start px-3 py-2 font-medium text-slate-100">Keuntungan</th>
                                    <td className="bg-sky-300 text-start px-3 py-2">
                                        {formatCurrency.format(Number(component.price) - Number(component.cogs))}
                                    </td>
                                </tr>
                            )}
                            <tr className="text-sm border border-b-sky-100">
                                <th className="bg-sky-400 text-start px-3 py-2 font-medium text-slate-100">Status</th>
                                <td className="bg-sky-300 text-start px-3 py-2">
                                    {component.flag === 'ACTIVED' && (
                                        <span className="px-5 py-1.5 rounded-full bg-green-300 font-semibold text-xs text-green-700">Aktif</span>
                                    )}
                                    {component.flag === 'FAVOURITE' && (
                                        <span className="px-5 py-1.5 rounded-full bg-orange-300 font-semibold text-xs text-orange-700">Aktif</span>
                                    )}
                                </td>
                            </tr>
                            <tr className="text-sm border border-b-sky-100">
                                <th className="bg-sky-400 text-start px-3 py-2 font-medium text-slate-100">Terbit</th>
                                <td className="bg-sky-300 text-start px-3 py-2">
                                    {formatMoment(component.createdAt).format('dddd, DD MMMM YYYY HH:mm')} WIB
                                </td>
                            </tr>
                            <tr className="text-sm border border-b-sky-100">
                                <th className="bg-sky-400 text-start px-3 py-2 rounded-bl-lg font-medium text-slate-100">Terupdate</th>
                                <td className="bg-sky-300 text-start px-3 py-2 rounded-br-lg">
                                    {formatMoment(component.updatedAt).format('dddd, DD MMMM YYYY HH:mm')} WIB
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </Card>
            </div>

            {component.qualities && (
                <div className="grid grid-cols-3 gap-5 mt-8">
                    {component.qualities.map((quality) => (
                        <Card key={quality.id}>
                            <div className="flex items-center justify-end gap-2 mb-3 flex-wrap">
                                <DetailQualityModal quality={quality} />
                                <button
                                    type="button"
                                    className="flex items-center justify-center gap-1 bg-red-300 text-red-700 text-sm font-semibold px-4 py-2 rounded-lg"
                                    onClick={() => handleDeletedQuality(quality.id)}
                                >
                                    Hapus
                                </button>
                            </div>
                            <table className="table w-full text-sky-800">
                                <tbody>
                                    <tr className="text-sm">
                                        <th className="bg-sky-400 rounded-tl-lg text-start px-3 py-2 font-medium text-slate-100">Kualitas</th>
                                        <td className="bg-sky-300 rounded-tr-lg text-start px-3 py-2">{quality.name}</td>
                                    </tr>
                                    <tr className="text-sm border border-b-sky-100">
                                        <th
                                            className={`bg-sky-400 text-start px-3 py-2 font-medium text-slate-100 ${
                                                !quality.price && 'rounded-bl-lg'
                                            }`}
                                        >
                                            Status
                                        </th>
                                        <td className={`bg-sky-300 text-start px-3 py-2 ${!quality.price && 'rounded-br-lg'}`}>{quality.flag}</td>
                                    </tr>

                                    {quality.price && quality.cogs && (
                                        <>
                                            <tr className="text-sm border border-b-sky-100">
                                                <th className="bg-sky-400 text-start px-3 py-2 font-medium text-slate-100">Harga Modal</th>
                                                <td className="bg-sky-300 text-start px-3 py-2">
                                                    {quality.cogs && formatCurrency.format(Number(quality.cogs))}
                                                </td>
                                            </tr>
                                            <tr className="text-sm border border-b-sky-100">
                                                <th className="bg-sky-400 text-start px-3 py-2 font-medium text-slate-100">Harga Jual</th>
                                                <td className="bg-sky-300 text-start px-3 py-2">
                                                    {quality.price && formatCurrency.format(Number(quality.price))}
                                                </td>
                                            </tr>
                                            <tr className="text-sm border border-b-sky-100">
                                                <th className="bg-sky-400 text-start px-3 py-2 rounded-bl-lg font-medium text-slate-100">
                                                    Keuntungan
                                                </th>
                                                <td className="bg-sky-300 text-start px-3 py-2 rounded-br-lg">
                                                    {quality.price && formatCurrency.format(Number(quality.price) - Number(quality.cogs))}
                                                </td>
                                            </tr>
                                        </>
                                    )}

                                    {quality.qualitiesSize?.length !== 0 && (
                                        <tr className="text-sm border border-b-sky-100">
                                            <th className="bg-sky-400 text-start px-3 py-2 font-medium text-slate-100 rounded-l-lg">Ukuran</th>
                                            <td className="bg-sky-300 text-start px-3 py-2 rounded-r-lg">
                                                <ul>
                                                    {quality.qualitiesSize?.map((size, index) => (
                                                        <li key={index} className="flex items-center justify-between text-sm mb-1">
                                                            <span>{size.sizes.name}</span>
                                                            <span>{formatCurrency.format(Number(size.price))}</span>
                                                            <div className="flex items-center justify-end gap-2">
                                                                <ProgressivePricingModal
                                                                    index={index}
                                                                    quality={quality.name}
                                                                    size={size.sizes.name}
                                                                    entityId={size.id}
                                                                    entityType="qualitySize"
                                                                    fetchComponent={fetchDetailComponent}
                                                                />
                                                                <button
                                                                    className="text-pink-800"
                                                                    type="button"
                                                                    onClick={() => handleDeletedQualtySize(size.id)}
                                                                >
                                                                    <IconTrash size={14} stroke={2} />
                                                                </button>
                                                            </div>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </td>
                                        </tr>
                                    )}

                                    <tr className="text-sm">
                                        <ComponentAddSizesModal qualityId={quality.id} quality={quality} fetchComponent={fetchDetailComponent} />
                                    </tr>
                                </tbody>
                            </table>
                        </Card>
                    ))}

                    <Card>
                        <AddQualtiesModal componentId={componentId} fetchComponent={fetchDetailComponent} />
                    </Card>
                </div>
            )}
        </>
    );
}
