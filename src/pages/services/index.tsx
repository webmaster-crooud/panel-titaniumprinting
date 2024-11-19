import { Card } from '@/components/Card';
import { NavigationCard } from '@/components/Card/Navigation.card';
import ServiceTable from './Table/Service.table';
import { useCallback, useEffect, useState } from 'react';
import { BACKEND } from '../../../lib/utils';

export const navCard = [
    { title: 'List Layanan', url: '/services' },
    { title: 'Tambah Layanan', url: '/services/create' },
    { title: 'Disabled Layanan', url: '/services/disabled' },
];

export interface DataService {
    barcode: string;
    name: string;
    flag: string;
}

export default function ServicePage() {
    const [services, setServices] = useState<DataService[]>([]);

    const fetchService = useCallback(async () => {
        try {
            const response = await fetch(`${BACKEND}/services`);
            const result = await response.json();
            if (result.error === true) {
                console.log(result.message);
            } else {
                setServices(result.data);
            }
        } catch (error) {
            console.log(error);
        }
    }, []);

    return (
        <>
            <NavigationCard navCard={navCard} />
            <div className="grid grid-cols-3 items-start gap-5">
                <Card className="rounded-tl-none col-span-2">
                    <ServiceTable services={services} fetchService={fetchService} />
                </Card>
            </div>
        </>
    );
}
