import React, { useCallback, useEffect, useState } from 'react';
import { BACKEND } from '../../../lib/utils';
import { useSetAtom } from 'jotai';
import { alertShow } from '../../../store/Atom';
import { useRouter } from 'next/router';
import { NavigationCard } from '@/components/Card/Navigation.card';
import { Card } from '@/components/Card';
import { IconSearch } from '@tabler/icons-react';
import { ProductsTable } from '../../components/Table';
import { Pagination } from '@/components/Pagination';
import { useAuthToken } from '../../../hooks/useAuthToken';
import { fetchWithAuth } from '../../../lib/fetchWithAuth';

export interface Products {
    barcode: string;
    name: string;
    description?: string;
    flag: string;
    createdAt: Date;
    updatedAt: Date;
    product_category: {
        categories: {
            name: string;
        };
    }[];
    service_product: {
        services: {
            name: string;
        };
    }[];
}

export default function ProductsListPage() {
    const router = useRouter();
    const [products, setProducts] = useState<Products[]>([]);
    const [search, setSearch] = useState<string>('');
    const [limit, setLimit] = useState<number>(5);
    const [currentPage, setCurrentPage] = useState(1);
    const setAlert = useSetAtom(alertShow);

    const { token, refreshToken } = useAuthToken();
    const fetchProducts = useCallback(async () => {
        try {
            const response = await fetchWithAuth(token, refreshToken, `${BACKEND}/products`);
            const result = await response.json();

            if (result.error === true) {
                setAlert({ type: 'error', message: result.message });
                router.push('/');
            } else {
                setProducts(result.data);
            }
        } catch (error) {
            setAlert({ type: 'error', message: `${error}` });
            router.push('/');
        }
    }, [router, setAlert, refreshToken, token]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const navCard = [
        { title: 'List Produk', url: '/products' },
        { title: 'Tambah Produk', url: '/products/create' },
        { title: 'Disabled Produk', url: '/products/disabled' },
    ];

    const filteredProducts: Products[] = products.filter((product) => product.name.toLowerCase().includes(search.toLowerCase()));
    // Logika pagination
    const indexOfLastData = currentPage * limit;
    const indexOfFirstData = indexOfLastData - limit;
    const currentData = filteredProducts.slice(indexOfFirstData, indexOfLastData);
    // Handler untuk perubahan halaman
    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };
    // Handler untuk perubahan limit
    const handleLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setLimit(parseInt(e.target.value));
        setCurrentPage(1);
    };

    return (
        <section className="relative py-8">
            <NavigationCard navCard={navCard} />
            <Card className="w-10/12 rounded-tl-none">
                <div className="flex items-center justify-between mb-5">
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
                    <div className="flex items-center justify-center w-3/12">
                        <input
                            type="text"
                            className="px-3 py-2 bg-slate-50 rounded-lg border border-slate-400 text-sm w-full rounded-r-none border-r-0 outline-none"
                            placeholder="Cari Produk..."
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
                        />
                        <div className="px-3 py-2 bg-slate-50 rounded-lg border border-slate-400 text-sm rounded-l-none border-l-0">
                            <IconSearch size={20} />
                        </div>
                    </div>
                </div>
                <ProductsTable filteredProducts={currentData} products={products} fetchProducts={fetchProducts} />
                {currentData.length > 0 && (
                    <Pagination currentPage={currentPage} totalItems={filteredProducts.length} itemsPerPage={limit} onPageChange={handlePageChange} />
                )}
            </Card>
        </section>
    );
}
