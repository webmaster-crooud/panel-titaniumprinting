import { Card } from '@/components/Card';
import { NavigationCard } from '@/components/Card/Navigation.card';
import { useEffect, useState } from 'react';
import { BACKEND } from '../../../lib/utils';
import CategoriesTable from './Table/Categories.table';
import { navCardCategories } from '../../../lib/nav.card';

export interface DataCategories {
    name: string;
    id: number;
}

export default function DisabledCategoriesPage() {
    const [categories, setCategories] = useState<DataCategories[]>([]);
    const fetchCategories = async () => {
        try {
            const response = await fetch(`${BACKEND}/categories/disabled`);
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

    return (
        <section className="relative">
            <NavigationCard navCard={navCardCategories} />
            <Card className="w-5/12 rounded-tl-none">
                <CategoriesTable categories={categories} fetchCategories={fetchCategories} />
            </Card>
        </section>
    );
}
