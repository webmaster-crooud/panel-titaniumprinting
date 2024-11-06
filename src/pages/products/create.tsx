import { Card } from '@/components/Card';
import { IconCirclePlus, IconCloudUpload, IconLoader3, IconPlugConnected, IconPlus, IconUpload, IconX } from '@tabler/icons-react';
import { useSetAtom } from 'jotai';
import Image from 'next/image';
import React, { useEffect, useId, useRef, useState } from 'react';
import { alertShow } from '../../../store/Atom';
import Select from 'react-select';
import { BACKEND } from '../../../lib/utils';
import { NavigationCard } from '@/components/Card/Navigation.card';
import Link from 'next/link';
import { useRouter } from 'next/router';

interface ServicesList {
    name?: string;
    barcode: string;
}

interface ServicesSelected {
    barcodeService: string;
}

interface CategoriesList {
    id: number;
    name: string;
}

interface CategoriesSelected {
    categoryId: number;
}

interface ComponentsList {
    id: string;
    name: string;
    price?: number | string | null;
    cogs?: number | string | null;
    typeComponent?: string;
}

interface ProductComponent {
    componentId: string | number;
    minQty: string | number;
    typePieces: string | number;
}

interface Images {
    name: string;
    source: string;
}

interface FileImage {
    name: string;
    file: File;
}

const navCard = [
    { title: 'List Produk', url: '/products' },
    { title: 'Tambah Produk', url: '/products/create' },
    { title: 'Disabled Produk', url: '/products/disabled' },
];

// Definisikan type untuk preview image
type ImagePreview = {
    name: string;
    url: string;
};

interface FormProduct {
    name: string;
    slug?: string;
    description?: string;
    cover?: string;
    totalPrice: number;
    totalCogs: number;
    images: Images[];
    categoryProduct: CategoriesSelected[];
    serviceProduct: ServicesSelected[];
    productComponent: ProductComponent[];
}
export default function CreateProductPage() {
    const router = useRouter();
    const selectedId = useId();
    const coverInputRef = useRef<HTMLInputElement>(null);
    const imagesInputRef = useRef<HTMLInputElement>(null);

    const [coverPreview, setCoverPreview] = useState<string>('');
    const [imagesPreview, setImagesPreview] = useState<ImagePreview[]>([]);
    const [servicesList, setServicesList] = useState<ServicesList[]>([{ name: '', barcode: '' }]);
    const [categoriesList, setCategoriesList] = useState<CategoriesList[]>([{ name: '', id: 0 }]);
    const [componentsList, setComponentsList] = useState<ComponentsList[]>([{ id: '', name: '' }]);
    const setAlert = useSetAtom(alertShow);
    const [inputSlug, setInputSlug] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    const [loading, setLoading] = useState(false);

    // Form Data
    const [serviceSelected, setServiceSelected] = useState<ServicesSelected[]>([{ barcodeService: '' }]);
    const [categoriesSelected, setCategoriesSelected] = useState<CategoriesSelected[]>([{ categoryId: 0 }]);
    const [name, setName] = useState<string>('');
    const [slug, setSlug] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [cover, setCover] = useState<string | undefined>(undefined);
    const [fileCover, setFileCover] = useState<{ file: File; name: string }>();
    const [images, setImages] = useState<Images[]>([]);
    const [fileImages, setFileImage] = useState<FileImage[]>([]);
    const [productComponent, setProductComponent] = useState<ProductComponent[]>([{ componentId: '', minQty: '', typePieces: '' }]);

    // fetch List Services
    useEffect(() => {
        const fetchServicesList = async () => {
            const response = await fetch(`${BACKEND}/products/services`);
            const result = await response.json();
            if (result.error === true) {
                setAlert({ type: 'error', message: result.error });
                return;
            } else {
                setServicesList(result.data);
            }
        };
        fetchServicesList();
    }, [setAlert]);
    const optionsService = servicesList.map((service) => ({
        value: service.barcode,
        label: service.name,
    }));

    // fetch List Categories
    useEffect(() => {
        const fetchCategoriesList = async () => {
            const response = await fetch(`${BACKEND}/products/categories`);
            const result = await response.json();
            if (result.error === true) {
                setAlert({ type: 'error', message: result.error });
                return;
            } else {
                setCategoriesList(result.data);
            }
        };
        fetchCategoriesList();
    }, [setAlert]);
    const optionCategories = categoriesList.map((category) => ({
        value: category.id,
        label: category.name,
    }));

    // fetch List Components
    useEffect(() => {
        const fetchComponentsList = async () => {
            const response = await fetch(`${BACKEND}/products/components`);
            const result = await response.json();
            if (result.error === true) {
                setAlert({ type: 'error', message: result.error });
                return;
            } else {
                setComponentsList(result.data);
            }
        };
        fetchComponentsList();
    }, [setAlert]);

    const handleChangeSelectedService = (values: any) => {
        setServiceSelected(
            values.map(({ value }: { value: string }) => ({
                barcodeService: value,
            })),
        );
    };

    const handleChangeSelectedCategory = (values: any) => {
        setCategoriesSelected(
            values.map(({ value }: { value: number }) => ({
                categoryId: value,
            })),
        );
    };

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

    const handleChangeImages = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) {
            return;
        } else {
            const file = e.target.files?.[0];
            if (file) {
                const fileSize = file.size;
                const maxSize = 5120000; // 5MB

                if (fileSize > maxSize) {
                    setAlert({ type: 'error', message: 'Ukuran file terlalu besar. Maksimal 5MB.' });
                    return;
                }

                const filesImage = Array.from(e.target.files);
                const result = filesImage.map((image) => ({
                    name: `${image.name} Images by Titanium Printing`,
                    source: `images-${new Date().getTime()}-${image.name}`,
                }));

                const resultFile = filesImage.map((image) => ({
                    name: `images-${new Date().getTime()}-${image.name}`,
                    file: file,
                }));

                setImages((prevImages) => [...prevImages, ...result]);
                setFileImage((prevImages) => [...prevImages, ...resultFile]);

                // Handle preview images
                filesImage.forEach((file) => {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        setImagesPreview((prevPreviews) => [
                            ...prevPreviews,
                            {
                                name: file.name,
                                url: reader.result as string,
                            },
                        ]);
                    };
                    reader.readAsDataURL(file);
                });
            }
        }
    };

    // Fungsi untuk menghapus image dan preview
    const handleRemoveImage = (index: number) => {
        setImages((prevImages) => prevImages.filter((_, i) => i !== index));
        setImagesPreview((prevPreviews) => prevPreviews.filter((_, i) => i !== index));
    };

    const handlerAddNewSize = () => {
        const addProductsComponent: ProductComponent = { componentId: '', minQty: '', typePieces: '' };
        setProductComponent([...productComponent, addProductsComponent]);
    };
    const removeFields = (index: number) => {
        const data = [...productComponent];
        data.splice(index, 1);
        setProductComponent(data);
    };

    type ProductComponentKeys = keyof ProductComponent;
    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, index: number) => {
        const data = [...productComponent];
        const key = e.target.name as ProductComponentKeys;

        if (key in data[index]) {
            data[index][key] = e.target.value;
        } else {
            // Handle invalid property access, e.g., log an error or ignore
            console.error(`Invalid property: ${key}`);
        }

        setProductComponent(data);
    };

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const dataProduct: FormProduct = {
        name,
        description,
        totalCogs: 0,
        totalPrice: 0,
        slug,
        cover,
        categoryProduct: categoriesSelected,
        images,
        serviceProduct: serviceSelected,
        productComponent: productComponent,
    };

    const submitCreateProduct = async (e: React.FormEvent<HTMLFormElement>) => {
        if (!dataProduct.name && !dataProduct.categoryProduct && !dataProduct.serviceProduct && !dataProduct.productComponent) {
            setAlert({ type: 'error', message: 'Data produk masih ada yang kosong!' });
        } else {
            const formData = new FormData();

            formData.append('data', JSON.stringify(dataProduct));
            fileImages.forEach((image) => {
                if (image) {
                    formData.append('images', image.file, image.name);
                }
            });
            if (fileCover) {
                formData.append('images', fileCover.file, fileCover.name);
            }

            e.preventDefault();

            setLoading(true);
            try {
                console.log(formData);
                await new Promise((resolve) => setTimeout(resolve, 2000));
                const response = await fetch(`${BACKEND}/products`, {
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
                    router.push('/products');
                }
            } catch (error) {
                setAlert({ type: 'error', message: `${error}` });
            } finally {
                setLoading(false);
            }
        }
    };

    console.log(dataProduct);
    console.log(fileImages);
    return (
        <>
            <NavigationCard navCard={navCard} />
            <form onSubmit={submitCreateProduct} className="grid grid-cols-3 gap-5 items-start">
                <Card className="col-span-2 rounded-tl-none">
                    <h1 className="text-lg font-semibold mb-8">Formulir Data Produk</h1>
                    <div className="grid grid-cols-2 gap-5">
                        <div>
                            <label htmlFor="serviceProducts" className="text-sm mb-3 font-semibold bg-slate-200 uppercase">
                                Layanan Produk
                            </label>
                            {isMounted && (
                                <div className="flex items-center justify-center gap-2">
                                    <Select
                                        options={optionsService}
                                        isMulti
                                        isSearchable
                                        aria-describedby={`select-category-${selectedId}`}
                                        instanceId={selectedId}
                                        placeholder={'Pilih layanan'}
                                        className="z-[21] w-full"
                                        onChange={(values) => handleChangeSelectedService(values)}
                                    />
                                    <Link href="/services/create" className="px-3 py-2 bg-sky-500 rounded text-white">
                                        <IconPlus size={20} stroke={2} />
                                    </Link>
                                </div>
                            )}
                        </div>
                        <div>
                            <label htmlFor="categoryProducts" className="text-sm font-semibold bg-slate-200 uppercase">
                                Kategori Produk
                            </label>
                            {isMounted && (
                                <div className="flex items-center justify-center gap-2">
                                    <Select
                                        options={optionCategories}
                                        isMulti
                                        isSearchable
                                        placeholder={'Pilih kategori'}
                                        aria-describedby={`select-category-${selectedId}`}
                                        onChange={(values) => handleChangeSelectedCategory(values)}
                                        instanceId={selectedId}
                                        className="w-full"
                                    />
                                    <Link href="/categories/create" className="px-3 py-2 bg-sky-500 rounded text-white">
                                        <IconPlus size={20} stroke={2} />
                                    </Link>
                                </div>
                            )}
                        </div>

                        <div className="relative">
                            <label htmlFor="nameProducts" className="text-sm font-semibold bg-slate-200 uppercase">
                                Nama Produk
                            </label>

                            <div className="flex items-center justify-center">
                                <input
                                    autoComplete="off"
                                    type="text"
                                    required
                                    autoFocus
                                    className="w-full px-3 py-2 text-sm rounded bg-gray-50 rounded-r-none border-r-0 outline-none"
                                    placeholder="Masukan nama produk..."
                                    value={name}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                                />
                                <button
                                    onClick={() => setInputSlug(!inputSlug)}
                                    type="button"
                                    className="px-3 py-2 text-sm rounded-l-none bg-sky-600 text-slate-200 border-l-0 rounded"
                                >
                                    <div className="flex items-center justify-center gap-1">
                                        <IconPlugConnected size={16} stroke={2} /> Slug
                                    </div>
                                </button>
                            </div>
                        </div>
                        {inputSlug ? (
                            <div className="relative">
                                <label htmlFor="slugProduct" className="text-sm font-semibold bg-slate-200 uppercase">
                                    Slug Produk
                                </label>

                                <input
                                    type="text"
                                    className="w-full px-3 py-2 text-sm rounded bg-gray-50 outline-none"
                                    autoComplete="off"
                                    placeholder="Masukan slug produk..."
                                    value={slug}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSlug(e.target.value)}
                                />
                            </div>
                        ) : (
                            <div></div>
                        )}

                        <div className="relative col-span-2">
                            <label htmlFor="descriptionProduct" className="text-sm font-semibold bg-slate-200 uppercase">
                                Deskripsi Produk
                            </label>
                            <textarea
                                name="description"
                                className="w-full px-3 py-2 text-sm rounded bg-gray-50 border border-slate-300"
                                value={description}
                                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                                    setDescription(e.target.value);
                                    if (description.length === 1000) {
                                        setAlert({ type: 'error', message: 'Deskripsi tidak boleh lebih dari 1000' });
                                    }
                                }}
                                placeholder="Masukan deskripsi produk..."
                                rows={5}
                            />
                            <small className="font-semibold flex items-center justify-end">{description.length}/1000</small>
                        </div>

                        <div className="relative cursor-grab">
                            <label htmlFor="coverProduct" className="text-sm font-semibold bg-slate-200 uppercase absolute -top-2.5 left-4">
                                Upload Cover Produk
                            </label>
                            <div className="flex items-center justify-center w-full cursor-grab">
                                <label
                                    htmlFor="dropzone-file"
                                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-900 border-dashed rounded-lg cursor-grab bg-slate-200 hover:bg-slate-100 transition-all ease-in-out duration-300"
                                >
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <svg
                                            className="w-8 h-8 mb-4 text-slate-500 dark:text-slate-400"
                                            aria-hidden="true"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 20 16"
                                        >
                                            <path
                                                stroke="currentColor"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                                            />
                                        </svg>
                                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                            <span className="font-semibold">Click to upload</span> or drag and drop
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG or JPEG (MAX. 5MB)</p>
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
                            <div className="w-3/12 mx-auto">
                                {coverPreview ? <Image src={coverPreview} width={200} height={200} className="image" alt="preview" /> : null}
                            </div>
                        </div>

                        <div className="relative cursor-grab">
                            <label htmlFor="coverProduct" className="text-sm font-semibold bg-slate-200 uppercase absolute -top-2.5 left-4">
                                Upload Image Detail Produk
                            </label>
                            <div></div>
                            <div className="flex items-center justify-center w-full cursor-grab">
                                <label
                                    htmlFor="dropzone-file"
                                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-900 border-dashed rounded-lg cursor-grab bg-slate-200 hover:bg-slate-100 transition-all ease-in-out duration-300"
                                >
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <svg
                                            className="w-8 h-8 mb-4 text-slate-500 dark:text-slate-400"
                                            aria-hidden="true"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 20 16"
                                        >
                                            <path
                                                stroke="currentColor"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                                            />
                                        </svg>
                                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                            <span className="font-semibold">Click to upload</span> or drag and drop
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG or JPEG (MAX. 5MB)</p>
                                    </div>
                                    <input
                                        id="dropzone-file"
                                        type="file"
                                        className="w-full h-full absolute top-0 z-10 opacity-0 cursor-grab"
                                        multiple
                                        onChange={handleChangeImages}
                                        ref={imagesInputRef}
                                        accept="image/*"
                                    />
                                </label>
                            </div>
                        </div>
                        <div></div>
                        <div className="relative col-span-2">
                            {/* Preview images */}
                            <div className="grid grid-cols-6 gap-4 mt-4">
                                {imagesPreview.map((preview, index) => (
                                    <div key={index} className="relative">
                                        <Image
                                            width={200}
                                            height={200}
                                            style={{ height: 'auto', width: 'auto' }}
                                            src={preview.url}
                                            alt={preview.name}
                                            className="w-full h-48 object-cover rounded"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveImage(index)}
                                            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
                                        >
                                            <IconX size={20} stroke={2} />
                                        </button>
                                        <p className="text-sm mt-1 text-center truncate">{preview.name}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-end">
                        <button
                            disabled={loading}
                            className="flex items-center justify-center gap-1 disabled:opacity-75 px-4 py-2 text-sm bg-sky-500 rounded text-slate-100 font-semibold"
                        >
                            {loading ? (
                                <>
                                    <IconLoader3 size={18} stroke={2} className="animate-spin" />
                                    <span>Loading...</span>
                                </>
                            ) : (
                                <>
                                    <IconCloudUpload size={18} stroke={2} />
                                    <span>Simpan</span>
                                </>
                            )}
                        </button>
                    </div>
                </Card>
                <div>
                    {productComponent.map((component, index) => (
                        <Card key={index} className="mb-5">
                            {productComponent.length > 1 && (
                                <div className="flex items-center justify-end">
                                    <button type="button" onClick={() => removeFields(index)}>
                                        <IconX size={20} stroke={2} />
                                    </button>
                                </div>
                            )}
                            <div>
                                <label htmlFor="componentsProducts" className="text-sm font-semibold bg-slate-200 uppercase">
                                    Komponen Produk
                                </label>

                                <div className="flex items-center justify-center gap-2">
                                    <select
                                        name="componentId"
                                        className="w-full px-3 py-2 text-sm rounded bg-gray-50 outline-none border-2 border-slate-300 appearance-none"
                                        value={component.componentId}
                                        onChange={(e) => handleFormChange(e, index)}
                                    >
                                        <option value={''}>-- Pilih Komponen --</option>
                                        {componentsList.map((component, index) => (
                                            <option value={component.id} key={index}>
                                                {component.name}
                                            </option>
                                        ))}
                                    </select>
                                    <Link href="/components/create" className="px-3 py-2 bg-sky-500 rounded text-white">
                                        <IconPlus size={20} stroke={2} />
                                    </Link>
                                </div>
                            </div>
                            <div className="flex items-center justify-center gap-5 mt-5">
                                <div className="relative">
                                    <label htmlFor="nameProducts" className="text-sm font-semibold bg-slate-200 uppercase">
                                        Min. Komponen
                                    </label>

                                    <input
                                        autoComplete="off"
                                        name="minQty"
                                        type="text"
                                        required
                                        className="w-full px-3 py-2 text-sm rounded bg-gray-50 outline-none"
                                        placeholder="0, 5, 10, 20, 30"
                                        onChange={(e) => handleFormChange(e, index)}
                                        value={component.minQty}
                                    />
                                </div>
                                <div className="relative">
                                    <label htmlFor="nameProducts" className="text-sm font-semibold bg-slate-200 uppercase">
                                        Tipe Satuan Komponen
                                    </label>

                                    <input
                                        autoComplete="off"
                                        type="text"
                                        required
                                        name="typePieces"
                                        className="w-full px-3 py-2 text-sm rounded bg-gray-50 outline-none"
                                        placeholder="lembar, lusin, box..."
                                        value={component.typePieces}
                                        onChange={(e) => handleFormChange(e, index)}
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-end mt-5">
                                <button type="button" onClick={handlerAddNewSize} className="px-4 py-2 bg-sky-500 text-slate-100 rounded-lg">
                                    <div className="flex items-center justify-center gap-1 text-sm">
                                        <IconCirclePlus size={18} stroke={2} className="mt-0.5" /> <p>Tambah</p>
                                    </div>
                                </button>
                            </div>
                        </Card>
                    ))}
                </div>
            </form>
        </>
    );
}
