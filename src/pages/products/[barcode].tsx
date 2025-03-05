import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useState } from 'react';
import { BACKEND } from '../../../lib/utils';
import { IconArrowBack, IconEdit, IconLoader3 } from '@tabler/icons-react';
import { Card } from '@/components/Card';
import { DetailProductTable } from '../../components/Table/Detail.table';
import { ComponentProductTable } from '../../components/Table/Component.table';
import Link from 'next/link';
import CoverImageProduct from '../../components/Section/Cover.images';
import ImageProduct from '../../components/Section';
import { useAuthToken } from '../../../hooks/useAuthToken';
import { fetchWithAuth } from '../../../lib/fetchWithAuth';
import { useSetAtom } from 'jotai';
import { alertShow } from '../../../store/Atom';

export interface DetailProducts {
    name: string;
    slug: string;
    cover?: string;
    description: string;
    flag: string;
    createdAt: Date;
    updatedAt: Date;
    images: {
        id: number;
        name: string;
        source: string;
    }[];
    product_category: {
        categories: {
            id: string | number;
            name: string;
        };
    }[];
    product_component: {
        minQty: string;
        typePieces: string;
        component: {
            id: string | number;
            name: string;
            price: number;
            cogs: number;
            canIncrise: boolean;
            typeComponent: string;
        };
    }[];
    service_product: {
        services: {
            barcode: string;
            name: string;
        };
    }[];
    coverFile: File | string;
    iamgesFile: {
        name: string;
        source: string | File;
    }[];
}
interface Components {
    id: number | null;
    name: string;
    typeComponent: string;
    flag: string;
    createdAt: Date | string;
    updatedAt: Date | string;
}

export default function DetailProductPage() {
    const router = useRouter();
    const { barcode } = router.query;
    const [product, setProduct] = useState<DetailProducts | undefined>(undefined);
    const [loading, setLoading] = useState(false);
    const [modal, setModal] = useState<string>('');
    const [component, setComponent] = useState<Components[]>([]);
    const [dataComponent, setDataComponent] = useState<string>('');
    const setAlert = useSetAtom(alertShow);
    const { token, refreshToken } = useAuthToken();
    const fetchProduct = useCallback(async () => {
        setLoading(true);
        try {
            const response = await fetchWithAuth(token, refreshToken, `${BACKEND}/products/${barcode}`);
            const result = await response.json();

            setProduct(result.data);
        } catch (error) {
            console.log('ERROR');
        } finally {
            setLoading(false);
        }
    }, [barcode, token, refreshToken]);
    useEffect(() => {
        fetchProduct();
    }, [fetchProduct]);

    const fetchComponents = useCallback(async () => {
        try {
            const response = await fetchWithAuth(token, refreshToken, `${BACKEND}/components`);
            const result = await response.json();
            if (result.error) {
                setAlert({ type: 'warning', message: result.message });
            } else {
                setComponent(result.data);
            }
        } catch (error) {
            setAlert({ type: 'error', message: `${error}` });
        }
    }, [refreshToken, setAlert, token]);
    useEffect(() => {
        fetchComponents();
    }, [fetchComponents]);
    return (
        <section className="relative py-8">
            {loading ? (
                <div className="w-full h-screen fixed top-0 right-0 left-0 bg-black/10 backdrop-blur-sm">
                    <div className="flex items-center justify-center h-full min-w-full">
                        <IconLoader3 size={30} stroke={2} className="animate-spin" /> <span>Loading...</span>
                    </div>
                </div>
            ) : (
                <>
                    <div className="flex items-center justify-between mb-6">
                        <h1 className="font-semibold text-xl">{product?.name}</h1>
                        <div className="flex items-center justify-end gap-5">
                            <Link
                                href={'/products'}
                                className="px-4 py-2 text-sm rounded-lg bg-red-500 text-slate-100 font-semibold flex items-center justify-center gap-1"
                            >
                                <IconArrowBack size={18} stroke={2} /> <span>Kembali</span>
                            </Link>
                            <button className="px-4 py-2 text-sm rounded-lg bg-blue-500 text-slate-100 font-semibold">
                                <div className="flex items-center justify-center gap-1">
                                    <IconEdit size={18} stroke={2} /> <span>Edit</span>
                                </div>
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-5">
                        <Card className="col-span-2">
                            <DetailProductTable fetchProduct={fetchProduct} product={product} barcode={`${barcode}`} />
                        </Card>

                        <div>
                            <CoverImageProduct product={product} barcode={`${barcode}`} fetchProduct={fetchProduct} />
                        </div>
                    </div>
                    <div className="grid grid-cols-4 mt-8 gap-5">
                        <ImageProduct barcode={`${barcode}`} fetchProduct={fetchProduct} product={product} />
                    </div>
                    <div className="grid grid-cols-4 mt-8 gap-5">
                        <button onClick={() => setModal('component')} className="px-5 py-2 rounded-lg font-semibold bg-blue-500 text-white">
                            Add Component
                        </button>
                        <ComponentProductTable product={product} barcode={`${barcode}`} />
                    </div>

                    {modal === 'component' && (
                        <div className="absolute top-1/2 left-0 right-0 w-6/12">
                            <div className="bg-slate-100 p-5 rounded-lg shadow-lg">
                                <h1>Tambah Komponent</h1>
                                <form>
                                    <select
                                        value={dataComponent}
                                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setDataComponent(e.target.value)}
                                    >
                                        {component.map((data, i) => (
                                            <option value={data.id || ''} key={i}>
                                                {data.name}
                                            </option>
                                        ))}
                                    </select>
                                    <button>Save</button>
                                </form>
                            </div>
                        </div>
                    )}
                </>
            )}
        </section>
    );
}
