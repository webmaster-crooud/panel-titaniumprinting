import { NavigationCard } from '@/components/Card/Navigation.card';
import { DataService, navCard } from '.';
import { Card } from '@/components/Card';
import ServiceTable from './Table/Service.table';
import { useCallback, useState } from 'react';
import { BACKEND } from '../../../lib/utils';
import { useRouter } from 'next/router';
import { useSetAtom } from 'jotai';
import { alertShow } from '../../../store/Atom';

export default function DisabledServicePage() {
    const router = useRouter();
    const [services, setServices] = useState<DataService[]>([]);
    const setAlert = useSetAtom(alertShow);

    const fetchService = useCallback(async () => {
        try {
            const response = await fetch(`${BACKEND}/services/disabled`);
            const result = await response.json();
            if (result.error === true) {
                setAlert({ type: 'error', message: result.message });
                router.push('/services');
            } else {
                setServices(result.data);
            }
        } catch (error) {
            setAlert({ type: 'error', message: `${error}` });
        }
    }, [router, setAlert]);

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
