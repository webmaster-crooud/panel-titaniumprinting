import { Card } from '@/components/Card';
import Image from 'next/image';
import { DetailProducts } from '../../pages/products/[barcode]';
import React, { useRef, useState } from 'react';
import { IconLoader3, IconPlus, IconTransform, IconTrash, IconUpload, IconX } from '@tabler/icons-react';
import { useSetAtom } from 'jotai';
import { alertShow } from '../../../store/Atom';
import { BACKEND, PUBLIC } from '../../../lib/utils';
import { useAuthToken } from '../../../hooks/useAuthToken';
import { fetchWithAuth } from '../../../lib/fetchWithAuth';

type propsCoverImageProduct = {
    product?: DetailProducts;
    barcode: string;
    fetchProduct: () => Promise<void>;
};

const ImageProduct: React.FC<propsCoverImageProduct> = ({ product, barcode, fetchProduct }) => {
    const [modalImages, setModalImages] = useState<{ id: number } | undefined>(undefined);
    const [loading, setLoading] = useState(false);
    const setAlert = useSetAtom(alertShow);
    const imagesInputRef = useRef<HTMLInputElement>(null);

    const [images, setImages] = useState<{ name: string; source: string }>({ name: '', source: '' });
    const [fileImages, setFileImages] = useState<{ file: File; name: string }>();
    const [imagesPreview, setImagesPreview] = useState<string>('');
    const { token, refreshToken } = useAuthToken();

    const handleChangeImages = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (file) {
            const fileSize = file.size;
            const maxSize = 5120000; // 5MB

            if (fileSize > maxSize) {
                setAlert({ type: 'error', message: 'Ukuran file terlalu besar. Maksimal 5MB.' });
                return;
            }

            // Update cover and preview only after successful validation
            setImages({ name: `${file.name} Images by Titanium Printing`, source: `images-${file.name}` });
            setFileImages({ file: file, name: `images-${file.name}` });
            setImagesPreview(URL.createObjectURL(file));
        } else {
            // Handle cases where no file is selected (optional)
            setImages({ name: '', source: '' }); // Or set a default value for cover if needed
            setImagesPreview('');
        }
    };
    const submitUpdateImages = async (e: React.FormEvent<HTMLFormElement>, id: number) => {
        const formData = new FormData();

        formData.append('data', JSON.stringify(images));

        if (fileImages?.file) {
            formData.append('images', fileImages.file, fileImages.name);
        }
        e.preventDefault();
        setLoading(true);
        try {
            await new Promise((resolve) => setTimeout(resolve, 2000));
            const response = await fetchWithAuth(token, refreshToken, `${BACKEND}/products/update/images/${barcode}/${id}`, {
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
            setModalImages(undefined);
            setLoading(false);
        }
    };

    const deleteImage = async (id: number) => {
        setLoading(true);
        try {
            await new Promise((resolve) => setTimeout(resolve, 2000));
            const response = await fetchWithAuth(token, refreshToken, `${BACKEND}/products/delete/images/${barcode}/${id}`, {
                method: 'DELETE',
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

    const submitCreateImages = async (e: React.FormEvent<HTMLFormElement>) => {
        const formData = new FormData();

        formData.append('data', JSON.stringify(images));

        if (fileImages?.file) {
            formData.append('images', fileImages.file, fileImages.name);
        }
        e.preventDefault();
        setLoading(true);
        try {
            await new Promise((resolve) => setTimeout(resolve, 2000));
            const response = await fetchWithAuth(token, refreshToken, `${BACKEND}/products/create/images/${barcode}`, {
                method: 'POST',
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
            setModalImages(undefined);
            setLoading(false);
        }
    };

    return (
        <>
            {product?.images.map((images, index) => (
                <Card key={index}>
                    <h1 className="font-semibold text-sm mb-5">{images.name}</h1>
                    <div className="flex items-center justify-between mb-6">
                        <button
                            type="button"
                            onClick={() => setModalImages({ id: images.id })}
                            className="px-4 py-2 text-slate-100 font-semibold text-sm bg-sky-500 rounded-lg"
                        >
                            <div className="flex items-center justify-center gap-1">
                                <IconTransform size={16} stroke={2} /> <span>Ganti</span>
                            </div>
                        </button>
                        {/* Modal */}
                        {modalImages?.id === images.id && (
                            <div className="fixed top-0 left-0 right-0 w-full h-screen z-[22]">
                                <div className="flex items-center justify-center h-full w-full bg-black/10 backdrop-blur-sm">
                                    <Card className="w-6/12 mx-auto">
                                        <div className="flex items-center justify-end">
                                            <button onClick={() => setModalImages(undefined)}>
                                                <IconX size={25} stroke={2} />
                                            </button>
                                        </div>

                                        {/* Card body */}
                                        <form onSubmit={(e: React.FormEvent<HTMLFormElement>) => submitUpdateImages(e, images.id)}>
                                            <div className="my-5 grid grid-cols-2 gap-5">
                                                <div className="relative cursor-grab h-full">
                                                    <label
                                                        htmlFor="coverProduct"
                                                        className="text-sm font-semibold bg-slate-200 uppercase absolute -top-2.5 left-4"
                                                    >
                                                        Upload Images Produk
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
                                                                onChange={handleChangeImages}
                                                                ref={imagesInputRef}
                                                                accept="image/*"
                                                            />
                                                        </label>
                                                    </div>
                                                </div>
                                                <div className="relative">
                                                    <div className="w-full mx-auto">
                                                        {imagesPreview ? (
                                                            <Image src={imagesPreview} width={200} height={200} className="image" alt="preview" />
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

                        <button
                            type="button"
                            onClick={() => deleteImage(images.id)}
                            className="px-4 py-2 text-slate-100 font-semibold text-sm bg-red-500 rounded-lg"
                        >
                            <div className="flex items-center justify-center gap-1">
                                {loading ? (
                                    <>
                                        <IconLoader3 className="animate-spin" size={16} stroke={2} /> <span>Loading</span>
                                    </>
                                ) : (
                                    <>
                                        <IconTrash size={16} stroke={2} /> <span>Hapus</span>
                                    </>
                                )}
                            </div>
                        </button>
                    </div>
                    <div className="flex items-center justify-center">
                        {product && (
                            <>
                                <Image
                                    alt={`${images.name}`}
                                    src={`${PUBLIC}/images/${images.source}`}
                                    width={500}
                                    height={500}
                                    style={{ width: 'auto', height: 'auto' }}
                                    className="rounded-lg shadow-lg bg-slate-100 max-h-32"
                                    priority
                                />
                            </>
                        )}
                    </div>
                </Card>
            ))}
            <Card>
                <form onSubmit={submitCreateImages} className="relative cursor-grab h-full">
                    <label htmlFor="coverProduct" className="text-sm font-semibold bg-slate-200 uppercase absolute -top-2.5 left-4">
                        Upload Image Detail Produk
                    </label>

                    <div className="flex items-center justify-center w-full h-[85%] cursor-grab">
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
                                onChange={handleChangeImages}
                                ref={imagesInputRef}
                                accept="image/*"
                            />
                        </label>
                    </div>

                    <div className="flex items-center justify-end mt-5">
                        <button type="submit" className="px-4 py-2 text-slate-100 font-semibold text-sm bg-blue-500 rounded-lg">
                            <div className="flex items-center justify-center gap-1">
                                {loading ? (
                                    <>
                                        <IconLoader3 className="animate-spin" size={16} stroke={2} /> <span>Loading</span>
                                    </>
                                ) : (
                                    <>
                                        <IconUpload size={16} stroke={2} /> <span>Simpan</span>
                                    </>
                                )}
                            </div>
                        </button>
                    </div>
                </form>
            </Card>
            {imagesPreview && (
                <Card>
                    <div className="relative h-full">
                        <div className="w-full mx-auto h-full flex items-center justify-center">
                            {imagesPreview ? <Image src={imagesPreview} width={200} height={200} className="image" alt="preview" /> : null}
                        </div>
                    </div>
                </Card>
            )}
        </>
    );
};

export default ImageProduct;
