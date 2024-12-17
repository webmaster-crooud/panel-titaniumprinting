'use client';
import { useAtomValue } from 'jotai';
import { authAccount } from '../../../store/Atom';

import { useEffect, useState } from 'react';
import { formatMoment } from '../../../lib/utils';

export const Header = () => {
    const auth = useAtomValue(authAccount);
    const [date, setDate] = useState<{ day: string; dayName: string; month: string }>({ day: '', dayName: '', month: '' });
    useEffect(() => {
        setDate({
            dayName: formatMoment(new Date()).format('dddd'),
            day: formatMoment(new Date()).format('DD'),
            month: formatMoment(new Date()).format('MMMM'),
        });
    }, []);
    return (
        <header className="flex items-center justify-start gap-5">
            <div className="flex items-center justify-center gap-3">
                <div className="flex items-center justify-center w-[4.5rem] h-[4.5rem] rounded-full border-2 border-slate-300">
                    <span className="font-semibold text-xl text-blue-300">{date.day}</span>
                </div>
                <div className="text-lg border-r-2 border-slate-300 pr-5 font-medium text-slate-500">
                    <p>{date.dayName} </p>
                    <p>{date.month}</p>
                </div>
            </div>

            <h2 className="text-3xl font-medium">
                Hi, Selamat datang <br /> {`${auth?.firstName} ${auth?.lastName}`}
            </h2>
        </header>
    );
};
