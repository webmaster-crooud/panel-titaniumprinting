import { NavigationCard } from '@/components/Card/Navigation.card';
import { navCard } from '..';
import { Card } from '@/components/Card';
import React, { useEffect, useState } from 'react';

import { useRouter } from 'next/router';
import { IconLoader3 } from '@tabler/icons-react';
import { BACKEND } from '../../../../lib/utils';

export interface DataServiceDetail {
    barcode: string;
    name: string;
    category_service: {
        categories: {
            name: string;
        };
    }[];
    service_product: {
        products: {
            name: string;
            totalPrice: number;
            totalCogs: number;
        };
    }[];
}
export default function CreateServicePage() {
    const router = useRouter();
    const { barcode } = router.query;
    const [service, setService] = useState<DataServiceDetail | null>(null);
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState<string | undefined>(undefined);
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchDetailService = async () => {
            if (!barcode) return;

            setLoading(true);
            try {
                await new Promise((resolve) => setTimeout(resolve, 1500));
                const response = await fetch(`${BACKEND}/services/${barcode}`);
                const result = await response.json();

                if (result.error === true) {
                    console.error(result.message);
                    return;
                }

                if (result.data) {
                    setService(result.data);
                    setName(result.data.name);
                    setCategories(result.data.category_service);
                }
            } catch (error) {
                console.error('Error fetching service details:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchDetailService();
    }, [barcode]);

    return (
        <>
            <NavigationCard navCard={navCard} />
            <div className="grid grid-cols-5 gap-5 items-start">
                <Card className="col-span-2 rounded-tl-none">
                    {loading ? (
                        <div className="w-full h-60 flex items-center justify-center">
                            <IconLoader3 size={30} className="animate-spin" />
                        </div>
                    ) : (
                        <form>
                            <div className="grid grid-cols-2 gap-5 mt-5">
                                <div>
                                    <label htmlFor="nameService" className="font-semibold text-sm block">
                                        Layanan
                                    </label>
                                    <input
                                        type="text"
                                        className="px-3 mt-2 py-2 rounded-lg w-full bg-slate-50 outline-none"
                                        autoComplete="off"
                                        autoFocus
                                        required
                                        value={name}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                                        placeholder="Masukan nama layanan..."
                                    />
                                </div>
                                <div>
                                    <label htmlFor="category" className="font-semibold text-sm block mb-2">
                                        Kategori
                                    </label>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="px-3 py-2 bg-blue-600 text-slate-100 rounded-lg text-sm mt-3 float-end disabled:opacity-75"
                            >
                                {loading ? (
                                    <div className="flex items-center justify-center gap-2">
                                        <IconLoader3 size={16} stroke={2} className="animate-spin" /> Loading ...
                                    </div>
                                ) : (
                                    'Simpan'
                                )}
                            </button>
                        </form>
                    )}
                </Card>
            </div>
        </>
    );
}
