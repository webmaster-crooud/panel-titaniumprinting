import React, { useState } from 'react';
import Image from 'next/image';
import { IconHome2, IconReport, IconX } from '@tabler/icons-react';
import Link from 'next/link';

interface propsSidebar {
    name: string | React.ReactNode;
    url?: string;
    subMenu?: {
        name: string;
        url: string;
    }[];
}

const navMenu: propsSidebar[] = [
    {
        name: (
            <div className="flex items-center justify-center gap-5">
                <IconHome2 size={18} stroke={1.8} />
                <span>Home</span>
            </div>
        ),
        subMenu: [
            { name: 'Dashboard', url: '/' },
            { name: 'Perusahaan', url: '/companies' },
            { name: 'Staff', url: '/staff' },
        ],
    },
    {
        name: 'Produk',
        url: '/products',
    },
    {
        name: 'Layanan',
        url: '/services',
    },
    {
        name: 'Kategori',
        url: '/categories',
    },
    {
        name: 'Komponen',
        url: '/components',
    },
    {
        name: (
            <div className="flex items-center justify-center gap-5">
                <IconReport size={18} stroke={1.8} />
                <span>Laporan</span>
            </div>
        ),
        subMenu: [
            { name: 'Penjualan', url: '/services' },
            { name: 'Produk', url: '/products' },
            { name: 'Kategori', url: '/categories' },
        ],
    },
];

export const Sidebar = ({ sidebar, setSidebar }: { sidebar: boolean; setSidebar: React.Dispatch<React.SetStateAction<boolean>> }) => {
    const [subMenu, setSubMenu] = useState<{ idx: number } | undefined>(undefined);
    return (
        sidebar && (
            <aside className="fixed top-0 left-0 w-3/12 z-10 bg-slate-50/60 backdrop-blur-md h-full shadow-md overflow-y-auto">
                <div className="flex items-center justify-between py-8 px-5">
                    <Image
                        alt="Logo Titanium Printing"
                        src={'/assets/logo.svg'}
                        width={200}
                        height={200}
                        style={{ height: 'auto', width: 'auto' }}
                        priority
                    />

                    <button type="button" onClick={() => setSidebar(false)} className="hover:rotate-[360deg] hover-animate">
                        <IconX size={25} stroke={2} className="text-slate-500" />
                    </button>
                </div>

                {/* Menu */}
                <div className="relative w-full">
                    <ul className="flex flex-col gap-y-3">
                        {navMenu.map((menu, index) => (
                            <li className="relative" key={index}>
                                {menu.subMenu ? (
                                    <>
                                        <button
                                            type="button"
                                            onClick={() => setSubMenu({ idx: index })}
                                            className="flex items-center justify-between w-9/12 py-4 border-2 border-slate-300 rounded-full border-l-0 rounded-l-none px-3 group hover:border-blue-300 hover-animate"
                                        >
                                            <h3 className="font-medium tracking-wider text-sm text-slate-600 group-hover:text-blue-300 hover-animate">
                                                {menu.name}
                                            </h3>
                                        </button>

                                        {subMenu?.idx === index && (
                                            <ul className="flex flex-col gap-y-2 rounded-3xl border-2 border-slate-300 px-5 w-7/12 border-t-0 border-l-0 py-5 rounded-tr-none rounded-bl-none">
                                                {menu.subMenu.map((subMenu, index) => (
                                                    <Link href={subMenu.url ? subMenu.url : '/'} key={index}>
                                                        <h3 className="font-medium tracking-wider text-sm text-slate-500 hover:text-blue-300 hover-animate">
                                                            {subMenu.name}
                                                        </h3>
                                                    </Link>
                                                ))}
                                            </ul>
                                        )}
                                    </>
                                ) : (
                                    <Link
                                        href={menu.url ? menu.url : '/'}
                                        className="flex items-center justify-between w-9/12 py-4 border-2 border-slate-300 rounded-full border-l-0 rounded-l-none px-3 group hover:border-blue-300 hover-animate"
                                    >
                                        <h3 className="font-medium tracking-wider text-sm text-slate-600 group-hover:text-blue-300 hover-animate">
                                            {menu.name}
                                        </h3>
                                    </Link>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            </aside>
        )
    );
};
