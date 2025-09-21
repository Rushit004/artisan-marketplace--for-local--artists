import React, { useState } from 'react';
import type { DeliveryDetails, ArtisanProfile } from '../types';
import { Card } from './shared/Card';
import { Button } from './shared/Button';
import { Icon } from './shared/Icon';

interface CheckoutFormProps {
    onClose: () => void;
    onPlaceOrder: (details: DeliveryDetails) => void;
    currentUser: ArtisanProfile;
}

const InputField: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label: string; id: string; }> = ({ label, id, ...props }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-brand-text">{label}</label>
        <input id={id} className="mt-1 block w-full" {...props} />
    </div>
);

export const CheckoutForm: React.FC<CheckoutFormProps> = ({ onClose, onPlaceOrder, currentUser }) => {
    const [formData, setFormData] = useState<DeliveryDetails>({
        name: currentUser.name,
        email: 'user@example.com', // Placeholder
        phone: currentUser.phone,
        address: '',
        paymentMethod: 'Credit Card',
    });
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({...prev, [id]: value }));
    }
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onPlaceOrder(formData);
    }
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-40 flex justify-center items-center p-4" onClick={onClose}>
            <Card className="w-full max-w-lg" onClick={e => e.stopPropagation()}>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold font-serif text-brand-primary">Confirm Your Order</h2>
                        <button type="button" onClick={onClose} className="p-1 rounded-full hover:bg-gray-200">
                            <Icon name="close" className="h-5 w-5 text-gray-600" />
                        </button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InputField label="Full Name" id="name" value={formData.name} onChange={handleChange} required />
                        <InputField label="Email" id="email" type="email" value={formData.email} onChange={handleChange} required />
                    </div>
                    
                    <InputField label="Phone Number" id="phone" value={formData.phone} onChange={handleChange} required />
                    <InputField label="Delivery Address" id="address" placeholder="123 Artisan Way, Craftville" value={formData.address} onChange={handleChange} required />
                    
                    <div>
                         <label htmlFor="paymentMethod" className="block text-sm font-medium text-brand-text">Payment Method</label>
                         <select id="paymentMethod" value={formData.paymentMethod} onChange={handleChange} className="mt-1 block w-full">
                            <option>Credit Card</option>
                            <option>PayPal</option>
                            <option>Cash on Delivery</option>
                         </select>
                    </div>
                    
                    <div className="pt-4">
                        <Button type="submit" className="w-full">
                            Place Order
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
};