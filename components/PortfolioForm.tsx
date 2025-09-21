import React, { useState, useEffect } from 'react';
import type { PortfolioItem } from '../types';
import { Card } from './shared/Card';
import { Button } from './shared/Button';

interface PortfolioFormProps {
  item: PortfolioItem | null;
  onSave: (item: PortfolioItem) => void;
  onClose: () => void;
}

const FormField: React.FC<{
    label: string;
    id: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    as?: 'textarea';
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

export const PortfolioForm: React.FC<PortfolioFormProps> = ({ item, onSave, onClose }) => {
    const [formData, setFormData] = useState<Omit<PortfolioItem, 'id'>>({
        title: '',
        description: '',
        imageUrl: '',
    });
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    useEffect(() => {
        if (item) {
            setFormData(item);
            setImagePreview(item.imageUrl);
        }
    }, [item]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
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
        if (!formData.imageUrl) {
            alert('Please upload an image.');
            return;
        }
        onSave({ ...formData, id: item?.id || '' });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center p-4" onClick={onClose}>
            <Card className="w-full max-w-lg" onClick={e => e.stopPropagation()}>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <h2 className="text-2xl font-bold font-serif text-brand-primary">
                        {item ? 'Edit Portfolio Item' : 'Add Portfolio Item'}
                    </h2>
                    
                    <div>
                        <label className="block text-sm font-medium text-brand-text">Image</label>
                        <div className="mt-1 flex items-center gap-4">
                           {imagePreview && <img src={imagePreview} alt="preview" className="h-24 w-24 object-cover rounded-md" />}
                            <div className="flex flex-col">
                                <label htmlFor="image-upload" className="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary">
                                    <span>{imagePreview ? 'Change Image' : 'Upload Image'}</span>
                                    <input id="image-upload" type="file" className="sr-only" onChange={handleImageChange} accept="image/*" required={!item} />
                                </label>
                                {!imagePreview && <p className="text-xs text-gray-500 mt-1">An image is required.</p>}
                            </div>
                        </div>
                    </div>

                    <FormField label="Title" id="title" value={formData.title} onChange={handleChange} />
                    <FormField label="Description" id="description" as="textarea" value={formData.description} onChange={handleChange} />

                    <div className="flex justify-end gap-4 pt-4">
                        <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
                        <Button type="submit">Save Item</Button>
                    </div>
                </form>
            </Card>
        </div>
    );
};