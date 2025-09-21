import React, { useState, useEffect } from 'react';
import type { Product, ArtisanProfile } from '../types';
import { Card } from './shared/Card';
import { Button } from './shared/Button';

interface ProductFormProps {
  product: Product | null;
  onSave: (product: Product) => void;
  onClose: () => void;
  // This would typically come from a user context
  artisan: ArtisanProfile;
}

const InputField: React.FC<{
    label: string;
    id: string;
    value: string | number;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    type?: string;
    placeholder?: string;
    required?: boolean;
    as?: 'textarea';
    maxLength?: number;
}> = ({ label, id, as = 'input', ...props }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-brand-text">{label}</label>
        { as === 'textarea' ? (
             <textarea id={id} rows={4} className="mt-1 block w-full" {...props}></textarea>
        ) : (
            <input id={id} className="mt-1 block w-full" {...props} />
        )}
    </div>
);

export const ProductForm: React.FC<ProductFormProps> = ({ product, onSave, onClose, artisan }) => {
    // Fix: Initialize formData with all required fields from the Product type, including shortDescription.
    const [formData, setFormData] = useState<Omit<Product, 'id' | 'artisanName'>>({
        name: '',
        category: '',
        price: 0,
        stock: 0,
        imageUrl: '',
        shortDescription: '',
        description: ''
    });
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    useEffect(() => {
        if (product) {
            setFormData(product);
            setImagePreview(product.imageUrl);
        }
    }, [product]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: id === 'price' || id === 'stock' ? parseFloat(value) || 0 : value }));
    };

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result as string;
                setFormData(prev => ({ ...prev, imageUrl: result }));
                setImagePreview(result);
            };
            reader.readAsDataURL(file);
        }
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ ...formData, id: product?.id || '', artisanName: artisan.name });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center p-4" onClick={onClose}>
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <h2 className="text-2xl font-bold font-serif text-brand-primary">{product ? 'Edit Product' : 'Add New Product'}</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       <InputField label="Product Name" id="name" value={formData.name} onChange={handleChange} required />
                       <InputField label="Category" id="category" value={formData.category} onChange={handleChange} required />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       <InputField label="Price" id="price" type="number" value={formData.price} onChange={handleChange} required />
                       <InputField label="Stock" id="stock" type="number" value={formData.stock} onChange={handleChange} required />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-brand-text">Product Image</label>
                        <div className="mt-1 flex items-center gap-4">
                           {imagePreview && <img src={imagePreview} alt="preview" className="h-20 w-20 object-cover rounded-md" />}
                            <label htmlFor="image-upload" className="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary">
                                <span>{imagePreview ? 'Change' : 'Upload'} image</span>
                                <input id="image-upload" name="image-upload" type="file" className="sr-only" onChange={handleImageChange} accept="image/*" />
                            </label>
                        </div>
                    </div>
                    
                    <InputField label="Short Description" id="shortDescription" value={formData.shortDescription} onChange={handleChange} required maxLength={120} placeholder="A brief, catchy summary for product cards." />
                    <InputField label="Description" id="description" as="textarea" value={formData.description} onChange={handleChange} required />

                    <div className="flex justify-end gap-4 pt-4">
                        <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
                        <Button type="submit">Save Product</button>
                    </div>
                </form>
            </Card>
        </div>
    );
};