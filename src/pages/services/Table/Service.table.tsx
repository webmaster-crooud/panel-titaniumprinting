// components/CategoriesTable.tsx
import { IconActivity, IconEye, IconEyeEdit, IconLoader3, IconSearch, IconStar, IconStarFilled, IconTrash, IconX } from '@tabler/icons-react';
import React, { useEffect, useState } from 'react';
import 'react-tippy/dist/tippy.css';
import { Tooltip } from 'react-tippy';
import { Pagination } from '../../../components/Pagination';
import { DataService } from '..';

import { useRouter } from 'next/router';
import Link from 'next/link';
import { BACKEND } from '../../../../lib/utils';
import { useSetAtom } from 'jotai';
import { alertShow } from '../../../../store/Atom';

export const ServiceTable = ({ fetchService, services }: { fetchService: any; services: DataService[] }) => {
    const router = useRouter();
    const { pathname } = router;
    const [limit, setLimit] = useState<number>(5);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState('');
    const setAlert = useSetAtom(alertShow);
    const [loadingFav, setLoadingFav] = useState<{
        status: boolean;
        barcode: string | undefined;
    }>({
        status: false,
        barcode: undefined,
    });

    const [loadingDelete, setLoadingDelete] = useState<{
        status: boolean;
        barcode: string | undefined;
    }>({
        status: false,
        barcode: undefined,
    });

    // Fungsi untuk mencari data
    const filteredServices = services.filter((service) => service.name.toLowerCase().includes(search.toLowerCase()));
    // Logika pagination
    const indexOfLastData = currentPage * limit;
    const indexOfFirstData = indexOfLastData - limit;
    const currentData = filteredServices.slice(indexOfFirstData, indexOfLastData);
    // Handler untuk perubahan halaman
    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };
    // Handler untuk perubahan limit
    const handleLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setLimit(parseInt(e.target.value));
        setCurrentPage(1);
    };
    // Handler untuk pencarian
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        setCurrentPage(1); // Reset ke halaman pertama saat melakukan pencarian
    };

    useEffect(() => {
        fetchService();
    }, [fetchService]);

    const handlerFavourite = async (barcode: string) => {
        setLoadingFav({ barcode, status: true });
        try {
            await new Promise((resolve) => setTimeout(resolve, 1500));
            const response = await fetch(`${BACKEND}/services/${barcode}/favourite`, {
                method: 'PATCH',
            });

            const result = await response.json();
            if (result.error === true) {
                console.error(result.message);
            } else {
                fetchService();
            }
        } catch (error) {
            console.log('ERROR');
        } finally {
            setLoadingFav({ barcode: '', status: false });
        }
    };

    const handlerDeactived = async (barcode: string) => {
        setLoadingDelete({ barcode, status: true });
        try {
            await new Promise((resolve) => setTimeout(resolve, 1500));
            const response = await fetch(`${BACKEND}/services/${barcode}`, {
                method: 'PATCH',
            });

            const result = await response.json();
            if (result.error === true) {
                console.error(result.message);
            } else {
                fetchService();
            }
        } catch (error) {
            console.log('ERROR');
        } finally {
            setLoadingDelete({ barcode: '', status: false });
        }
    };

    const handlerDelete = async (barcode: string) => {
        setLoadingDelete({ barcode, status: true });
        try {
            await new Promise((resolve) => setTimeout(resolve, 1500));
            const response = await fetch(`${BACKEND}/services/${barcode}`, {
                method: 'DELETE',
            });

            const result = await response.json();
            if (result.error === true) {
                setAlert({ type: 'error', message: result.message });
            } else {
                fetchService();
                setAlert({ type: 'success', message: result.message });
            }
        } catch (error) {
            console.log('ERROR');
        } finally {
            setLoadingDelete({ barcode: '', status: false });
            if (services.length === 0) {
                router.push('/services');
            }
        }
    };

    return (
        <>
            <div className="flex items-center justify-between mt-5">
                <div className="flex items-center justify-start gap-2">
                    <select
                        value={limit}
                        className="bg-slate-100  px-3 py-1.5 rounded font-semibold focus:outline-none appearance-none"
                        onChange={handleLimitChange}
                    >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={15}>15</option>
                        <option value={20}>20</option>
                    </select>
                    <label htmlFor="limit-page" className=" font-medium">
                        Tampil {limit} Kategori
                    </label>
                </div>

                <div className="flex items-center justify-end">
                    <input
                        type="text"
                        value={search}
                        onChange={handleSearch}
                        placeholder="Cari kategori..."
                        className="bg-slate-100  px-3 py-1.5 rounded rounded-r-none font-semibold focus:outline-none w-full"
                    />
                    <button className="bg-slate-300 text-slate-600  px-3 py-1.5 rounded rounded-l-none font-semibold">
                        <IconSearch size={20} stroke={2.5} />
                    </button>
                </div>
            </div>

            <table className="w-full mt-5 table-auto">
                <thead>
                    <tr className="bg-slate-600 py-2">
                        <th></th>
                        <th className="text-slate-100  text-start py-2 px-3">Layanan</th>
                        <th className="text-slate-100 text-center py-2">
                            <div className="flex items-center justify-center">
                                <IconActivity size={15} />
                            </div>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {currentData.map((service, index) => (
                        <tr key={index} className="border-b border-slate-300">
                            <td className="py-3 text-center">
                                <span>{index + 1}</span>
                            </td>
                            <td className="text-slate-800  text-start py-2 px-3">{service.name}</td>
                            <td>
                                <div className="flex items-center justify-center gap-2">
                                    {pathname === '/services/disabled' ? null : loadingFav.status && loadingFav.barcode === service.barcode ? (
                                        <IconLoader3 size={16} stroke={2} className="animate-spin" />
                                    ) : (
                                        <Tooltip title="Favorit" position="top" trigger="mouseenter" arrow size="small">
                                            <button type="button">
                                                {service.flag === 'FAVOURITE' ? (
                                                    <IconStarFilled
                                                        onClick={() => handlerFavourite(service.barcode)}
                                                        size={16}
                                                        stroke={2}
                                                        className="text-yellow-500"
                                                    />
                                                ) : (
                                                    <IconStar
                                                        onClick={() => handlerFavourite(service.barcode)}
                                                        size={16}
                                                        stroke={2}
                                                        className="text-yellow-500"
                                                    />
                                                )}
                                            </button>
                                        </Tooltip>
                                    )}

                                    {loadingDelete.status && loadingDelete.barcode === service.barcode ? (
                                        <IconLoader3 size={16} stroke={2} className="animate-spin" />
                                    ) : pathname === '/services/disabled' ? (
                                        <Tooltip title="Aktif" position="top" trigger="mouseenter" arrow size="small">
                                            <button type="button">
                                                <IconEye
                                                    onClick={() => handlerDeactived(service.barcode)}
                                                    size={18}
                                                    stroke={2}
                                                    className="text-blue-600"
                                                />
                                            </button>
                                        </Tooltip>
                                    ) : (
                                        <Tooltip title="Hapus" position="top" trigger="mouseenter" arrow size="small">
                                            <button type="button">
                                                <IconTrash
                                                    onClick={() => handlerDeactived(service.barcode)}
                                                    size={16}
                                                    stroke={2}
                                                    className="text-red-600"
                                                />
                                            </button>
                                        </Tooltip>
                                    )}

                                    {pathname === '/services/disabled' ? (
                                        loadingDelete.status && loadingDelete.barcode === service.barcode ? (
                                            <IconLoader3 size={16} stroke={2} className="animate-spin" />
                                        ) : (
                                            <Tooltip title="Hapus" position="top" trigger="mouseenter" arrow size="small">
                                                <button type="button">
                                                    <IconTrash
                                                        onClick={() => handlerDelete(service.barcode)}
                                                        size={16}
                                                        stroke={2}
                                                        className="text-red-600"
                                                    />
                                                </button>
                                            </Tooltip>
                                        )
                                    ) : (
                                        <Tooltip title="Perbarui" position="top" trigger="mouseenter" arrow size="small">
                                            <Link href={`/services/update/${service.barcode}`} type="button">
                                                <IconEyeEdit size={18} stroke={2} className="text-cyan-600" />
                                            </Link>
                                        </Tooltip>
                                    )}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Tampilkan pagination hanya jika ada data dan tidak sedang loading */}
            {currentData.length > 0 && (
                <Pagination currentPage={currentPage} totalItems={filteredServices.length} itemsPerPage={limit} onPageChange={handlePageChange} />
            )}
        </>
    );
};
