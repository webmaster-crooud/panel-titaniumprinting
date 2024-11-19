import Image from 'next/image';
import Link from 'next/link';
import { jakartaSans } from '../../../lib/utils';
import { IconMenu2 } from '@tabler/icons-react';
import { ProfileMenu } from './Menu/Profile.menu';
import { Sidebar } from './Menu/Sidebar.menu';
import { useState } from 'react';

export const Navbar = () => {
    const [sidebar, setSidebar] = useState<boolean>(false);
    return (
        <nav className={`max-w-full w-full fixed top-0 py-5 z-[1] ${jakartaSans.className}`}>
            <div className="flex items-center justify-between w-11/12 mx-auto">
                <div className="flex items-center gap-5 justify-start relative bg-slate-50 px-8 py-2 rounded-full shadow border border-blue-300">
                    <Link href={'/'}>
                        <Image
                            src={'/assets/logo.svg'}
                            priority
                            width={100}
                            height={100}
                            style={{ width: '80%', height: 'auto' }}
                            alt="Logo Titanium Printing"
                        />

                        <h1 className="sr-only">Titanium Printing</h1>
                    </Link>

                    <button
                        type="button"
                        onClick={() => setSidebar(true)}
                        className="flex items-center justify-center w-10 h-10 border border-slate-950 border-dashed rounded-full hover:rotate-[360deg] hover:border-solid hover:bg-blue-200 hover:scale-105 hover:shadow-md hover-animate"
                    >
                        <IconMenu2 size={16} stroke={1.7} />
                    </button>
                </div>

                <ProfileMenu />
            </div>
            {/* sidebar */}
            <Sidebar setSidebar={setSidebar} sidebar={sidebar} />
        </nav>
    );
};
