import moment from 'moment-timezone';
import { Plus_Jakarta_Sans } from 'next/font/google';
export const BACKEND = process.env.NEXT_PUBLIC_API;
export const AUTH = process.env.NEXT_PUBLIC_AUTH;
export const PUBLIC = process.env.NEXT_PUBLIC_STATIC;

export const jakartaSans = Plus_Jakarta_Sans({
    display: 'swap',
    subsets: ['latin'],
});

export const formatCurrency = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
});

export const formatMoment = (dateTime: Date | string) => {
    const result = moment(dateTime);
    return result.locale('en');
};
