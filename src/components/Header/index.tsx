import { formatDay, formatDayName, formatMonth } from '../../../lib/utils';

export const Header = () => {
    return (
        <header className="flex items-center justify-start gap-5">
            <div className="flex items-center justify-center gap-3">
                <div className="flex items-center justify-center w-[4.5rem] h-[4.5rem] rounded-full border-2 border-slate-300">
                    <span className="font-semibold text-xl text-blue-300">{formatDay(new Date())}</span>
                </div>
                <div className="text-lg border-r-2 border-slate-300 pr-5 font-medium text-slate-500">
                    <p>{formatDayName(new Date())}, </p>
                    <p>{formatMonth(new Date())}</p>
                </div>
            </div>

            <h2 className="text-3xl font-medium">
                Hi, Selamat datang <br /> Mikael Aditya Nugroho
            </h2>
        </header>
    );
};
