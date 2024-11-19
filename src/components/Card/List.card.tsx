import { IconArrowRightBar } from '@tabler/icons-react';
import Link from 'next/link';
import { title } from 'process';
import React from 'react';

type propsListCard = {
    title: string | React.ReactNode;
    url: string;
    children: React.ReactNode;
};
export const ListCard: React.FC<propsListCard> = ({ title, url, children }) => {
    return (
        <div className="p-5 text-start bg-slate-50 rounded-xl shadow-md border border-slate-400 hover:shadow-lg hover-animate col-span-2">
            <div className="flex items-center justify-between">
                <h3 className="font-medium text-slate-700">
                    <div className="flex items-center justify-start gap-2 ">{title}</div>
                </h3>

                <Link href={url} className="px-5 py-1.5 rounded-full border border-orange-600 flex items-center justify-end gap-2">
                    <span className="text-sm font-medium text-orange-600">Data Selengkapnya</span>
                    <IconArrowRightBar size={18} stroke={2} className="text-orange-600" />
                </Link>
            </div>

            <div className="pt-5">{children}</div>
        </div>
    );
};
