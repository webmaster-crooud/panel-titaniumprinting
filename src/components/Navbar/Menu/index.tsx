import Link from 'next/link';
import { IconArrowBadgeRightFilled } from '@tabler/icons-react';
import React, { useState } from 'react';

interface PropsNavbarMenu {
    name: string;
    url?: string;
    subMenu?: {
        name: string;
        url: string;
    }[];
}

const navMenu: PropsNavbarMenu[] = [
    {
        name: 'Home',
        subMenu: [
            { name: 'Dashboard', url: '/' },
            { name: 'Website', url: '/' },
        ],
    },
    {
        name: 'Perusahaan',
        url: '/company',
    },
    {
        name: 'Manajemen',
        subMenu: [
            { name: 'Layanan', url: '/services' },
            { name: 'Kategori', url: '/categories' },
            { name: 'Produk', url: '/products' },
            { name: 'Komponen', url: '/components' },
            { name: 'Kualitas', url: '/qualities' },
        ],
    },
    {
        name: 'Laporan',
        subMenu: [
            { name: 'Penjualan', url: '/services' },
            { name: 'Produk', url: '/products' },
            { name: 'Kategori', url: '/categories' },
        ],
    },
];

export const NavbarMenu = () => {
    const [dropdown, setDropdown] = useState<number | undefined>(undefined);

    const handleButtonClick = (index: number) => {
        setDropdown(index === dropdown ? undefined : index);
    };

    return navMenu.map((menu, index) => (
        <div key={index}>
            {menu.subMenu ? (
                <button
                    type="button"
                    className={`font-semibold flex items-center justify-center gap-1 text-sm  hover:text-slate-900 ${
                        dropdown === index ? 'text-slate-900' : 'text-slate-500'
                    }`}
                    onClick={() => handleButtonClick(index)}
                >
                    <span>{menu.name}</span>
                    <IconArrowBadgeRightFilled
                        size={18}
                        className={`transition-transform ease-in-out duration-300 ${dropdown === index && 'rotate-90'}`}
                    />
                </button>
            ) : (
                <Link
                    href={`${menu.url}`}
                    className={`font-semibold flex items-center justify-center gap-1 text-sm text-slate-600 hover:text-slate-900`}
                    onClick={() => handleButtonClick(index)} // Use handleButtonClick
                >
                    <span>{menu.name}</span>
                </Link>
            )}

            {menu.subMenu &&
                dropdown === index && ( // Show dropdown only for active button
                    <div className="absolute top-9 w-56 rounded-xl bg-slate-100 text-slate-800 font-medium shadow-lg overflow-hidden">
                        <div className="flex flex-col text-xs">
                            {menu.subMenu.map((subMenu, index) => (
                                <Link
                                    key={index}
                                    href={`${subMenu.url}`}
                                    onClick={() => setDropdown(undefined)}
                                    className="w-full h-full hover:bg-slate-200 px-5 py-3 border-b border-slate-300"
                                >
                                    {subMenu.name}
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
        </div>
    ));
};
