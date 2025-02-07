import React, { useState } from 'react';
import { Component } from '../../pages/components/_temp';
import { Card } from '@/components/Card';
import { IconCloudUpload, IconTransform, IconLoader3, IconSettings, IconTrash } from '@tabler/icons-react';
import { Tooltip } from 'react-tippy';
import { useRouter } from 'next/router';
import { BACKEND } from '../../../lib/utils';
import { useSetAtom } from 'jotai';
import { alertShow } from '../../../store/Atom';

type propsComponentsTable = {
    components: Component[];
    type: string;
    fetchComponents: () => Promise<Component | void>;
};

const ComponentsTable: React.FC<propsComponentsTable> = ({ components, type, fetchComponents }) => {
    const router = useRouter();
    const [loading, setLoading] = useState<{ func: string; status: boolean; id?: string | number | undefined } | undefined>(undefined);
    const setAlert = useSetAtom(alertShow);

    const handlerChangeStatus = async (id: number | string | undefined) => {
        setLoading({ func: 'changeStatus', status: true, id: id });

        try {
            await new Promise((resolve) => setTimeout(resolve, 2000));
            const response = await fetch(`${BACKEND}/components/${id}`, {
                method: 'PATCH',
            });
            const result = await response.json();
            if (result.error === true) {
                setAlert({ type: 'error', message: result.message });
            }
            setAlert({ type: 'success', message: result.message });
            fetchComponents();
        } catch (error) {
            setAlert({ type: 'error', message: `${error}` });
        } finally {
            setLoading(undefined);
        }
    };

    const handlerDeleteComponent = async (id: number | string | undefined) => {
        setLoading({ func: 'delete', status: true, id: id });

        try {
            await new Promise((resolve) => setTimeout(resolve, 2000));
            const response = await fetch(`${BACKEND}/components/${id}`, {
                method: 'DELETE',
            });
            const result = await response.json();
            if (result.error === true) {
                setAlert({ type: 'error', message: result.message });
            }
            setAlert({ type: 'success', message: result.message });
            fetchComponents();
        } catch (error) {
            setAlert({ type: 'error', message: `${error}` });
        } finally {
            setLoading(undefined);
        }
    };

    return (
        <>
            <Card className={`rounded-tl-none`}>
                <h2 className="font-semibold  mb-3">Komponen {type}</h2>
                <table className="w-full table-auto">
                    <thead className="bg-slate-700 text-slate-100 text-sm">
                        <tr>
                            <th className="py-1 text-start ps-2">Komponen</th>
                            <th className="py-1 text-center">Status</th>
                            <th className="py-1 text-center">
                                <div className="flex items-center justify-center">
                                    <IconSettings size={18} />
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {components?.map(
                            (data, index) =>
                                data.typeComponent === type?.toUpperCase() && (
                                    <tr key={index} className="text-sm border-b border-slate-400">
                                        <td className="py-2 ps-2">{data.name}</td>
                                        <td className="text-center text-xs">
                                            <div
                                                className={`py-1 rounded-lg ${
                                                    data.flag === 'ACTIVED'
                                                        ? 'bg-sky-300 text-sky-900'
                                                        : data.flag === 'FAVORITE'
                                                        ? 'bg-violet-300 text-violet-900'
                                                        : 'bg-red-300 text-red-900'
                                                }  font-semibold`}
                                            >
                                                {data.flag}
                                            </div>
                                        </td>
                                        <td>
                                            <div className="flex items-center justify-center gap-2">
                                                {data.flag === 'ACTIVED' && (
                                                    <>
                                                        <button onClick={() => router.push(`/components/update/${data.id}`)}>
                                                            <IconTransform size={18} stroke={2} className="text-sky-600" />
                                                        </button>

                                                        <button
                                                            disabled={loading?.func === 'changeStatus' && loading?.status}
                                                            type="button"
                                                            onClick={() => handlerChangeStatus(data.id)}
                                                        >
                                                            {loading?.func === 'changeStatus' && loading?.id === data.id ? (
                                                                <IconLoader3 size={17} stroke={2} className="text-sky-600 animate-spin" />
                                                            ) : (
                                                                <IconTrash size={17} stroke={2} className="text-red-600" />
                                                            )}
                                                        </button>
                                                    </>
                                                )}
                                                {data.flag === 'FAVORITE' && (
                                                    <>
                                                        <button onClick={() => router.push(`/components/update/${data.id}`)}>
                                                            <IconTransform size={18} stroke={2} className="text-sky-600" />
                                                        </button>

                                                        <button
                                                            disabled={loading?.func === 'changeStatus' && loading?.status}
                                                            type="button"
                                                            onClick={() => handlerChangeStatus(data.id)}
                                                        >
                                                            {loading?.func === 'changeStatus' && loading?.id === data.id ? (
                                                                <IconLoader3 size={17} stroke={2} className="text-sky-600 animate-spin" />
                                                            ) : (
                                                                <IconTrash size={17} stroke={2} className="text-red-600" />
                                                            )}
                                                        </button>
                                                    </>
                                                )}
                                                {data.flag === 'DISABLED' && (
                                                    <>
                                                        <button
                                                            type="button"
                                                            disabled={loading?.func === 'changeStatus' && loading?.status}
                                                            onClick={() => handlerChangeStatus(data.id)}
                                                        >
                                                            {loading?.func === 'changeStatus' && loading?.id === data.id ? (
                                                                <IconLoader3 size={17} stroke={2} className="text-sky-600 animate-spin" />
                                                            ) : (
                                                                <IconCloudUpload size={18} stroke={2} className="text-sky-600" />
                                                            )}
                                                        </button>

                                                        <button disabled={loading?.func === 'delete'} onClick={() => handlerDeleteComponent(data.id)}>
                                                            {loading?.func === 'delete' && loading?.id === data.id ? (
                                                                <IconLoader3 size={17} stroke={2} className="text-sky-600 animate-spin" />
                                                            ) : (
                                                                <IconTrash size={17} stroke={2} className="text-red-600" />
                                                            )}
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ),
                        )}
                    </tbody>
                </table>
            </Card>
        </>
    );
};

export default ComponentsTable;
