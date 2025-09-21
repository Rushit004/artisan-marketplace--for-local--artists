import React, { useState } from 'react';
import type { Product, ArtisanProfile } from '../types';
import { Card } from './shared/Card';
import { Button } from './shared/Button';
import { ProductForm } from './ProductForm';

interface ProductsProps {
    userProducts: Product[];
    onProductClick: (product: Product) => void;
    onSave: (product: Product) => void;
    onDelete: (productId: string) => void;
    artisan: ArtisanProfile;
}

const ProductListItem: React.FC<{ product: Product; onEdit: () => void; onDelete: () => void; onProductClick: () => void; }> = ({ product, onEdit, onDelete, onProductClick }) => (
    <Card>
        <button onClick={onProductClick} className="w-full text-left">
            <img src={product.imageUrl} alt={product.name} className="w-full h-48 object-cover rounded-t-xl mb-4" />
            <div className="px-2">
                <h3 className="text-lg font-bold font-serif text-brand-primary">{product.name}</h3>
                <p className="text-sm text-gray-500 mb-2">{product.category}</p>
                <div className="flex justify-between items-center">
                    <p className="text-xl font-semibold text-brand-text">${product.price.toFixed(2)}</p>
                    <p className="text-sm font-medium text-brand-text">Stock: {product.stock}</p>
                </div>
            </div>
        </button>
        <div className="p-2 mt-4 flex gap-2">
            <Button onClick={(e) => { e.stopPropagation(); onEdit(); }} variant="secondary" className="w-full !py-1.5">Edit</Button>
            <button onClick={(e) => { e.stopPropagation(); onDelete(); }} className="w-full px-4 py-1.5 rounded-lg font-semibold transition-all duration-300 bg-red-100 text-red-700 hover:bg-red-200">Delete</button>
        </div>
    </Card>
);


export const Products: React.FC<ProductsProps> = ({ userProducts, onProductClick, onSave, onDelete, artisan }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

    const handleAddNew = () => {
        setEditingProduct(null);
        setIsModalOpen(true);
    };

    const handleEdit = (product: Product) => {
        setEditingProduct(product);
        setIsModalOpen(true);
    };

    const handleDelete = (productId: string) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            onDelete(productId);
        }
    };
    
    const handleSave = (productToSave: Product) => {
        onSave(productToSave);
        setIsModalOpen(false);
        setEditingProduct(null);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold font-serif text-brand-primary">My Products</h1>
                <Button onClick={handleAddNew}>Add New Product</Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {userProducts.map(product => (
                    <ProductListItem 
                        key={product.id}
                        product={product}
                        onEdit={() => handleEdit(product)}
                        onDelete={() => handleDelete(product.id)}
                        onProductClick={() => onProductClick(product)}
                    />
                ))}
            </div>

            {isModalOpen && (
                <ProductForm
                    product={editingProduct}
                    onSave={handleSave}
                    onClose={() => setIsModalOpen(false)}
                    artisan={artisan}
                />
            )}
        </div>
    );
};