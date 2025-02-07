import {
    IconCalendar,
    IconCloudUpload,
    IconEye,
    IconEyeOff,
    IconFolderOpen,
    IconLoader3,
    IconSettings,
    IconStar,
    IconStarFilled,
    IconTrash,
} from '@tabler/icons-react';
import Link from 'next/link';
import { Tooltip } from 'react-tippy';
import { BACKEND, formatMoment } from '../../../lib/utils';
import { Products } from '../../pages/products';
import React, { useState } from 'react';
import { useSetAtom } from 'jotai';
import { alertShow } from '../../../store/Atom';
import { useAuthToken } from '../../../hooks/useAuthToken';
import { fetchWithAuth } from '../../../lib/fetchWithAuth';

type propsProductsTable = {
    products: Products[];
    filteredProducts: Products[];
    fetchProducts: () => Promise<void>;
};

export const ProductsTable: React.FC<propsProductsTable> = ({ products, filteredProducts, fetchProducts }) => {
    const [loading, setLoading] = useState<{ func: string; idx?: number } | undefined>(undefined);
    const { token, refreshToken } = useAuthToken();
    const setAlert = useSetAtom(alertShow);
    const handlerChangeFlag = async (barcode: string, idx?: number) => {
        setLoading({ func: 'changeFlag', idx });
        try {
            await new Promise((resolve) => setTimeout(resolve, 2000));
            const response = await fetchWithAuth(token, refreshToken, `${BACKEND}/products/${barcode}`, {
                method: 'PATCH',
            });

            const result = await response.json();
            if (result.error === true) {
                setAlert({ type: 'error', message: result.message });
            } else {
                setAlert({ type: 'success', message: result.message });
                fetchProducts();
            }
        } catch (error) {
            setAlert({ type: 'error', message: `${error}` });
        } finally {
            setLoading(undefined);
        }
    };
    const handleFavouriteProducts = async (barcode: string, idx?: number) => {
        setLoading({ func: 'favourite', idx });
        try {
            await new Promise((resolve) => setTimeout(resolve, 2000));
            const response = await fetchWithAuth(token, refreshToken, `${BACKEND}/products/${barcode}/favourite`, {
                method: 'PATCH',
            });

            const result = await response.json();
            if (result.error === true) {
                setAlert({ type: 'error', message: result.message });
            } else {
                setAlert({ type: 'success', message: result.message });
                fetchProducts();
            }
        } catch (error) {
            setAlert({ type: 'error', message: `${error}` });
        } finally {
            setLoading(undefined);
        }
    };
    const handlerDeleteProducts = async (barcode: string, idx?: number) => {
        setLoading({ func: 'delete', idx });
        try {
            await new Promise((resolve) => setTimeout(resolve, 2000));
            const response = await fetchWithAuth(token, refreshToken, `${BACKEND}/products/${barcode}`, {
                method: 'DELETE',
            });

            const result = await response.json();
            if (result.error === true) {
                setAlert({ type: 'error', message: result.message });
            } else {
                setAlert({ type: 'success', message: result.message });
                fetchProducts();
            }
        } catch (error) {
            setAlert({ type: 'error', message: `${error}` });
        } finally {
            setLoading(undefined);
        }
    };

    return (
        <>
            <table className="w-full table-auto">
                <thead>
                    <tr className="text-sm bg-slate-600 text-slate-100">
                        <th></th>
                        <th className="px-3 py-1 text-start">Produk</th>
                        <th className="px-3 py-1 text-start">Kategori</th>
                        <th className="px-3 py-1 text-start">Status</th>
                        <th>
                            <div className="flex items-center justify-center">
                                <IconSettings size={17} stroke={2} />
                            </div>
                        </th>
                        <th className="px-3 py-1">
                            <div className="flex items-center justify-end">
                                <IconCalendar size={17} stroke={2} />
                            </div>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {products &&
                        filteredProducts.map((product, index) => (
                            <tr key={index} className="text-sm border-b border-slate-400">
                                <td className="text-center py-2 px-3">{index + 1}</td>
                                <td className="px-3">{product.name}</td>
                                <td className="px-3">
                                    {product.product_category?.map(({ categories }, index) => (
                                        <span key={index} className="me-2 px-3 py-1 text-xs bg-slate-300 text-slate-600 rounded-full font-medium">
                                            {categories.name}
                                        </span>
                                    ))}
                                </td>
                                <td className="px-3">
                                    <span
                                        className={`px-3 py-1 text-xs font-medium rounded-full ${
                                            product.flag === 'ACTIVED'
                                                ? 'bg-sky-300 text-sky-800'
                                                : product.flag === 'FAVOURITE'
                                                ? 'bg-yellow-300 text-yellow-800'
                                                : 'bg-red-300 text-red-800'
                                        }`}
                                    >
                                        {product.flag}
                                    </span>
                                </td>
                                <td>
                                    <div className="flex items-center justify-center gap-1">
                                        {product.flag === 'FAVOURITE' && (
                                            <>
                                                <button
                                                    type="button"
                                                    disabled={loading?.func === 'favourite'}
                                                    onClick={() => handleFavouriteProducts(product.barcode, index)}
                                                    className="text-yellow-500"
                                                >
                                                    {loading?.func === 'favourite' && loading.idx === index ? (
                                                        <IconLoader3 className="animate-spin" size={17} stroke={2} />
                                                    ) : (
                                                        <IconStarFilled size={17} stroke={2} />
                                                    )}
                                                </button>

                                                <button
                                                    onClick={() => handlerChangeFlag(product.barcode, index)}
                                                    disabled={loading?.func === 'changeFlag'}
                                                    className="text-red-500 mt-0.5"
                                                >
                                                    {loading?.func === 'changeFlag' && loading.idx === index ? (
                                                        <IconLoader3 size={17} stroke={2} className="animate-spin" />
                                                    ) : (
                                                        <IconEyeOff size={17} stroke={2} />
                                                    )}
                                                </button>

                                                <Link href={`/products/${product.barcode}`} className="text-sky-500 mt-1.5">
                                                    <IconFolderOpen size={17} stroke={2} />
                                                </Link>
                                            </>
                                        )}
                                        {product.flag === 'ACTIVED' && (
                                            <>
                                                <button
                                                    type="button"
                                                    disabled={loading?.func === 'favourite'}
                                                    onClick={() => handleFavouriteProducts(product.barcode, index)}
                                                    className="text-yellow-500 -mt-1"
                                                >
                                                    {loading?.func === 'favourite' && loading.idx === index ? (
                                                        <IconLoader3 className="animate-spin" size={17} stroke={2} />
                                                    ) : (
                                                        <IconStar size={17} stroke={2} />
                                                    )}
                                                </button>

                                                <button
                                                    onClick={() => handlerChangeFlag(product.barcode, index)}
                                                    disabled={loading?.func === 'changeFlag'}
                                                    className="text-red-500 mt-0.5"
                                                >
                                                    {loading?.func === 'changeFlag' && loading.idx === index ? (
                                                        <IconLoader3 size={17} stroke={2} className="animate-spin" />
                                                    ) : (
                                                        <IconEyeOff size={17} stroke={2} />
                                                    )}
                                                </button>

                                                <Link href={`/products/${product.barcode}`} className="text-sky-500 mt-1.5">
                                                    <IconFolderOpen size={17} stroke={2} />
                                                </Link>
                                            </>
                                        )}

                                        {product.flag === 'DISABLED' && (
                                            <>
                                                <button
                                                    onClick={() => handlerChangeFlag(product.barcode, index)}
                                                    disabled={loading?.func === 'changeFlag'}
                                                    className="text-sky-500 mt-0.5"
                                                >
                                                    {loading?.func === 'changeFlag' && loading.idx === index ? (
                                                        <IconLoader3 size={18} stroke={2} className="animate-spin" />
                                                    ) : (
                                                        <IconCloudUpload size={18} stroke={2} />
                                                    )}
                                                </button>

                                                <button
                                                    onClick={() => handlerDeleteProducts(product.barcode, index)}
                                                    disabled={loading?.func === 'delete'}
                                                    className="text-red-500 mt-0.5"
                                                >
                                                    {loading?.func === 'delete' && loading.idx === index ? (
                                                        <IconLoader3 size={17} stroke={2} className="animate-spin" />
                                                    ) : (
                                                        <IconTrash size={17} stroke={2} />
                                                    )}
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </td>
                                <td className="px-3">
                                    <div className="flex items-center justify-end text-xs font-medium">
                                        {formatMoment(product.createdAt).format('DD MMMM YYYY - HH.mm')} WIB
                                    </div>
                                </td>
                            </tr>
                        ))}
                </tbody>
            </table>
        </>
    );
};
