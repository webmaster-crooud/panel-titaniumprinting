import { Card } from '@/components/Card';
import Image from 'next/image';
import { DetailProducts } from '../[barcode]';
import React, { useRef, useState } from 'react';
import { BACKEND, PUBLIC } from '../../../../lib/utils';
import { IconLoader3, IconPlus, IconTransform, IconUpload, IconX } from '@tabler/icons-react';
import { useSetAtom } from 'jotai';
import { alertShow } from '../../../../store/Atom';

type propsCoverImageProduct = {
    product?: DetailProducts;
    barcode: string;
    fetchProduct: () => Promise<void>;
};

const CoverImageProduct: React.FC<propsCoverImageProduct> = ({ product, barcode, fetchProduct }) => {
    const [modalCover, setModalCover] = useState(false);
    const [loading, setLoading] = useState(false);
    const coverInputRef = useRef<HTMLInputElement>(null);
    const setAlert = useSetAtom(alertShow);

    const [cover, setCover] = useState<string | undefined>(product ? product.cover : undefined);
    const [fileCover, setFileCover] = useState<{ file: File; name: string }>();
    const [coverPreview, setCoverPreview] = useState<string>('');

    const handleChangeCover = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (file) {
            const fileSize = file.size;
            const maxSize = 5120000; // 5MB

            if (fileSize > maxSize) {
                setAlert({ type: 'error', message: 'Ukuran file terlalu besar. Maksimal 5MB.' });
                return;
            }

            // Update cover and preview only after successful validation
            setCover(`cover-${new Date().getTime()}-${file.name}`);
            setFileCover({ file: file, name: `cover-${new Date().getTime()}-${file.name}` });
            setCoverPreview(URL.createObjectURL(file));
        } else {
            // Handle cases where no file is selected (optional)
            setCover(''); // Or set a default value for cover if needed
            setCoverPreview('');
        }
    };

    const submitUpdateCover = async (e: React.FormEvent<HTMLFormElement>) => {
        const formData = new FormData();

        formData.append(
            'data',
            JSON.stringify({
                cover: cover,
            }),
        );

        if (fileCover?.file) {
            formData.append('images', fileCover.file, fileCover.name);
        }
        e.preventDefault();
        setLoading(true);
        try {
            await new Promise((resolve) => setTimeout(resolve, 2000));
            const response = await fetch(`${BACKEND}/products/update/cover/${barcode}`, {
                method: 'PATCH',
                // headers: {
                //     'Content-Type': 'multipart/form-data', // Set content type
                // },
                body: formData,
            });
            const result = await response.json();
            if (result.error === true) {
                setAlert({ type: 'error', message: result.message });
            } else {
                setAlert({ type: 'success', message: result.message });
                fetchProduct();
            }
        } catch (error) {
            setAlert({ type: 'error', message: `${error}` });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card>
            <div className="flex items-center justify-between mb-6">
                <h1 className="font-semibold">Cover Produk</h1>

                <div className="flex items-center justify-end gap-5">
                    <button
                        type="button"
                        onClick={() => setModalCover(true)}
                        className="px-4 py-2 text-slate-100 font-semibold text-sm bg-sky-500 rounded-lg"
                    >
                        <div className="flex items-center justify-center gap-1">
                            <IconTransform size={16} stroke={2} /> <span>Ganti</span>
                        </div>
                    </button>

                    {/* Modal */}
                    {modalCover && (
                        <div className="fixed top-0 left-0 right-0 w-full h-screen z-[22]">
                            <div className="flex items-center justify-center h-full w-full bg-black/10 backdrop-blur-sm">
                                <Card className="w-6/12 mx-auto">
                                    <div className="flex items-center justify-end">
                                        <button onClick={() => setModalCover(false)}>
                                            <IconX size={25} stroke={2} />
                                        </button>
                                    </div>

                                    {/* Card body */}
                                    <form onSubmit={submitUpdateCover}>
                                        <div className="my-5 grid grid-cols-2 gap-5">
                                            <div className="relative cursor-grab h-full">
                                                <label
                                                    htmlFor="coverProduct"
                                                    className="text-sm font-semibold bg-slate-200 uppercase absolute -top-2.5 left-4"
                                                >
                                                    Upload Cover Produk
                                                </label>
                                                <div className="flex items-center justify-center w-full h-full cursor-grab">
                                                    <label
                                                        htmlFor="dropzone-file"
                                                        className="flex flex-col items-center justify-center w-full h-full border-2 border-slate-900 border-dashed rounded-lg cursor-grab bg-slate-200 hover:bg-slate-100 transition-all ease-in-out duration-300"
                                                    >
                                                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                            <IconPlus size={25} stroke={2} className="text-slate-500" />
                                                            <p className="mb-2 text-sm text-slate-500">
                                                                <span className="font-semibold">Click to upload</span> or drag and drop
                                                            </p>
                                                            <p className="text-xs text-slate-500">PNG, JPG or JPEG (MAX. 5MB)</p>
                                                        </div>
                                                        <input
                                                            id="dropzone-file"
                                                            type="file"
                                                            className="w-full h-full absolute top-0 z-10 opacity-0 cursor-grab"
                                                            onChange={handleChangeCover}
                                                            ref={coverInputRef}
                                                            accept="image/*"
                                                        />
                                                    </label>
                                                </div>
                                            </div>
                                            <div className="relative">
                                                <div className="w-full mx-auto">
                                                    {coverPreview ? (
                                                        <Image src={coverPreview} width={200} height={200} className="image" alt="preview" />
                                                    ) : null}
                                                </div>
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
                </div>
            </div>
            <div className="flex items-center justify-center">
                {product ? (
                    <Image
                        alt={`${product.name} Cover`}
                        src={`${PUBLIC}/cover/${product.cover}`}
                        width={500}
                        height={500}
                        style={{ width: 'auto', height: 'auto' }}
                        className="rounded-lg shadow-lg"
                        priority
                    />
                ) : (
                    <Image
                        alt={`No Cover by dummy image`}
                        src={`${PUBLIC}/cover/no-image.png`}
                        width={500}
                        height={500}
                        style={{ width: 'auto', height: 'auto' }}
                        className="rounded-lg shadow-lg"
                    />
                )}
            </div>
        </Card>
    );
};
export default CoverImageProduct;
