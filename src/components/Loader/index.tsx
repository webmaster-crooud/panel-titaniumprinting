import { IconLoader3 } from '@tabler/icons-react';

export const Loader = () => {
    return (
        <div className="w-full z-10 h-screen fixed top-0 left-0 right-0 bg-black/10 backdrop-blur-sm flex items-center justify-center">
            <IconLoader3 className="animate-spin text-sky-600" size={40} stroke={2} />
        </div>
    );
};
