import { IconCaretRightFilled, IconMessage } from '@tabler/icons-react';

export const ProfileMenu = () => {
    return (
        <div className="flex items-center gap-5">
            <button
                type="button"
                className="text-xs tracking-wider text-slate-700 font-semibold px-5 py-3 bg-slate-100 rounded-full border border-blue-200 group"
            >
                <div className="flex items-center justify-center gap-1">
                    <h5>Hi, Mikael</h5>
                    <IconCaretRightFilled size={16} className="group-hover:rotate-90 hover-animate" />
                </div>
            </button>
            <button
                type="button"
                className="h-10 w-10 bg-slate-100 rounded-full flex items-center justify-center border border-blue-200 hover:scale-110 hover:bg-blue-200 hover:shadow hover-animate"
            >
                <IconMessage size={18} stroke={2} className="text-slate-500" />
            </button>
        </div>
    );
};
