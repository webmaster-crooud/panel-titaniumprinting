import { Card } from '@/components/Card';
import { NavigationCard } from '@/components/Card/Navigation.card';
import { IconEyeEdit, IconTrash } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { BACKEND } from '../../../lib/utils';
import { CategoriesTable } from './Table/Categories.table';
import { navCardCategories } from '../../../lib/nav.card';
import { FormUpdateCategories } from './Update';

export interface DataCategories {
    name: string;
    id: number;
    flag?: string;
}

export default function CategoriesPage() {
    const [categories, setCategories] = useState<DataCategories[]>([]);
    const [update, setUpdate] = useState<{ id: number; status: boolean } | undefined>(undefined);
    const [categoryUpdate, setCategoryUpdate] = useState<DataCategories | undefined>(undefined);
    const fetchCategories: () => Promise<void> = async () => {
        try {
            const response = await fetch(`${BACKEND}/categories`);
            const result = await response.json();
            if (result.error === true) {
                console.log(result.message);
            } else {
                setCategories(result.data);
            }
        } catch (error) {
            console.log('ERROR');
        }
    };
    useEffect(() => {
        fetchCategories();
    }, []);

    const handlerUpdate = (id: number, name: string) => {
        setUpdate({ id, status: true });
        setCategoryUpdate({ id, name });
    };
    return (
        <section className="relative">
            <NavigationCard navCard={navCardCategories} />
            <div className="grid grid-cols-4 gap-5 items-start">
                <Card className="rounded-tl-none w-full col-span-2">
                    <CategoriesTable
                        categories={categories}
                        fetchCategories={fetchCategories}
                        handlerUpdate={handlerUpdate}
                        update={update}
                        setUpdate={setUpdate}
                    />
                </Card>
                {update && (
                    <Card className="w-full">
                        <FormUpdateCategories fetchCategories={fetchCategories} id={categoryUpdate?.id} name={`${categoryUpdate?.name}`} />
                    </Card>
                )}
            </div>
        </section>
    );
}
