import React from 'react';
import { DetailProducts } from '../../pages/products/[barcode]';

import { formatDateTIme } from '../../../lib/utils';
import { ProductUpdateModal } from '../Modal/ProductUpdate.modal';
import { ServicesCreateProductModal, ServicesDeletedProductModal, ServicesUpdateProductModal } from '../Modal/Services.modal';
import { CategoriesCreateProductModal, CategoriesDeletedProductModal, CategoriesUpdateProductModal } from '../Modal/Categories.modal';

type propsDetailProductTable = {
    product?: DetailProducts;
    barcode: string;
    fetchProduct: () => Promise<void>;
};

export const DetailProductTable: React.FC<propsDetailProductTable> = ({ product, barcode, fetchProduct }) => {
    return (
        <div>
            <table className="w-full table-auto">
                <thead className="w-full text-sm bg-slate-500 text-white">
                    <tr>
                        <th className="py-1 px-3 text-start">Data</th>
                        <th className="py-1 px-3 text-start">Keterangan</th>
                    </tr>
                </thead>
                <tbody className="w-full text-sm">
                    <tr className="border-b border-slate-500">
                        <td className="px-3 py-2 font-semibold">Barcode Produk</td>
                        <td className="px-3 py-2">
                            <div className="flex items-center justify-between">
                                <span>{barcode}</span>
                                <ProductUpdateModal product={product} fetchProduct={fetchProduct} barcode={barcode} />
                            </div>
                        </td>
                    </tr>
                    <tr className="border-b border-slate-500">
                        <td className="px-3 py-2 font-semibold">Nama Produk</td>
                        <td className="px-3 py-2">{product?.name}</td>
                    </tr>
                    <tr className="border-b border-slate-500">
                        <td className="px-3 py-2 font-semibold">Slug Produk</td>
                        <td className="px-3 py-2">{product?.slug}</td>
                    </tr>
                    <tr className="border-b border-slate-500">
                        <td className="px-3 py-2 font-semibold">Deskripsi Produk</td>
                        <td className="px-3 py-2">{product?.description}</td>
                    </tr>
                    <tr className="border-b border-slate-500">
                        <td className="px-3 py-2 font-semibold">Kategori Produk</td>
                        <td className="px-3 py-2">
                            <ul className="flex-col flex flex-1 gap-1">
                                {product?.product_category.map(({ categories }, index) => (
                                    <li key={index} className={'flex items-center justify-between'}>
                                        <span className="px-3 py-1 rounded-full bg-slate-300">{categories.name}</span>
                                        <div className="flex items-center justify-center gap-2">
                                            <CategoriesUpdateProductModal barcode={barcode} categoryId={categories.id} fetchProduct={fetchProduct} />
                                            <CategoriesDeletedProductModal barcode={barcode} categoryId={categories.id} fetchProduct={fetchProduct} />
                                        </div>
                                    </li>
                                ))}
                            </ul>
                            <CategoriesCreateProductModal fetchProduct={fetchProduct} barcode={barcode} />
                        </td>
                    </tr>
                    <tr className="border-b border-slate-500">
                        <td className="px-3 py-2 font-semibold">Status Produk</td>
                        <td className="px-3 py-2">
                            {product?.flag === 'ACTIVED' ? (
                                <span className="px-4 py-1 uppercase font-semibold text-sm bg-sky-300 text-sky-800 rounded-full">Aktif</span>
                            ) : (
                                <span className="px-4 py-1 uppercase font-semibold text-sm bg-orange-300 text-orage-800 rounded-full">Favorit</span>
                            )}
                        </td>
                    </tr>
                    <tr className="border-b border-slate-500">
                        <td className="px-3 py-2 font-semibold">Tanggal</td>
                        <td className="px-3 py-2">
                            <ul>
                                <li className="flex items-center justify-between">
                                    <span>Terpublikasi:</span> {formatDateTIme(product ? product.createdAt : new Date())}
                                </li>
                                {product?.createdAt !== product?.updatedAt && (
                                    <li className="flex items-center justify-between">
                                        <span>Pembaharuan:</span> {formatDateTIme(product ? product.updatedAt : new Date())}
                                    </li>
                                )}
                            </ul>
                        </td>
                    </tr>
                    <tr className="border-b border-slate-500">
                        <td className="px-3 py-2 font-semibold">Layanan Produk</td>
                        <td className="px-3 py-2">
                            <ul className="flex-col flex flex-1 gap-1">
                                {product?.service_product.map(({ services }, index) => (
                                    <li key={index} className={'flex items-center justify-between'}>
                                        <span className="px-3 py-1 rounded-full bg-slate-300">{services.name}</span>
                                        <div className="flex items-center justify-center gap-2">
                                            <ServicesUpdateProductModal
                                                barcode={barcode}
                                                barcodeService={services.barcode}
                                                fetchProduct={fetchProduct}
                                            />
                                            <ServicesDeletedProductModal
                                                barcode={barcode}
                                                barcodeService={services.barcode}
                                                fetchProduct={fetchProduct}
                                            />
                                        </div>
                                    </li>
                                ))}
                            </ul>
                            <ServicesCreateProductModal fetchProduct={fetchProduct} barcode={barcode} />
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};
