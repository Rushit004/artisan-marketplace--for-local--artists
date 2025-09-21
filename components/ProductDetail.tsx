import React from 'react';
import type { Product } from '../types';
import { Button } from './shared/Button';
import { Icon } from './shared/Icon';

interface ProductDetailProps {
  product: Product;
  onBack: () => void;
  onAddToCart: (productId: string) => void;
  onWishlistToggle: (productId: string) => void;
  isWishlisted: boolean;
}

export const ProductDetail: React.FC<ProductDetailProps> = ({ product, onBack, onAddToCart, onWishlistToggle, isWishlisted }) => {
  return (
    <div className="space-y-6">
      <button onClick={onBack} className="flex items-center gap-2 text-sm font-semibold text-brand-primary hover:text-brand-primary/80 transition-colors">
        <Icon name="arrow-left" className="h-4 w-4" />
        Go Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        <div>
          <img src={product.imageUrl} alt={product.name} className="w-full h-auto object-cover rounded-xl shadow-lg" />
        </div>

        <div className="flex flex-col">
          <h1 className="text-4xl font-bold font-serif text-brand-primary">{product.name}</h1>
          <p className="text-md text-gray-700 mt-2">by <span className="font-semibold text-brand-primary">{product.artisanName}</span></p>
          
          <p className="text-4xl font-bold text-brand-primary mt-6 mb-4">${product.price.toFixed(2)}</p>

          <div className="prose text-brand-text max-w-none">
            <p>{product.description}</p>
          </div>

          <p className={`mt-4 text-sm font-semibold ${product.stock > 0 ? 'text-green-800' : 'text-red-700'}`}>
            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
          </p>

          <div className="flex items-center gap-4 mt-8">
            <Button 
                onClick={() => onAddToCart(product.id)} 
                disabled={product.stock === 0}
                className="flex-grow"
            >
                <Icon name="cart" className="h-5 w-5 mr-2" />
                Add to Cart
            </Button>
            <Button 
                onClick={() => onWishlistToggle(product.id)} 
                variant="secondary" 
                className="!px-4"
                aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            >
                <Icon name={isWishlisted ? 'heart-filled' : 'heart'} className={`h-6 w-6 ${isWishlisted ? 'text-red-500' : ''}`} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};