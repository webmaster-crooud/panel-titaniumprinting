import { IconCalendar, IconEye, IconSettings, IconTrash } from '@tabler/icons-react';
import Link from 'next/link';
import { Tooltip } from 'react-tippy';
import { formatDateTIme } from '../../../../lib/utils';
import { Products } from '..';
import React from 'react';

type propsProductsTable = {
    products: Products[];
    filteredProducts: Products[];
};

export const ProductsTable: React.FC<propsProductsTable> = ({ products, filteredProducts }) => {
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
                                            product.flag === 'ACTIVED' ? 'bg-sky-300 text-sky-800' : 'bg-red-300 text-red-800'
                                        }`}
                                    >
                                        {product.flag}
                                    </span>
                                </td>
                                <td>
                                    <div className="flex items-center justify-center gap-1">
                                        <Tooltip title="Detail" size="small" position="left">
                                            <Link href={'/'} className="text-sky-500 mt-1.5">
                                                <IconEye size={18} stroke={2} />
                                            </Link>
                                        </Tooltip>

                                        <Tooltip title="Hapus" size="small" position="left">
                                            <button className="text-red-500 mt-0.5">
                                                <IconTrash size={17} stroke={2} />
                                            </button>
                                        </Tooltip>
                                    </div>
                                </td>
                                <td className="px-3">
                                    <div className="flex items-center justify-end text-xs">{formatDateTIme(product.createdAt)}</div>
                                </td>
                            </tr>
                        ))}
                </tbody>
            </table>
        </>
    );
};
