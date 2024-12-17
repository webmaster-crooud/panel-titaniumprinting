import { IconBasket, IconCaretRightFilled, IconMessage, IconPower, IconUserCog } from '@tabler/icons-react';
import Link from 'next/link';
import { useState } from 'react';
import { AUTH } from '../../../../lib/utils';
import { useSetAtom } from 'jotai';
import { alertShow, authAccount } from '../../../../store/Atom';
import { useRouter } from 'next/router';
import { useAtomValue } from 'jotai';

export const ProfileMenu = () => {
    const router = useRouter();
    const [dropMenu, setDropMenu] = useState<boolean>(false);
    const setAlert = useSetAtom(alertShow);
    const auth = useAtomValue(authAccount);
    const handlerLogout = async () => {
        try {
            await fetch(`${AUTH}/logout`, {
                method: 'DELETE',
                credentials: 'include', // Critical for cookie transmission
            });

            router.push(`${process.env.NEXT_PUBLIC_HOME}/login`);
        } catch (error) {
            setAlert({ type: 'error', message: `${error}` });
        }
    };
    return (
        <div className="flex items-center gap-5">
            <div className="relative w-full">
                <button
                    type="button"
                    className="text-xs tracking-wider text-slate-700 font-semibold px-5 py-3 bg-slate-100 rounded-full border border-blue-200 group relative z-[2]"
                    onClick={() => setDropMenu(!dropMenu)}
                >
                    <div className="flex items-center justify-center gap-1">
                        <h5>Hi, {auth?.firstName}</h5>
                        <IconCaretRightFilled size={16} className="group-hover:rotate-90 hover-animate" />
                    </div>
                </button>

                {dropMenu && (
                    <div className="absolute top-12 left-0 z-[1] w-full">
                        <div className="bg-slate-100 border border-slate-400 rounded-xl p-0 shadow-lg">
                            <ul>
                                <li className="px-3 py-2 border-b border-b-slate-400">
                                    <Link href={'/'} className="text-sm text-blue-400 font-medium">
                                        <div className="flex items-center justify-start gap-1">
                                            <IconUserCog stroke={2} size={16} className="mt-0.5" /> <span>Profile</span>
                                        </div>
                                    </Link>
                                </li>
                                <li className="px-3 py-2 border-b border-b-slate-400">
                                    <Link href={'/'} className="text-sm text-blue-400 font-medium">
                                        <div className="flex items-center justify-start gap-1">
                                            <IconBasket stroke={2} size={16} className="mt-0.5" /> <span>Keranjang</span>
                                        </div>
                                    </Link>
                                </li>
                                <li className="px-3 py-2  border-b-0 border-b-slate-400">
                                    <button type="button" onClick={handlerLogout} className="text-sm text-red-400 font-medium">
                                        <div className="flex items-center justify-start gap-1">
                                            <IconPower stroke={2} size={16} className="mt-0.5" /> <span>Keluar</span>
                                        </div>
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                )}
            </div>
            <button
                type="button"
                className="h-10 w-14 bg-slate-100 rounded-full flex items-center justify-center border border-blue-200 hover:scale-110 hover:bg-blue-200 hover:shadow hover-animate"
            >
                <IconMessage size={18} stroke={2} className="text-slate-500" />
            </button>
        </div>
    );
};
