import React from 'react';

type propsCard = {
    children: React.ReactNode;
    className?: string;
};

export const Card: React.FC<propsCard> = ({ children, className }) => {
    return <div className={` bg-slate-200 rounded-3xl p-6 pb-8 shadow-lg ${className}`}>{children}</div>;
};
