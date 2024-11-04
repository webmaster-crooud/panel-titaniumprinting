import moment from 'moment-timezone';
import { Plus_Jakarta_Sans } from 'next/font/google';
export const BACKEND = process.env.NEXT_PUBLIC_API;

export const jakartaSans = Plus_Jakarta_Sans({
    display: 'swap',
    subsets: ['latin'],
});

export const formatCurrency = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
});

export const formatDateTIme = (dateTime: Date) => {
    const result = moment.parseZone(dateTime);
    return moment(result).utcOffset('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss');
};
