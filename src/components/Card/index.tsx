import React from 'react';

type propsCard = {
    children: React.ReactNode;
    className?: string;
};

export const Card: React.FC<propsCard> = ({ children, className }) => {
    return <div className={`bg-blue-100 border border-slate-400 rounded-xl p-6 pb-8 shadow-lg ${className}`}>{children}</div>;
};
