import { Card } from '@/components/Card';
import { NavigationCard } from '@/components/Card/Navigation.card';
import { useCallback, useEffect, useState } from 'react';
import { BACKEND } from '../../../lib/utils';
import CategoriesTable from '../../components/Table/Categories.table';
import { navCardCategories } from '../../../lib/nav.card';
import FormUpdateCategories from '../../components/Card/CategoriesUpdate.card';
import { useSetAtom } from 'jotai';
import { alertShow } from '../../../store/Atom';
import { useRouter } from 'next/router';
import { useAuthToken } from '../../../hooks/useAuthToken';
import { fetchWithAuth } from '../../../lib/fetchWithAuth';

export interface DataCategories {
    name: string;
    id: number;
    flag?: string;
}

export default function CategoriesPage() {
    const router = useRouter();
    const [categories, setCategories] = useState<DataCategories[]>([]);
    const [update, setUpdate] = useState<{ id: number; status: boolean } | undefined>(undefined);
    const [categoryUpdate, setCategoryUpdate] = useState<DataCategories | undefined>(undefined);
    const setAlert = useSetAtom(alertShow);

    const { token, refreshToken } = useAuthToken();
    const fetchCategories: () => Promise<void> = useCallback(async () => {
        try {
            const response = await fetchWithAuth(token, refreshToken, `${BACKEND}/categories`);
            const result = await response.json();
            if (result.error === true) {
                router.push('/');
                setAlert({
                    type: 'error',
                    message: result.message,
                });
            } else {
                setCategories(result.data);
            }
        } catch (error) {
            setAlert({ type: 'error', message: `${error}` });
        }
    }, [refreshToken, router, setAlert, token]);
    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    const handlerUpdate = (id: number, name: string) => {
        setUpdate({ id, status: true });
        setCategoryUpdate({ id, name });
    };
    return (
        <section className="relative py-8">
            <NavigationCard navCard={navCardCategories} />
            <div className="grid grid-cols-5 gap-5 items-start">
                <Card className="rounded-tl-none w-full col-span-3">
                    <CategoriesTable
                        categories={categories}
                        fetchCategories={fetchCategories}
                        handlerUpdate={handlerUpdate}
                        update={update}
                        setUpdate={setUpdate}
                    />
                </Card>
                {update && (
                    <Card className="w-full col-span-2">
                        <FormUpdateCategories fetchCategories={fetchCategories} id={categoryUpdate?.id} name={`${categoryUpdate?.name}`} />
                    </Card>
                )}
            </div>
        </section>
    );
}
