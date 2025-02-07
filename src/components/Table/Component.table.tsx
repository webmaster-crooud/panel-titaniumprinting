import React from 'react';
import { DetailProducts } from '../../pages/products/[barcode]';
import { Card } from '@/components/Card';

import { IconFolderOpen, IconTransform, IconTrash } from '@tabler/icons-react';
import { useRouter } from 'next/router';

type propsComponentProductTable = {
    product?: DetailProducts;
    barcode: string;
};

export const ComponentProductTable: React.FC<propsComponentProductTable> = ({ product, barcode }) => {
    const router = useRouter();
    return product?.product_component.map((data, index) => (
        <Card key={index}>
            <div className="flex items-center justify-end mb-5 gap-3">
                <button className="text-sky-500">
                    <IconTransform size={18} stroke={2} />
                </button>

                <button className="text-red-500">
                    <IconTrash size={18} stroke={2} />
                </button>

                <button type="button" onClick={() => router.push(`/components/${data.component.id}`)} className="text-cyan-500">
                    <IconFolderOpen size={18} stroke={2} />
                </button>
            </div>
            <table className="w-full table-auto">
                <thead className="w-full text-sm bg-slate-500 text-white">
                    <tr>
                        <th className="py-1 px-3 text-start">Data</th>
                        <th className="py-1 px-3 text-start">Keterangan</th>
                    </tr>
                </thead>
                <tbody className="w-full text-sm">
                    <tr className="border-b border-slate-500">
                        <td className="px-3 py-2 font-semibold">Min. Komponen</td>
                        <td className="px-3 py-2">{`${data.minQty}`}</td>
                    </tr>
                    <tr className="border-b border-slate-500">
                        <td className="px-3 py-2 font-semibold">Komponen</td>
                        <td className="px-3 py-2">{`${data.component.name}`}</td>
                    </tr>
                    <tr className="border-b border-slate-500">
                        <td className="px-3 py-2 font-semibold">Tipe Komponen</td>
                        <td className="px-3 py-2">{`${data.component.typeComponent}`}</td>
                    </tr>
                </tbody>
            </table>
        </Card>
    ));
};
