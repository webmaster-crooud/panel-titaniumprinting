import { NavigationCard } from '@/components/Card/Navigation.card';
import { navCard } from '..';
import { Card } from '@/components/Card';
import React, { useCallback, useEffect, useId, useState } from 'react';
import Select, { MultiValue } from 'react-select';
import { useRouter } from 'next/router';
import { IconLoader3, IconTrash } from '@tabler/icons-react';
import { BACKEND } from '../../../../lib/utils';
import { useSetAtom } from 'jotai';
import { alertShow } from '../../../../store/Atom';

export interface DataServiceDetail {
    barcode: string;
    name: string;
    category_service: {
        categories: {
            id: number;
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

interface Services {
    name: string | undefined;
    categoryService: any;
}

interface CategoryOption {
    value: number;
    label: string;
}
export default function CreateServicePage() {
    const router = useRouter();
    const { barcode } = router.query;
    const uniqueId = useId();
    const [service, setService] = useState<DataServiceDetail | null>(null);
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState<string | undefined>(undefined);
    const [categories, setCategories] = useState<CategoryOption[]>([]);
    const [categoriesList, setCategoriesList] = useState([]);
    const setAlert = useSetAtom(alertShow);
    const fetchDetailService = useCallback(async () => {
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
                setCategories(
                    result.data.category_service.map(({ categories }: any) => ({
                        value: categories.id,
                        label: categories.name,
                    })),
                );
            }
        } catch (error) {
            console.error('Error fetching service details:', error);
        } finally {
            setLoading(false);
        }
    }, [barcode]);
    useEffect(() => {
        fetchDetailService();
    }, [fetchDetailService]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await fetch(`${BACKEND}/categories`);
                const result = await res.json();
                if (result.error === true) {
                    console.log('ERROR');
                    return;
                } else {
                    setCategoriesList(
                        result.data.map((category: any) => ({
                            value: category.id,
                            label: category.name,
                        })),
                    );
                }
            } catch (error) {
                console.log('ERROR');
            }
        };

        fetchCategories();
    }, []);

    const handleCategoryChange = (newValue: MultiValue<CategoryOption>) => {
        setCategories(newValue as CategoryOption[]);
    };

    const data: Services = {
        name,
        categoryService: categories.map((option) => ({ categoryId: option.value })),
    };
    const submitUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!name) {
            console.log('ERROR');
        } else {
            setLoading(true);
            try {
                await new Promise((resolve) => setTimeout(resolve, 1500));
                const response = await fetch(`${BACKEND}/services/${barcode}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data),
                });
                const result = await response.json();
                if (result.error === true) {
                    setAlert({ type: 'error', message: result.message });
                } else {
                    setAlert({ type: 'success', message: result.message });
                    router.push('/services');
                }
            } catch (error) {
                console.log('ERROR');
            } finally {
                setLoading(false);
            }
        }
    };

    const handlerDeleteCategories = async (barcode: string, categoryId: number) => {
        setLoading(true);
        try {
            await new Promise((resolve) => setTimeout(resolve, 1500));
            const response = await fetch(`${BACKEND}/services/${barcode}/${categoryId}`, {
                method: 'DELETE',
            });
            const result = await response.json();
            if (result.error === true) {
                setAlert({ type: 'error', message: result.message });
            }
            setAlert({ type: 'success', message: result.message });
            fetchDetailService();
        } catch (error) {
            setAlert({ type: 'error', message: `${error}` });
        } finally {
            setLoading(false);
            fetchDetailService();
        }
    };
    return (
        <section className="relative py-8">
            <NavigationCard navCard={navCard} />
            <div className="grid grid-cols-5 gap-5 items-start">
                <Card className={`${loading ? 'animate-pulse' : 'animate-none'} col-span-3 rounded-tl-none`}>
                    <form onSubmit={submitUpdate}>
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
                                <label htmlFor={`${uniqueId}-category-input`} className="font-semibold text-sm block mb-2">
                                    Tambah Kategori
                                </label>
                                <Select
                                    isMulti
                                    options={categoriesList}
                                    id={uniqueId}
                                    onChange={handleCategoryChange}
                                    instanceId={`${uniqueId}-category`}
                                    inputId={`${uniqueId}-category-input`}
                                    className="react-select"
                                    value={categories}
                                    classNamePrefix="react-select"
                                    isSearchable
                                    isClearable={false}
                                    isDisabled={false}
                                />
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
                </Card>
                <Card className="col-span-2">
                    <h1>
                        {loading ? (
                            <div className="w-full h-60 flex items-center justify-center">
                                <IconLoader3 size={30} className="animate-spin" />
                            </div>
                        ) : (
                            <>
                                {service?.category_service.map(({ categories }, index) => (
                                    <div key={index} className="flex items-center justify-between py-2 px-3 border-b border-slate-600">
                                        <p className="text-sm">{categories.name}</p>

                                        <button
                                            disabled={loading}
                                            onClick={() => handlerDeleteCategories(service.barcode, categories.id)}
                                            className="p-2 bg-red-300 text-red-900 rounded-lg"
                                        >
                                            {loading ? (
                                                <IconLoader3 size={16} stroke={2} className="animate-spin" />
                                            ) : (
                                                <IconTrash size={14} stroke={2} />
                                            )}
                                        </button>
                                    </div>
                                ))}
                            </>
                        )}
                    </h1>
                </Card>
            </div>
        </section>
    );
}
