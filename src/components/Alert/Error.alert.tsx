import { useAtom } from 'jotai';
import { alertShow } from '../../../store/Atom';
import { useEffect } from 'react';
import { IconX } from '@tabler/icons-react';

export const ErrorAlert = () => {
    const [alert, setAlert] = useAtom(alertShow);
    useEffect(() => {
        const timerAlert = async () => {
            alert;
            await new Promise((resolve) => setTimeout(resolve, 10000));
            setAlert(undefined);
        };

        timerAlert();
    }, [alert, setAlert]);

    return (
        <div
            className={`absolute z-30 right-5 w-full ${
                alert?.type === 'error' ? '-translate-y-0 opacity-100 duration-300 ease-in-out' : '-translate-y-10 opacity-0 duration-300 ease-in-out'
            }`}
        >
            <div className={`w-4/12 ms-auto px-3 py-2 bg-red-200 rounded-lg border border-slate-300 text-red-900 flex items-center justify-between`}>
                <div>
                    <b>Kesalahan!</b>
                    <p className="font-medium text-sm">{alert?.message}</p>
                </div>
                <button type="button" onClick={() => setAlert(undefined)}>
                    <IconX size={20} stroke={2} />
                </button>
            </div>
        </div>
    );
};
