import { Card } from '@/components/Card';
import { IconCaretRight, IconLoader3, IconX } from '@tabler/icons-react';
import React from 'react';

type propsComponentsModal = {
    modal: boolean;
    setModal: any;
    addPrice: boolean;
    setAddPrice: any;
    name: string;
    setAlert: any;
    setErrorValidation: any;
    submitCreate: any;
    loading: any;
};

const ComponentsModal: React.FC<propsComponentsModal> = ({
    modal,
    setModal,
    addPrice,
    setAddPrice,
    name,
    setAlert,
    setErrorValidation,
    submitCreate,
    loading,
}) => {
    const handlerNext = () => {
        if (!name) {
            setAlert({ type: 'error', message: 'Nama Komponen tidak boleh kosong!' });
            setErrorValidation({ type: 'name', message: 'Nama Komponen Tidak boleh kosong!' });
            return;
        } else {
            setModal(true);
        }
    };
    return (
        <>
            <div className="flex justify-end">
                {!addPrice && (
                    <button
                        type="button"
                        onClick={handlerNext}
                        className="mt-5 text-sm font-semibold px-3 py-2 bg-blue-600 text-slate-100 rounded-lg"
                    >
                        <div className="flex items-center justify-center gap-1">
                            Selanjutnya <IconCaretRight size={18} />
                        </div>
                    </button>
                )}
            </div>

            {/* Modal */}
            {modal && (
                <div className="fixed top-0 left-0 w-full h-screen bg-black/20 z-20 flex items-center justify-center">
                    <Card className="w-5/12">
                        <div className="flex justify-end">
                            <button type="button" onClick={() => setModal(false)}>
                                <IconX size={30} stroke={2} className="text-slate-700" />
                            </button>
                        </div>

                        <div className="mt-4">
                            {loading ? (
                                <div className="flex items-center justify-center w-full h-full">
                                    <div className="flex flex-row items-center justify-center">
                                        <IconLoader3 className="animate-spin" size={30} stroke={3} />

                                        <p className="text-sm font-semibold text-center text-slate-600 animate-bounce">
                                            Halaman Sedang di prosesData, harap menunggu...
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    Apakah komponen ini memiliki kualitas, ukuran dan dapat digunakan sebagai dasar material dalam pembuatan sebuah
                                    produk?
                                </>
                            )}
                        </div>

                        <div className="flex items-center justify-end gap-3 mt-5">
                            <button
                                type="button"
                                onClick={() => {
                                    setModal(false);
                                    setAddPrice(true);
                                }}
                                className="px-5 py-2 bg-red-600 text-slate-100 rounded-lg text-sm font-semibold"
                            >
                                Tidak
                            </button>
                            <button type="submit" className="px-5 py-2 bg-blue-600 text-slate-100 rounded-lg text-sm font-semibold">
                                Ya
                            </button>
                        </div>
                    </Card>
                </div>
            )}
        </>
    );
};

export default ComponentsModal;
