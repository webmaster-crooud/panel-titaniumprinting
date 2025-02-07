import Link from 'next/link';
import { Card } from '@/components/Card';
import { IconAdjustmentsCog, IconCalendar, IconEye, IconLoader3, IconNumber, IconPlus, IconSettings2, IconTrash } from '@tabler/icons-react';
import { useCallback, useEffect, useState } from 'react';
import { useAuthToken } from '../../../hooks/useAuthToken';
import { useSetAtom } from 'jotai';
import { alertShow } from '../../../store/Atom';
import { fetchWithAuth } from '../../../lib/fetchWithAuth';
import { BACKEND, formatMoment } from '../../../lib/utils';
import { Loader } from '@/components/Loader';
import { SizeCreateModal } from '@/components/Modal/SizeCreate.modal';
import { SizeUpdateModal } from '@/components/Modal/SizeUpdate.modal';

interface Components {
    id: number | null;
    name: string;
    typeComponent: string;
    flag: string;
    createdAt: Date | string;
    updatedAt: Date | string;
}

interface Sizes {
    id: number | null;
    name: string;
}

export default function ComponentListPage() {
    const [loading, setLoading] = useState<{ field: string } | undefined>(undefined);
    const { token, refreshToken } = useAuthToken();
    const setAlert = useSetAtom(alertShow);
    const [sizeCreateModal, setSizeCreateModal] = useState<boolean>(false);
    const [components, setComponents] = useState<Components[]>([]);
    const [sizes, setSize] = useState<Sizes[] | undefined>(undefined);

    const fetchSize = useCallback(async () => {
        try {
            setLoading({ field: 'size' });
            await new Promise((resolve) => setTimeout(resolve, 1000));
            const response = await fetchWithAuth(token, refreshToken, `${BACKEND}/sizes`);
            const { data } = await response.json();
            if (data) {
                setSize(data);
            } else {
                setAlert({ type: 'error', message: 'Gagal mengambil data ukuran' });
            }
        } catch (error) {
            setAlert({ type: 'error', message: `${error}` });
        } finally {
            setLoading(undefined);
        }
    }, [refreshToken, token, setAlert]);
    const fetchComponents = useCallback(async () => {
        setLoading({ field: 'component' });
        try {
            const response = await fetchWithAuth(token, refreshToken, `${BACKEND}/components`);
            const result = await response.json();
            if (result.error) {
                setAlert({ type: 'warning', message: result.message });
            } else {
                setComponents(result.data);
            }
        } catch (error) {
            setAlert({ type: 'error', message: `${error}` });
        } finally {
            setLoading(undefined);
        }
    }, [refreshToken, token, setAlert]);
    useEffect(() => {
        fetchComponents();
        fetchSize();
    }, [fetchComponents, fetchSize]);

    const handlerDeletedComponent = async (id: number) => {
        setLoading({ field: 'component' });

        try {
            if (components.length === 1) {
                setAlert({ type: 'warning', message: 'Data Tidak Boleh Kurang Dari 1' });
            } else {
                const response = await fetchWithAuth(token, refreshToken, `${BACKEND}/components/${id}`, {
                    method: 'DELETE',
                });
                const result = await response.json();
                if (result.error) {
                    setAlert({ type: 'error', message: `${result.message}` });
                } else {
                    setAlert({ type: 'success', message: `${result.message}` });
                    fetchComponents();
                }
            }
        } catch (error) {
            setAlert({ type: 'error', message: `${error}` });
        } finally {
            setLoading(undefined);
        }
    };

    if (loading?.field === 'component') {
        return <Loader />;
    }
    return (
        <div className={`mt-8 grid grid-cols-5 items-start justify-center gap-5`}>
            <Card className={`w-full col-span-4`}>
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-slate-900">List Komponen</h1>
                    <Link
                        href={'/components/create'}
                        className="px-4 py-2 text-sm font-semibold text-slate-100 bg-blue-500 rounded-lg flex items-center justify-center gap-1"
                    >
                        <IconPlus size={16} stroke={2} /> <span>Komponen</span>
                    </Link>
                </div>

                <table className="mt-5 table w-full table-bordered">
                    <thead>
                        <tr className="text-sm bg-blue-300 text-blue-900">
                            <th className="text-center px-3 py-2">
                                <IconNumber size={18} stroke={2} />
                            </th>
                            <th className="text-start font-medium px-3 py-2">Komponen</th>
                            <th className="text-start font-medium px-3 py-2">Tipe</th>
                            <th className="text-center font-medium px-3 py-2">Status</th>
                            <th className="text-end font-medium px-3 py-2">
                                <div className="flex items-center justify-center">
                                    <IconSettings2 size={18} stroke={2} />
                                </div>
                            </th>
                            <th className="px-3">
                                <div className="flex items-center justify-end">
                                    <IconCalendar size={18} stroke={2} />
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {components.length === 0 && (
                            <tr className="text-sm border-b border-blue-500 text-blue-700">
                                <td className="text-center font-medium px-3 py-2" colSpan={6}>
                                    Komponen Masih Kosong
                                </td>
                            </tr>
                        )}
                        {components.map((component, index) => (
                            <tr key={index} className="text-sm border-b border-blue-500 text-blue-700">
                                <td className="text-center px-3 py-2" width={1}>
                                    {index + 1}
                                </td>
                                <td className="text-start font-medium px-3 py-2">{component.name}</td>
                                <td className="text-start font-medium px-3 py-2">{component.typeComponent}</td>
                                <td className="text-center font-medium px-3 py-2">
                                    {component.flag === 'ACTIVED' && (
                                        <span className="px-5 py-1.5 rounded-full bg-blue-800 text-blue-100 text-xs">Aktif</span>
                                    )}
                                </td>
                                <td className="font-medium px-3 py-2 flex items-center justify-center gap-2">
                                    <Link href={`/components/${component.id}`}>
                                        <IconEye stroke={2} size={18} className="text-blue-700" />
                                    </Link>

                                    <button
                                        type="button"
                                        className="mt-1.5"
                                        typeof="button"
                                        onClick={() => handlerDeletedComponent(Number(component.id))}
                                    >
                                        <IconTrash className="text-red-700" stroke={2} size={18} />
                                    </button>
                                </td>
                                <td className="text-end">{formatMoment(component.createdAt).format('DD MMMM YYYY')}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Card>
            <Card className="w-full">
                <div className="flex items-center justify-between">
                    <h1 className="font-bold text-slate-900">List Ukuran</h1>
                    <button
                        className="px-3 py-2 text-sm font-semibold text-slate-100 bg-blue-500 rounded-lg flex items-center justify-center"
                        type="button"
                        onClick={() => setSizeCreateModal(true)}
                    >
                        <IconPlus size={16} stroke={2} />
                    </button>
                </div>
                {loading?.field === 'size' ? (
                    <div className="flex items-center justify-center w-full h-40">
                        <IconLoader3 size={35} stroke={2.5} className="animate-spin" />
                    </div>
                ) : (
                    <table className="mt-5 table w-full table-bordered">
                        <thead>
                            <tr className="text-sm bg-blue-300 text-blue-900">
                                <th className="text-center px-3 py-2">
                                    <IconNumber size={18} stroke={2} />
                                </th>
                                <th className="text-start font-medium px-3 py-2">Ukuran</th>
                                <th className="text-end font-medium px-3 py-2">
                                    <div className="flex items-center justify-center">
                                        <IconSettings2 size={18} stroke={2} />
                                    </div>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {sizes?.length === 0 && (
                                <tr className="text-sm border-b border-blue-500 text-blue-700">
                                    <td className="text-center font-medium px-3 py-2" colSpan={3}>
                                        Ukuran masih kosong
                                    </td>
                                </tr>
                            )}
                            {sizes?.map((size, index) => (
                                <tr key={index} className="text-sm border-b border-blue-500 text-blue-700">
                                    <td className="text-center px-3 py-2" width={1}>
                                        {index + 1}
                                    </td>
                                    <td className="text-start font-medium px-3 py-2">{size.name}</td>
                                    <td className="font-medium px-3 py-2 flex items-center justify-center gap-2">
                                        <SizeUpdateModal fetchSize={fetchSize} sizeId={size.id} />

                                        <button type="button" className="mt-1.5">
                                            <IconTrash className="text-red-700" stroke={2} size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </Card>

            {sizeCreateModal && (
                <SizeCreateModal setModal={setSizeCreateModal} setAlert={setAlert} token={token} refreshToken={refreshToken} fetchSize={fetchSize} />
            )}
        </div>
    );
}
