import React from 'react';
import type { Product, CartItem } from '../types';
import { Card } from './shared/Card';
import { Button } from './shared/Button';
import { Icon } from './shared/Icon';

interface CartProps {
  cartItems: CartItem[];
  allProducts: Product[];
  onUpdateQuantity: (productId: string, newQuantity: number) => void;
  onProceedToCheckout: () => void;
}

const QuantityAdjuster: React.FC<{ 
    quantity: number;
    onIncrease: () => void;
    onDecrease: () => void;
}> = ({ quantity, onIncrease, onDecrease }) => (
    <div className="flex items-center border border-gray-300 rounded-md">
        <button onClick={onDecrease} className="px-2 py-1 text-gray-600 hover:bg-gray-100 rounded-l-md"><Icon name="minus" className="h-4 w-4" /></button>
        <span className="px-3 text-center text-sm font-medium w-12">{quantity}</span>
        <button onClick={onIncrease} className="px-2 py-1 text-gray-600 hover:bg-gray-100 rounded-r-md"><Icon name="plus" className="h-4 w-4" /></button>
    </div>
);

export const Cart: React.FC<CartProps> = ({ cartItems, allProducts, onUpdateQuantity, onProceedToCheckout }) => {
  const cartProducts = cartItems.map(item => {
    const product = allProducts.find(p => p.id === item.productId);
    return { ...product!, quantity: item.quantity };
  }).filter(Boolean); // Filter out any potential undefined products

  const subtotal = cartProducts.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold font-serif text-brand-primary mb-6">Shopping Cart</h1>
      {cartProducts.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 space-y-4">
            {cartProducts.map(item => (
              <Card key={item.id} className="flex items-center gap-4">
                <img src={item.imageUrl} alt={item.name} className="w-24 h-24 object-cover rounded-lg" />
                <div className="flex-grow">
                  <h3 className="font-semibold text-brand-primary">{item.name}</h3>
                  <p className="text-sm text-gray-600">by {item.artisanName}</p>
                  <p className="font-bold text-brand-text mt-1">${item.price.toFixed(2)}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                    <QuantityAdjuster 
                        quantity={item.quantity}
                        onIncrease={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        onDecrease={() => onUpdateQuantity(item.id, item.quantity - 1)}
                    />
                     <button onClick={() => onUpdateQuantity(item.id, 0)} className="text-xs text-gray-600 hover:text-red-600">Remove</button>
                </div>
              </Card>
            ))}
          </div>
          <div className="lg:col-span-1 sticky top-8">
            <Card>
              <h2 className="text-xl font-serif font-bold text-brand-primary mb-4">Order Summary</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-semibold">${subtotal.toFixed(2)}</span>
                </div>
                 <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="font-semibold">FREE</span>
                </div>
                 <div className="flex justify-between text-lg font-bold pt-4 border-t mt-4">
                    <span>Total</span>
                    <span>${subtotal.toFixed(2)}</span>
                </div>
              </div>
              <Button onClick={onProceedToCheckout} className="w-full mt-6">
                Proceed to Checkout
              </Button>
            </Card>
          </div>
        </div>
      ) : (
        <div className="text-center py-16">
          <Icon name="cart" className="h-16 w-16 text-brand-primary/20 mx-auto" />
          <h2 className="mt-4 text-xl font-semibold text-brand-primary">Your cart is empty</h2>
          <p className="mt-2 text-gray-700">Looks like you haven't added anything to your cart yet.</p>
        </div>
      )}
    </div>
  );
};