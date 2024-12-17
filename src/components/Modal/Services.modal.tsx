import { IconCheck, IconCirclePlus, IconLoader3, IconTransform, IconTrash, IconUpload, IconX } from '@tabler/icons-react';
import React, { useEffect, useState } from 'react';
import { Tooltip } from 'react-tippy';
import { Card } from '@/components/Card';
import { BACKEND } from '../../../lib/utils';
import { useSetAtom } from 'jotai';
import { alertShow } from '../../../store/Atom';
import { useAuthToken } from '../../../hooks/useAuthToken';
import { fetchWithAuth } from '../../../lib/fetchWithAuth';

interface Services {
    barcodeService: number | string;
}

type propsServicesProductModal = {
    barcodeService: string | number;
    barcode: string | number;
    fetchProduct: () => Promise<void>;
};

type propsServicesCreateProductModal = {
    fetchProduct: () => Promise<void>;
    barcode: string | number;
};

export const ServicesUpdateProductModal: React.FC<propsServicesProductModal> = ({ barcodeService, barcode, fetchProduct }) => {
    const [modal, setModal] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [services, setServices] = useState<Services>({ barcodeService: barcodeService });
    const [serviceList, setServiceList] = useState<{ barcode: number; name: string }[]>([]);
    const setAlert = useSetAtom(alertShow);

    const { token, refreshToken } = useAuthToken();
    useEffect(() => {
        const fetchServiceList = async () => {
            try {
                const response = await fetchWithAuth(token, refreshToken, `${BACKEND}/services`);
                const result = await response.json();
                if (result.error === true) {
                    setAlert({ type: 'error', message: result.message });
                }
                setServiceList(result.data);
            } catch (error) {
                setAlert({ type: 'error', message: `${error}` });
            }
        };
        fetchServiceList();
    }, [setAlert, token, refreshToken]);

    const OptionService = () => {
        if (serviceList) {
            return serviceList.map((service, index) => (
                <option value={service.barcode} key={index}>
                    {service.name}
                </option>
            ));
        }
    };

    const submitUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        try {
            await new Promise((resolve) => setTimeout(resolve, 1500));
            const response = await fetchWithAuth(token, refreshToken, `${BACKEND}/products/update/service/${barcode}/${barcodeService}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(services),
            });
            const result = await response.json();
            if (result.error === true) {
                setAlert({ type: 'error', message: result.message });
            } else {
                setAlert({ type: 'success', message: result.message });
                setModal(false);
                fetchProduct();
            }
        } catch (error) {
            setAlert({ type: 'error', message: `${error}` });
        } finally {
            setLoading(false);
        }
    };
    return (
        <>
            <Tooltip title="Perubahan" size="small" position="top" arrow>
                <button className="text-blue-500" type="button" onClick={() => setModal(true)}>
                    <IconTransform size={17} stroke={2} />
                </button>
            </Tooltip>

            {/* Update Modal */}
            {modal && (
                <div className="fixed top-0 left-0 right-0 w-full h-screen z-[22]">
                    <div className="flex items-center justify-center h-full w-full bg-black/10 backdrop-blur-sm">
                        <Card className="w-4/12 mx-auto">
                            <div className="flex items-center justify-end">
                                <button onClick={() => setModal(false)}>
                                    <IconX size={25} stroke={2} />
                                </button>
                            </div>

                            {/* Card body */}
                            <form onSubmit={submitUpdate}>
                                <div className="my-5">
                                    <div className="relative mb-6">
                                        <label
                                            htmlFor="nameServicee"
                                            className="uppercase text-sm font-semibold text-slate-800 bg-slate-200 absolute -top-2.5 left-3"
                                        >
                                            Layanan Produk
                                        </label>
                                        <select
                                            name="barcodeService"
                                            className="px-3 py-2 text-sm appearance-none text-center bg-slate-200 w-full border-2 border-slate-800 rounded-lg outline-none"
                                            value={services.barcodeService}
                                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setServices({ barcodeService: e.target.value })}
                                        >
                                            <OptionService />
                                        </select>
                                    </div>
                                </div>

                                <div className="flex items-center justify-end">
                                    <button
                                        disabled={loading}
                                        type="submit"
                                        className="px-3 py-2 text-sm text-slate-100 bg-sky-500 rounded-lg disabled:opacity-70"
                                    >
                                        <div className="flex items-center justify-center gap-1">
                                            {loading ? (
                                                <IconLoader3 className="animate-spin" size={17} stroke={2} />
                                            ) : (
                                                <IconUpload size={17} stroke={2} />
                                            )}{' '}
                                            <span>Simpan</span>
                                        </div>
                                    </button>
                                </div>
                            </form>
                        </Card>
                    </div>
                </div>
            )}
        </>
    );
};

export const ServicesCreateProductModal: React.FC<propsServicesCreateProductModal> = ({ fetchProduct, barcode }) => {
    const [modalCreate, setModalCreate] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [services, setServices] = useState<Services>({ barcodeService: '' });
    const [serviceList, setServiceList] = useState<{ barcode: number; name: string }[]>([]);
    const setAlert = useSetAtom(alertShow);

    const { token, refreshToken } = useAuthToken();
    useEffect(() => {
        const fetchServiceList = async () => {
            try {
                const response = await fetchWithAuth(token, refreshToken, `${BACKEND}/Services`);
                const result = await response.json();
                if (result.error === true) {
                    setAlert({ type: 'error', message: result.message });
                }
                setServiceList(result.data);
            } catch (error) {
                setAlert({ type: 'error', message: `${error}` });
            }
        };
        fetchServiceList();
    }, [setAlert, token, refreshToken]);

    const Optionservice = () => {
        if (serviceList) {
            return serviceList.map((service, index) => (
                <option value={service.barcode} key={index}>
                    {service.name}
                </option>
            ));
        }
    };
    const submitCreate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        try {
            await new Promise((resolve) => setTimeout(resolve, 1500));
            const response = await fetchWithAuth(token, refreshToken, `${BACKEND}/products/services/create`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    barcodeService: services.barcodeService,
                    barcodeProduct: barcode,
                }),
            });
            const result = await response.json();
            if (result.error === true) {
                setAlert({ type: 'error', message: result.message });
            } else {
                setAlert({ type: 'success', message: result.message });
                setModalCreate(false);
                fetchProduct();
            }
        } catch (error) {
            setAlert({ type: 'error', message: `${error}` });
        } finally {
            setLoading(false);
        }
    };
    return (
        <>
            <button className="bg-blue-500 text-slate-100 px-3 py-1 mt-1 text-sm rounded-full" type="button" onClick={() => setModalCreate(true)}>
                <div className="flex items-center justify-center gap-1">
                    <IconCirclePlus size={17} stroke={2} /> <span>Tambah Layanan</span>
                </div>
            </button>

            {/* Update Modal */}
            {modalCreate && (
                <div className="fixed top-0 left-0 right-0 w-full h-screen z-[22]">
                    <div className="flex items-center justify-center h-full w-full bg-black/10 backdrop-blur-sm">
                        <Card className="w-4/12 mx-auto">
                            <div className="flex items-center justify-end">
                                <button onClick={() => setModalCreate(false)}>
                                    <IconX size={25} stroke={2} />
                                </button>
                            </div>

                            {/* Card body */}
                            <form onSubmit={submitCreate}>
                                <div className="my-5">
                                    <div className="relative mb-6">
                                        <label
                                            htmlFor="nameProduct"
                                            className="uppercase text-sm font-semibold text-slate-800 bg-slate-200 absolute -top-2.5 left-3"
                                        >
                                            Layanan Produk
                                        </label>
                                        <select
                                            name="barcodeService"
                                            className="px-3 py-2 text-sm appearance-none text-center bg-slate-200 w-full border-2 border-slate-800 rounded-lg outline-none"
                                            value={services.barcodeService}
                                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setServices({ barcodeService: e.target.value })}
                                        >
                                            <option value={undefined} selected>
                                                --Pilih Layanan---
                                            </option>
                                            <Optionservice />
                                        </select>
                                    </div>
                                </div>

                                <div className="flex items-center justify-end">
                                    <button
                                        disabled={loading}
                                        type="submit"
                                        className="px-3 py-2 text-sm text-slate-100 bg-sky-500 rounded-lg disabled:opacity-70"
                                    >
                                        <div className="flex items-center justify-center gap-1">
                                            {loading ? (
                                                <IconLoader3 className="animate-spin" size={17} stroke={2} />
                                            ) : (
                                                <IconUpload size={17} stroke={2} />
                                            )}{' '}
                                            <span>Simpan</span>
                                        </div>
                                    </button>
                                </div>
                            </form>
                        </Card>
                    </div>
                </div>
            )}
        </>
    );
};
export const ServicesDeletedProductModal: React.FC<propsServicesProductModal> = ({ barcodeService, barcode, fetchProduct }) => {
    const [modalDelete, setModalDelete] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const setAlert = useSetAtom(alertShow);

    const { token, refreshToken } = useAuthToken();
    const submitDelete = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        try {
            await new Promise((resolve) => setTimeout(resolve, 1500));
            const response = await fetchWithAuth(token, refreshToken, `${BACKEND}/products/delete/services/${barcode}/${barcodeService}`, {
                method: 'DELETE',
            });
            const result = await response.json();
            if (result.error === true) {
                setAlert({ type: 'error', message: result.message });
            } else {
                setAlert({ type: 'success', message: result.message });
                setModalDelete(false);
                fetchProduct();
            }
        } catch (error) {
            setAlert({ type: 'error', message: `${error}` });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Tooltip title="Hapus" size="small" position="top" arrow>
                <button className="text-red-500" type="button" onClick={() => setModalDelete(true)}>
                    <IconTrash size={16} stroke={2} />
                </button>
            </Tooltip>

            {/* Modal */}
            {modalDelete && (
                <div className="fixed top-0 left-0 right-0 w-full h-screen z-[22]">
                    <div className="flex items-center justify-center h-full w-full bg-black/10 backdrop-blur-sm">
                        <Card className="w-4/12 mx-auto">
                            <div className="flex items-center justify-end">
                                <button onClick={() => setModalDelete(false)}>
                                    <IconX size={25} stroke={2} />
                                </button>
                            </div>

                            {/* Card body */}
                            <form onSubmit={submitDelete}>
                                <div className="my-5">
                                    <p className="text-base font-medium">Apakah anda yakin menghapus Layanan ini?</p>
                                </div>

                                <div className="flex items-center justify-end">
                                    <button
                                        disabled={loading}
                                        type="submit"
                                        className="px-3 py-2 text-sm text-slate-100 bg-sky-500 rounded-lg disabled:opacity-70"
                                    >
                                        <div className="flex items-center justify-center gap-1">
                                            {loading ? (
                                                <IconLoader3 className="animate-spin" size={17} stroke={2} />
                                            ) : (
                                                <IconCheck className="animate-pulse" size={17} stroke={2} />
                                            )}{' '}
                                            <span>Hapus</span>
                                        </div>
                                    </button>
                                </div>
                            </form>
                        </Card>
                    </div>
                </div>
            )}
        </>
    );
};
