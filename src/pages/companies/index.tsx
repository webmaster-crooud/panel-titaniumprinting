import { useSetAtom } from 'jotai';
import { useAuthToken } from '../../../hooks/useAuthToken';
import { alertShow } from '../../../store/Atom';
import React, { useCallback, useEffect, useState } from 'react';
import { fetchWithAuth } from '../../../lib/fetchWithAuth';
import { BACKEND } from '../../../lib/utils';
import { Loader } from '@/components/Loader';
import { Card } from '@/components/Card';
import { InputForm } from '@/components/Form/Input.form';
import Link from 'next/link';
import { IconArrowBack, IconCloudUpload, IconLink, IconLoader3, IconMinus, IconPlus, IconSettings2, IconTrash } from '@tabler/icons-react';

interface SocialMedia {
    id?: number;
    name: string;
    url: string;
}
export interface Companies {
    name: string;
    logo: string;
    description: string;

    street: string;
    city: string;
    province: string;
    country: string;
    postalCode: string;

    socialMedia?: SocialMedia[];
}

export default function CompaniesPage() {
    const { token, refreshToken } = useAuthToken();
    const setAlert = useSetAtom(alertShow);
    const [companies, setCompanies] = useState<Companies>({
        name: '',
        logo: '',
        description: '',

        street: '',
        city: '',
        province: '',
        country: '',
        postalCode: '',
        socialMedia: [],
    });
    const [loading, setLoading] = useState<boolean>(false);
    const [sosmed, setSosmed] = useState<SocialMedia[]>([]);

    const addSosmed = () => {
        setSosmed([...sosmed, { name: '', url: '' }]);
    };

    const removeSosmed = (index: number) => {
        const data = [...sosmed];
        data.splice(index, 1);
        setSosmed(data);
    };

    const handleSosmedChange = (value: string | undefined, field: string, index: number) => {
        const newSosmed = [...sosmed];
        newSosmed[index] = { ...newSosmed[index], [field]: value };
        setSosmed(newSosmed);
    };

    const fetchCompanies = useCallback(async () => {
        setLoading(true);
        try {
            const response = await fetchWithAuth(token, refreshToken, `${BACKEND}/companies/titaniumPrinting`);
            const result = await response.json();
            if (result.error) {
                setAlert({ type: 'error', message: result.message });
            } else {
                setCompanies(result.data);
            }
        } catch (error) {
            setAlert({ type: 'error', message: `${error}` });
        } finally {
            setLoading(false);
        }
    }, [refreshToken, token, setAlert]);

    useEffect(() => {
        fetchCompanies();
    }, [fetchCompanies]);

    const handlerForm = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (sosmed.length >= 1) {
                const response = await fetchWithAuth(token, refreshToken, `${BACKEND}/companies/titaniumPrinting`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: companies.name,
                        logo: companies.logo,
                        description: companies.description || '',
                        street: companies.street,
                        city: companies.city,
                        country: companies.country,
                        province: companies.province,
                        postalCode: String(companies.postalCode),
                    }),
                });
                const result = await response.json();
                const responseSosmed = await fetchWithAuth(token, refreshToken, `${BACKEND}/companies/titaniumPrinting/social-media`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(
                        sosmed.map((data) => ({
                            name: data.name,
                            url: data.url,
                        })),
                    ),
                });
                const resultSosmed = await responseSosmed.json();
                if (result.error || resultSosmed.error) {
                    setAlert({ type: 'error', message: `${result.message} \n ${resultSosmed.message}` });
                } else {
                    fetchCompanies();
                    setAlert({ type: 'success', message: `${result.message} \n ${resultSosmed.message}` });
                    setSosmed([]);
                }
            } else {
                const response = await fetchWithAuth(token, refreshToken, `${BACKEND}/companies/titaniumPrinting`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: companies.name,
                        logo: companies.logo,
                        description: companies.description || '',
                        street: companies.street,
                        city: companies.city,
                        country: companies.country,
                        province: companies.province,
                        postalCode: String(companies.postalCode),
                    }),
                });
                const result = await response.json();
                if (result.error) {
                    setAlert({ type: 'error', message: result.message });
                } else {
                    fetchCompanies();
                    setAlert({ type: 'success', message: result.message });
                }
            }
        } catch (error) {
            setAlert({ type: 'error', message: `${error}` });
        } finally {
            setLoading(false);
        }
    };

    const handlerDeletSosmed = async (index: number | undefined) => {
        setLoading(true);
        try {
            await new Promise((resolve) => setTimeout(resolve, 1500));
            const response = await fetchWithAuth(token, refreshToken, `${BACKEND}/companies/${index}/social-media`, {
                method: 'DELETE',
            });
            const result = await response.json();
            if (result.error) {
                setAlert({ type: 'error', message: `${result.message}` });
            } else {
                fetchCompanies();
                setAlert({ type: 'success', message: `${result.message}` });
            }
        } catch (error) {
            setAlert({ type: 'error', message: `${error}` });
        } finally {
            setLoading(false);
        }
    };
    if (loading) {
        return <Loader />;
    }
    return (
        <form onSubmit={handlerForm}>
            <Card className="w-8/12 mt-8">
                <div className="flex items-center justify-between mb-5">
                    <h1 className="font-bold uppercase w-full text-blue-900">Pengaturan Perusahaan</h1>
                    <div className="flex justify-end gap-3 w-full">
                        <Link
                            href={'/'}
                            className="px-5 py-2 text-xs font-semibold text-slate-100 bg-red-600 rounded-lg flex items-center justify-ceter gap-1"
                        >
                            <IconArrowBack size={16} stroke={2} /> <span>Kembali</span>
                        </Link>
                        <button type="submit" disabled={loading} className="px-5 py-2 text-xs font-semibold text-slate-100 bg-blue-900 rounded-lg">
                            <div className="flex items-center justify-ceter gap-1">
                                {loading ? (
                                    <>
                                        <IconLoader3 size={16} stroke={2} className="animate-spin" /> <span>Loading...</span>
                                    </>
                                ) : (
                                    <>
                                        <IconCloudUpload size={16} stroke={2} /> <span>Simpan</span>
                                    </>
                                )}
                            </div>
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-5">
                    <InputForm
                        name="name"
                        title="Perusahaan"
                        placeholder="Masukan Nama Perusahaan"
                        value={companies.name}
                        companies={companies}
                        setCompanies={setCompanies}
                    />
                    <InputForm
                        name="description"
                        type="textarea"
                        className="col-span-2"
                        title="Deskripsi Perusahaan"
                        placeholder="Masukan Nama Perusahaan"
                        value={companies?.description}
                        companies={companies}
                        setCompanies={setCompanies}
                    />
                </div>
            </Card>

            <div className="grid grid-cols-3 items-start gap-5 mt-5">
                <Card className="col-span-2">
                    <h1 className="font-bold uppercase mb-5 text-blue-900">Alamat Perusahaan</h1>
                    <div className="grid grid-cols-2 gap-5">
                        <InputForm
                            name="street"
                            title="Alamat"
                            placeholder="Masukan Alamat Perusahaan"
                            value={companies.street}
                            companies={companies}
                            setCompanies={setCompanies}
                        />
                        <InputForm
                            name="city"
                            title="Kota"
                            placeholder="Masukan Kota Perusahaan"
                            value={companies.city}
                            companies={companies}
                            setCompanies={setCompanies}
                        />
                        <InputForm
                            name="province"
                            title="Provinsi"
                            placeholder="Masukan Kota Perusahaan"
                            value={companies.province}
                            companies={companies}
                            setCompanies={setCompanies}
                        />
                        <InputForm
                            name="country"
                            title="Negara"
                            placeholder="Masukan Kota Perusahaan"
                            value={companies.country}
                            companies={companies}
                            setCompanies={setCompanies}
                        />
                        <InputForm
                            name="postalCode"
                            title="Kode Pos"
                            placeholder="Masukan Kota Perusahaan"
                            value={companies.postalCode}
                            companies={companies}
                            setCompanies={setCompanies}
                        />
                    </div>
                </Card>
                <Card>
                    <h1 className="font-bold uppercase mb-5 text-blue-900">Sosial Media</h1>
                    <table className="table w-full">
                        <thead className="bg-blue-600 text-slate-50">
                            <tr className="border border-slate-900">
                                <th className="text-sm px-3 py-1 text-start">Sosial Media</th>
                                <th className="text-sm px-3 py-1 text-center">Opsi</th>
                            </tr>
                        </thead>
                        <tbody className="bg-transparent text-slate-900">
                            {companies.socialMedia?.map((media, index) => (
                                <tr key={index} className="border border-slate-900">
                                    <th className="text-sm px-3 py-1 text-start">{media.name}</th>
                                    <td className="text-sm px-3 py-1 flex items-center justify-center gap-2">
                                        {/* <Link href={media.url}>
                                            <IconSettings2 className="text-cyan-600" stroke={2} size={16} />
                                        </Link> */}
                                        <Link href={media.url} target="_blank">
                                            <IconLink stroke={2} size={16} />
                                        </Link>
                                        <button type="button" onClick={() => handlerDeletSosmed(media?.id)}>
                                            {loading ? (
                                                <IconLoader3 className="text-red-600 animate-spin" stroke={2} size={16} />
                                            ) : (
                                                <IconTrash className="text-red-600" stroke={2} size={16} />
                                            )}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="flex items-center justify-end">
                        <button
                            type="button"
                            onClick={addSosmed}
                            className="px-5 py-2 text-xs font-semibold bg-blue-900 text-slate-100 rounded mt-1 mb-3"
                        >
                            <div className="flex items-center justify-center gap-1">
                                <IconPlus size={16} stroke={2} />
                                <span>Social Media</span>
                            </div>
                        </button>
                    </div>

                    <div>
                        {sosmed.map((input, index) => (
                            <div className="flex items-center justify-center gap-2 mb-2" key={index}>
                                <input
                                    type={'text'}
                                    placeholder={'facebook, instagram atau tiktok'}
                                    name={'name'}
                                    value={input.name}
                                    className={`font-medium text-sm bg-slate-100 w-full border border-slate-300 text-slate-700 px-4 py-2 rounded-lg block mt-1`}
                                    autoComplete="off"
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleSosmedChange(e.target.value, e.target.name, index)}
                                />
                                <input
                                    type={'text'}
                                    placeholder={'Link Url Social Media'}
                                    name={'url'}
                                    value={input.url}
                                    className={`font-medium text-sm bg-slate-100 w-full border border-slate-300 text-slate-700 px-4 py-2 rounded-lg block mt-1`}
                                    autoComplete="off"
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleSosmedChange(e.target.value, e.target.name, index)}
                                />
                                <button type="button" onClick={() => removeSosmed(index)}>
                                    <IconTrash stroke={2} size={18} className="text-red-500" />
                                </button>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </form>
    );
}
