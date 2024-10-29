import { NavigationCard } from '@/components/Card/Navigation.card';
import { DataService, navCard } from '.';
import { Card } from '@/components/Card';
import { ServiceTable } from './Table/Service.table';
import { useCallback, useState } from 'react';
import { BACKEND } from '../../../lib/utils';

export default function DisabledServicePage() {
    const [services, setServices] = useState<DataService[]>([]);

    const fetchService = useCallback(async () => {
        try {
            const response = await fetch(`${BACKEND}/services/disabled`);
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
