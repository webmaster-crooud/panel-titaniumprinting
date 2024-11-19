import { InformationCard } from '@/components/Card/Information.card';
import { IconBox, IconBrandCashapp, IconFileInfo, IconListCheck, IconPlus, IconStar, IconUsersGroup } from '@tabler/icons-react';
import Link from 'next/link';
import { formatCurrency } from '../../lib/utils';
import { ListCard } from '@/components/Card/List.card';

export default function Home() {
    return (
        <>
            <div className="grid grid-cols-4 gap-8 py-10 w-full">
                <InformationCard
                    url="/users"
                    title="Pengguna"
                    button={
                        <Link
                            href={'/users'}
                            className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 border-2 border-slate-900"
                        >
                            <IconPlus size={20} stroke={3} />
                        </Link>
                    }
                    content={221}
                    icon={<IconUsersGroup size={40} stroke={2} className="text-slate-700" />}
                />
                <InformationCard
                    url="/products"
                    title="Produk"
                    button={
                        <Link href={'/'} className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 border-2 border-slate-900">
                            <IconPlus size={20} stroke={3} />
                        </Link>
                    }
                    content={20}
                    icon={<IconBox size={40} stroke={1.5} className="text-red-500" />}
                />
                <InformationCard
                    url="/transaction"
                    title="Pendapatan"
                    button={
                        <Link href={'/'} className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 border-2 border-slate-900">
                            <IconFileInfo size={20} stroke={2} />
                        </Link>
                    }
                    content={formatCurrency.format(200000000)}
                    icon={<IconBrandCashapp size={40} stroke={1.5} className="text-cyan-500" />}
                    className="col-span-2"
                />
                <ListCard
                    title={
                        <>
                            <span>Produk Terbaik</span> <IconStar size={20} />
                        </>
                    }
                    url="/"
                >
                    <table className="w-full rounded-xl rounded-b-none overflow-hidden">
                        <thead>
                            <tr className="w-full bg-slate-200 text-slate-500 text-xs border-2 border-slate-200">
                                <th></th>
                                <th className="font-medium uppercase py-1 px-3 text-start text-blue-400">Produk</th>
                                <th className="font-medium uppercase py-1 px-3 text-start">Penjualan</th>
                                <th className="font-medium uppercase py-1 px-3 text-start">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-2 border-b-2 border-slate-200">
                                <td className="py-2 px-3 text-sm text-slate-600" width={'1px'}>
                                    1
                                </td>
                                <td className="py-2 px-3 text-sm text-slate-600">Produk Judul One</td>
                                <td className="py-2 px-3 text-sm text-slate-600">300</td>
                                <td className="py-2 px-3 text-sm text-slate-600">ACTIVED</td>
                            </tr>
                            <tr className="border-2 border-b-2 border-slate-200">
                                <td className="py-2 px-3 text-sm text-slate-600" width={'1px'}>
                                    1
                                </td>
                                <td className="py-2 px-3 text-sm text-slate-600">Produk Judul One</td>
                                <td className="py-2 px-3 text-sm text-slate-600">300</td>
                                <td className="py-2 px-3 text-sm text-slate-600">ACTIVED</td>
                            </tr>
                        </tbody>
                    </table>
                </ListCard>
                <ListCard
                    title={
                        <>
                            <span>List Proses Penjualan</span> <IconListCheck size={20} />
                        </>
                    }
                    url="/"
                >
                    <table className="w-full rounded-xl rounded-b-none overflow-hidden">
                        <thead>
                            <tr className="w-full bg-slate-200 text-slate-500 text-xs border-2 border-slate-200">
                                <th></th>
                                <th className="font-medium uppercase py-1 px-3 text-start text-blue-400">Produk</th>
                                <th className="font-medium uppercase py-1 px-3 text-start">Penjualan</th>
                                <th className="font-medium uppercase py-1 px-3 text-start">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-2 border-b-2 border-slate-200">
                                <td className="py-2 px-3 text-sm text-slate-600" width={'1px'}>
                                    1
                                </td>
                                <td className="py-2 px-3 text-sm text-slate-600">Produk Judul One</td>
                                <td className="py-2 px-3 text-sm text-slate-600">300</td>
                                <td className="py-2 px-3 text-sm text-slate-600">ACTIVED</td>
                            </tr>
                            <tr className="border-2 border-b-2 border-slate-200">
                                <td className="py-2 px-3 text-sm text-slate-600" width={'1px'}>
                                    1
                                </td>
                                <td className="py-2 px-3 text-sm text-slate-600">Produk Judul One</td>
                                <td className="py-2 px-3 text-sm text-slate-600">300</td>
                                <td className="py-2 px-3 text-sm text-slate-600">ACTIVED</td>
                            </tr>
                        </tbody>
                    </table>
                </ListCard>
            </div>
        </>
    );
}
