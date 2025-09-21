import React from 'react';
import type { Product } from '../types';
import { Card } from './shared/Card';
import { Button } from './shared/Button';
import { Icon } from './shared/Icon';

interface WishlistProps {
  allProducts: Product[];
  wishlistIds: string[];
  onProductClick: (product: Product) => void;
  onRemove: (productId: string) => void;
  onAddToCart: (productId: string) => void;
}

const WishlistItem: React.FC<{
    product: Product;
    onProductClick: () => void;
    onRemove: () => void;
    onAddToCart: () => void;
}> = ({ product, onProductClick, onRemove, onAddToCart }) => (
    <Card className="flex items-center gap-4">
        <img src={product.imageUrl} alt={product.name} className="w-24 h-24 object-cover rounded-lg cursor-pointer" onClick={onProductClick} />
        <div className="flex-grow cursor-pointer" onClick={onProductClick}>
            <h3 className="font-semibold text-brand-primary">{product.name}</h3>
            <p className="text-sm text-gray-600">by {product.artisanName}</p>
            <p className="font-bold text-brand-text mt-1">${product.price.toFixed(2)}</p>
        </div>
        <div className="flex flex-col gap-2">
            <Button onClick={onAddToCart} variant="secondary" className="!px-3 !py-1.5 text-sm">
                <Icon name="cart" className="h-4 w-4" />
            </Button>
            <button onClick={onRemove} className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                <Icon name="close" className="h-5 w-5" />
            </button>
        </div>
    </Card>
);

export const Wishlist: React.FC<WishlistProps> = ({ allProducts, wishlistIds, onProductClick, onRemove, onAddToCart }) => {
  const wishlistProducts = allProducts.filter(p => wishlistIds.includes(p.id));

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold font-serif text-brand-primary mb-6">My Wishlist</h1>
      {wishlistProducts.length > 0 ? (
        <div className="space-y-4">
          {wishlistProducts.map(product => (
            <WishlistItem
              key={product.id}
              product={product}
              onProductClick={() => onProductClick(product)}
              onRemove={() => onRemove(product.id)}
              onAddToCart={() => onAddToCart(product.id)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
            <Icon name="heart" className="h-16 w-16 text-brand-primary/20 mx-auto" />
            <h2 className="mt-4 text-xl font-semibold text-brand-primary">Your wishlist is empty</h2>
            <p className="mt-2 text-gray-700">Click the heart icon on products to save them for later.</p>
        </div>
      )}
    </div>
  );
};