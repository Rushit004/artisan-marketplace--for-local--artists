export type View = 'marketplace' | 'dashboard' | 'products' | 'ai-description' | 'ai-suggestions' | 'profile' | 'productDetail' | 'wishlist' | 'cart' | 'track-orders' | 'connections' | 'artisanProfile';

export interface PortfolioItem {
  id: string;
  title: string;
  imageUrl: string;
  description: string;
}

export interface ArtisanProfile {
  id?: string;
  name: string;
  specialty: string;
  avatarUrl: string;
  location: string;
  // New Fields
  experience: string;
  availability: string;
  workplace: string;
  phone: string;
  instagram: string;
  portfolio?: PortfolioItem[];
}

export interface MonthlySales {
    name: string;
    sales: number;
}
  
export interface EngagementData {
    name: string;
    views: number;
    likes: number;
    follows: number;
}

// New: Export DashboardData type to be used in App.tsx state
export interface DashboardData {
    sales: MonthlySales[];
    profit: { name: string; profit: number }[];
    engagement: EngagementData[];
}

export interface Product {
    id: string;
    name: string;
    category: string;
    price: number;
    stock: number;
    imageUrl: string;
    description: string;
    shortDescription: string;
    artisanName: string;
}

export interface CartItem {
  productId: string;
  quantity: number;
}

export interface DeliveryDetails {
  name: string;
  email: string;
  phone: string;
  address: string;
  paymentMethod: 'Credit Card' | 'PayPal' | 'Cash on Delivery';
}

export interface Order {
  id: string;
  orderDate: string;
  items: CartItem[];
  total: number;
  deliveryDetails: DeliveryDetails;
  status: 'Placed' | 'Shipped' | 'Out for Delivery' | 'Delivered';
  expectedDelivery: string;
  currentLocation: string;
}

// Fix: Add the missing UserRegistration type, which is used for the registration flow.
export interface UserRegistration {
  name: string;
  email: string;
  password: string;
}
