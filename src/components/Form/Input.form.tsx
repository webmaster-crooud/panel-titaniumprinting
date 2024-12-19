import { Companies } from '@/pages/companies';
import React, { SetStateAction } from 'react';

type propsInputForm = {
    title: string;
    name: string;
    value: string;
    type?: string;
    placeholder?: string;
    className?: string;
    setCompanies: React.Dispatch<SetStateAction<Companies>>;
    companies: Companies;
};

export const InputForm: React.FC<propsInputForm> = ({ title, name, value, type = 'text', placeholder, className, setCompanies, companies }) => {
    const handleCompaniesChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setCompanies({ ...companies, [e.target.name]: e.target.value });
    };
    return (
        <div className={className}>
            <label htmlFor={name} className="font-semibold">
                {title}
            </label>
            {type === 'textarea' ? (
                <>
                    <textarea
                        name={name}
                        value={value}
                        rows={5}
                        className={`font-medium bg-slate-100 w-full border border-slate-300 text-slate-700 px-4 py-2 rounded-lg block mt-1`}
                        onChange={handleCompaniesChange}
                    />
                    <div className="flex items-center justify-end">{value === null ? 0 : value.length} / 1000</div>
                </>
            ) : (
                <input
                    type={type}
                    placeholder={placeholder}
                    name={name}
                    value={value}
                    className={`font-medium bg-slate-100 w-full border border-slate-300 text-slate-700 px-4 py-2 rounded-lg block mt-1`}
                    autoComplete="off"
                    onChange={handleCompaniesChange}
                />
            )}
        </div>
    );
};
