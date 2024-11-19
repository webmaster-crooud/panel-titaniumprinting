import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

type propsNavigationCard = {
    url: string;
    title: string;
};

export const NavigationCard = ({ navCard }: { navCard: propsNavigationCard[] }) => {
    const router = useRouter();
    const { pathname } = router;
    return (
        <div className="flex items-center justify-start w-auto overflow-hidden">
            {navCard.map((nav, index) => (
                <Link
                    key={index}
                    href={nav.url}
                    className={`px-5 py-2 font-semibold text-slate-500 text-sm  border border-slate-400 border-b-0
						${navCard.length === 1 ? 'rounded-lg' : ''}
						${index === 0 ? 'rounded-tl-lg' : 'border-l-0'}
						${index === navCard.length - 1 ? 'rounded-tr-lg' : 'rounded-none'}  
						${pathname !== nav.url ? 'bg-blue-100' : 'bg-blue-200'}`}
                >
                    {nav.title}
                </Link>
            ))}
        </div>
    );
};
