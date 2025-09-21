import React from 'react';
import type { Order, Product } from '../types';
import { Card } from './shared/Card';
import { Icon } from './shared/Icon';

interface TrackOrdersProps {
  orders: Order[];
  allProducts: Product[];
}

const OrderStatusTracker: React.FC<{ currentStatus: Order['status'] }> = ({ currentStatus }) => {
    const statuses: Order['status'][] = ['Placed', 'Shipped', 'Out for Delivery', 'Delivered'];
    const currentIndex = statuses.indexOf(currentStatus);

    return (
        <div className="flex items-center justify-between my-6">
            {statuses.map((status, index) => (
                <React.Fragment key={status}>
                    <div className="flex flex-col items-center text-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${index <= currentIndex ? 'bg-brand-primary border-brand-primary text-white' : 'bg-white border-gray-300 text-gray-600'}`}>
                           {index < currentIndex ? '✓' : index + 1}
                        </div>
                        <p className={`mt-2 text-xs font-semibold ${index <= currentIndex ? 'text-brand-primary' : 'text-gray-600'}`}>{status}</p>
                    </div>
                    {index < statuses.length - 1 && (
                        <div className={`flex-grow h-1 mx-2 ${index < currentIndex ? 'bg-brand-primary' : 'bg-gray-300'}`}></div>
                    )}
                </React.Fragment>
            ))}
        </div>
    );
};


export const TrackOrders: React.FC<TrackOrdersProps> = ({ orders, allProducts }) => {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold font-serif text-brand-primary mb-6">Track Your Orders</h1>
      {orders.length > 0 ? (
        <div className="space-y-6">
          {orders.map(order => {
            const orderItems = order.items.map(item => {
                const product = allProducts.find(p => p.id === item.productId);
                return { ...product!, quantity: item.quantity };
            });

            return (
              <Card key={order.id}>
                <div className="flex justify-between items-start flex-wrap gap-2">
                    <div>
                        <h2 className="font-bold text-brand-primary">Order #{order.id}</h2>
                        <p className="text-sm text-gray-600">Placed on: {new Date(order.orderDate).toLocaleDateString()}</p>
                    </div>
                    <p className="text-lg font-bold">${order.total.toFixed(2)}</p>
                </div>

                <OrderStatusTracker currentStatus={order.status} />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mt-4 border-t pt-4">
                    <div>
                        <h3 className="font-semibold mb-2">Delivery Details</h3>
                        <p>{order.deliveryDetails.name}</p>
                        <p>{order.deliveryDetails.address}</p>
                        <p>{order.deliveryDetails.phone}</p>
                    </div>
                     <div>
                        <h3 className="font-semibold mb-2">Shipping Status</h3>
                        <p>Expected by: <span className="font-medium">{new Date(order.expectedDelivery).toDateString()}</span></p>
                        <p>Current Location: <span className="font-medium">{order.currentLocation}</span></p>
                    </div>
                </div>

                <div className="mt-4 border-t pt-4">
                     <h3 className="font-semibold mb-2 text-sm">Items in this order</h3>
                     <div className="space-y-2">
                        {orderItems.map(item => (
                             <div key={item.id} className="flex items-center gap-4 text-sm">
                                <img src={item.imageUrl} alt={item.name} className="w-12 h-12 rounded-md object-cover" />
                                <div className="flex-grow">
                                    <p className="font-medium">{item.name}</p>
                                    <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                                </div>
                                <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                             </div>
                        ))}
                     </div>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16">
            <Icon name="truck" className="h-16 w-16 text-brand-primary/20 mx-auto" />
            <h2 className="mt-4 text-xl font-semibold text-brand-primary">No orders placed yet</h2>
            <p className="mt-2 text-gray-700">When you place an order, you can track its progress here.</p>
        </div>
      )}
    </div>
  );
};