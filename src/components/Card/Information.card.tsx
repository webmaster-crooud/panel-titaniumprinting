import React from 'react';

type propsInformationCard = {
    title: string;
    icon: React.ReactNode;
    button: React.ReactNode;
    content: string | number;
    url: string;
    className?: string;
};
export const InformationCard: React.FC<propsInformationCard> = ({ title, icon, button, content, url, className }) => {
    return (
        <button
            type="button"
            className={`p-5 text-start bg-blue-100 rounded-xl shadow-md border border-slate-400 hover:scale-95 hover:shadow-lg hover-animate ${className}`}
        >
            <div className="flex items-center justify-between">
                <h3 className="flex items-center justify-start gap-2">
                    {icon}
                    <span className="sr-only">{title}</span>
                </h3>
            </div>

            <div className="pt-5">
                <p className="text-3xl font-bold text-blue-300">{content}</p>
                <span className="text-lg font-bold text-slate-500">{title}</span>
            </div>
        </button>
    );
};
