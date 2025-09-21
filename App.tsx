import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { AiProductDesc } from './components/AiProductDesc';
import { AiSuggestions } from './components/AiSuggestions';
import { Products } from './components/Products';
import { Marketplace } from './components/Marketplace';
import { Auth } from './components/Auth';
import { Profile } from './components/Profile';
import { ProductDetail } from './components/ProductDetail';
import { Wishlist } from './components/Wishlist';
import { Cart as CartPage } from './components/Cart';
import { TrackOrders } from './components/TrackOrders';
import { Connections } from './components/Connections';
import { CheckoutForm } from './components/CheckoutForm';
import { Toast } from './components/shared/Toast';
import { Spinner } from './components/shared/Spinner';
import * as api from './services/apiService';
import type { View, ArtisanProfile, Product, CartItem, Order, DeliveryDetails, UserRegistration, DashboardData } from './types';
import { Icon } from './components/shared/Icon';
import { FOLLOWING_DATA } from './constants';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<ArtisanProfile | null>(null);
  
  // Navigation State
  const [activeView, setActiveView] = useState<View>('marketplace');
  const [history, setHistory] = useState<View[]>([activeView]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const [allArtisans, setAllArtisans] = useState<ArtisanProfile[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [viewedArtisanProfile, setViewedArtisanProfile] = useState<ArtisanProfile | null>(null);
  const [wishlist, setWishlist] = useState<string[]>(['prod2', 'prod5']);
  const [cart, setCart] = useState<CartItem[]>([
    { productId: 'prod1', quantity: 1 },
    { productId: 'prod4', quantity: 2 },
  ]);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [recentlyViewedIds, setRecentlyViewedIds] = useState<string[]>([]);
  const [followingIds, setFollowingIds] = useState<string[]>(FOLLOWING_DATA);

  // Effect to check for "Remember Me" user and load initial data
  useEffect(() => {
    const checkSession = async () => {
      setIsLoading(true);
      try {
        const user = await api.checkSession(); // Checks for JWT
        if (user) {
          setCurrentUser(user);
          const lastView = (localStorage.getItem('lastView') as View) || 'marketplace';
          setActiveView(lastView);
          setHistory([lastView]);
          setHistoryIndex(0);


          const [fetchedProducts, fetchedArtisans, fetchedDashboardData] = await Promise.all([
            api.getProducts(),
            api.getArtisans(),
            api.getDashboardData(),
          ]);
          setProducts(fetchedProducts);
          setAllArtisans(fetchedArtisans);
          setDashboardData(fetchedDashboardData);

          const storedViewed = localStorage.getItem('recentlyViewed');
          if (storedViewed) {
              setRecentlyViewedIds(JSON.parse(storedViewed));
          }
        }
      } catch (error) {
        console.warn("No active session found.");
      } finally {
        setIsLoading(false);
      }
    };
    checkSession();
  }, []);

  // Effect to save the last view when it changes
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('lastView', activeView);
    }
  }, [activeView, currentUser]);

  // Effect to save recently viewed items
  useEffect(() => {
      if (currentUser && recentlyViewedIds.length > 0) {
          localStorage.setItem('recentlyViewed', JSON.stringify(recentlyViewedIds));
      }
  }, [recentlyViewedIds, currentUser]);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // --- Navigation Logic ---
  const navigateTo = (view: View) => {
    if (history[historyIndex] === view) return; // Avoid pushing same view consecutively
    
    const newHistory = [...history.slice(0, historyIndex + 1), view];
    setHistory(newHistory);
    const newIndex = newHistory.length - 1;
    setHistoryIndex(newIndex);
    setActiveView(view);
  };

  const handleBack = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setActiveView(history[newIndex]);
    }
  };

  const handleForward = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setActiveView(history[newIndex]);
    }
  };
  // --- End Navigation Logic ---

  const handleLogin = async (email: string, password: string, rememberMe: boolean): Promise<void> => {
    const user = await api.login(email, password, rememberMe);
    setCurrentUser(user);
    const [fetchedProducts, fetchedArtisans, fetchedDashboardData] = await Promise.all([
        api.getProducts(),
        api.getArtisans(),
        api.getDashboardData(),
    ]);
    setProducts(fetchedProducts);
    setAllArtisans(fetchedArtisans);
    setDashboardData(fetchedDashboardData);
    setActiveView('marketplace');
    setHistory(['marketplace']);
    setHistoryIndex(0);
  };

  const handleRegister = async (registration: UserRegistration) => {
    const { user } = await api.register(registration);
    // Add new user to the list of artisans to make them discoverable immediately
    setAllArtisans(prev => [...prev, user]);
  };
  
  const handleLogout = () => {
    api.logout();
    setCurrentUser(null);
    setActiveView('marketplace');
    setHistory(['marketplace']);
    setHistoryIndex(0);
  };
  
  const handleViewProduct = (product: Product) => {
    setSelectedProduct(product);
    navigateTo('productDetail');

    // Update recently viewed list
    setRecentlyViewedIds(prev => {
        const newIds = [product.id, ...prev.filter(id => id !== product.id)];
        return newIds.slice(0, 4); // Keep only the latest 4
    });
  };

  const handleViewArtisan = (artisan: ArtisanProfile) => {
    setViewedArtisanProfile(artisan);
    navigateTo('artisanProfile');
  };

  const handleToggleFollow = (artisanId: string) => {
    setFollowingIds(prev => {
        if (prev.includes(artisanId)) {
            // Unfollow
            return prev.filter(id => id !== artisanId);
        } else {
            // Follow
            return [...prev, artisanId];
        }
    });
};

  const handleUpdateProfile = async (updatedProfile: ArtisanProfile) => {
    try {
      const savedProfile = await api.updateProfile(updatedProfile);
      setCurrentUser(savedProfile);
      setAllArtisans(prev => prev.map(a => a.id === savedProfile.id ? savedProfile : a));
      showToast('Profile updated successfully!');
      navigateTo('profile');
    } catch (error) {
      console.error("Failed to update profile:", error);
      showToast((error as Error).message || 'An unexpected error occurred.', 'error');
    }
  };
  
  const handleSaveProduct = async (productToSave: Product) => {
    try {
      if (productToSave.id) {
          const updatedProduct = await api.updateProduct(productToSave);
          setProducts(products.map(p => p.id === updatedProduct.id ? updatedProduct : p));
          showToast('Product updated successfully!');
      } else {
          const newProduct = await api.createProduct(productToSave);
          setProducts([...products, newProduct]);
          showToast('Product created successfully!');
      }
    } catch (error) {
        console.error("Failed to save product:", error);
        showToast((error as Error).message || 'An unexpected error occurred while saving the product.', 'error');
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    try {
      await api.deleteProduct(productId);
      setProducts(products.filter(p => p.id !== productId));
      showToast('Product deleted.');
    } catch (error) {
        console.error("Failed to delete product:", error);
        showToast((error as Error).message || 'An unexpected error occurred while deleting the product.', 'error');
    }
  };

  const toggleWishlist = (productId: string) => {
    setWishlist(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId) 
        : [...prev, productId]
    );
    const isInWishlist = wishlist.includes(productId);
    showToast(isInWishlist ? 'Removed from wishlist' : 'Added to wishlist');
  };

  const addToCart = (productId: string, quantity: number = 1) => {
    setCart(prev => {
      const existingItem = prev.find(item => item.productId === productId);
      if (existingItem) {
        return prev.map(item => 
          item.productId === productId 
            ? { ...item, quantity: item.quantity + quantity } 
            : item
        );
      }
      return [...prev, { productId, quantity }];
    });
    showToast('Item added to cart!');
  };

  const updateCartQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      setCart(prev => prev.filter(item => item.productId !== productId));
    } else {
      setCart(prev => prev.map(item => item.productId === productId ? { ...item, quantity: newQuantity } : item));
    }
  };
  
  const handleProceedToCheckout = () => {
    setIsCheckoutOpen(true);
  }

  const updateDashboardData = (orderTotal: number) => {
    // Assume 60% profit margin for simulation
    const profit = orderTotal * 0.6;

    setDashboardData(prevData => {
        if (!prevData) return null;

        // Create a deep copy to avoid direct state mutation
        const newData = JSON.parse(JSON.stringify(prevData));

        // Update sales for the most recent month
        if (newData.sales.length > 0) {
            newData.sales[newData.sales.length - 1].sales += orderTotal;
        }

        // Update profit for the most recent month
        if (newData.profit.length > 0) {
            newData.profit[newData.profit.length - 1].profit += profit;
        }

        return newData;
    });
};

  const handlePlaceOrder = (deliveryDetails: DeliveryDetails) => {
    const subtotal = cart.reduce((sum, item) => {
      const product = products.find(p => p.id === item.productId);
      return sum + (product?.price || 0) * item.quantity;
    }, 0);

    const newOrder: Order = {
      id: `ORD-${Date.now()}`,
      orderDate: new Date().toISOString(),
      items: [...cart],
      total: subtotal,
      deliveryDetails,
      status: 'Placed',
      expectedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 5 days from now
      currentLocation: 'Warehouse, Willow Creek',
    };
    
    setOrders(prev => [...prev, newOrder]);
    setCart([]);
    setIsCheckoutOpen(false);
    updateDashboardData(subtotal);
    showToast('Order placed successfully!');
    navigateTo('track-orders');
  };

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-brand-light">
        <Spinner />
      </div>
    );
  }

  if (!currentUser) {
    return <Auth onLogin={handleLogin} onRegister={handleRegister} />;
  }
  
  const recentlyViewedProducts = recentlyViewedIds
    .map(id => products.find(p => p.id === id))
    .filter((p): p is Product => p !== undefined);

  const renderContent = () => {
    switch (activeView) {
      case 'marketplace':
        return <Marketplace products={products} onProductClick={handleViewProduct} wishlist={wishlist} onWishlistToggle={toggleWishlist} />;
      case 'dashboard':
        return <Dashboard data={dashboardData} />;
      case 'products':
        return <Products userProducts={products.filter(p => p.artisanName === currentUser.name)} onProductClick={handleViewProduct} onSave={handleSaveProduct} onDelete={handleDeleteProduct} artisan={currentUser} />;
      case 'ai-description':
        return <AiProductDesc />;
      case 'ai-suggestions':
        return <AiSuggestions user={currentUser} />;
      case 'profile':
        return <Profile user={currentUser} onSave={handleUpdateProfile} isCurrentUser={true} onToggleFollow={handleToggleFollow} followingIds={followingIds} />;
      case 'artisanProfile':
        return <Profile user={viewedArtisanProfile!} onSave={() => {}} isCurrentUser={false} onBack={handleBack} onToggleFollow={handleToggleFollow} followingIds={followingIds} />;
      case 'productDetail':
        return <ProductDetail product={selectedProduct!} onBack={handleBack} onAddToCart={addToCart} onWishlistToggle={toggleWishlist} isWishlisted={wishlist.includes(selectedProduct?.id || '')} />;
      case 'wishlist':
        return <Wishlist allProducts={products} wishlistIds={wishlist} onProductClick={handleViewProduct} onRemove={toggleWishlist} onAddToCart={addToCart} />;
       case 'cart':
        return <CartPage cartItems={cart} allProducts={products} onUpdateQuantity={updateCartQuantity} onProceedToCheckout={handleProceedToCheckout} />;
      case 'track-orders':
        return <TrackOrders orders={orders} allProducts={products} />;
      case 'connections':
        return <Connections currentUser={currentUser} allArtisans={allArtisans} onViewArtisan={handleViewArtisan} followingIds={followingIds} />;
      default:
        return <Marketplace products={products} onProductClick={handleViewProduct} wishlist={wishlist} onWishlistToggle={toggleWishlist} />;
    }
  };

  return (
    <div className="flex h-screen bg-brand-light font-sans text-brand-text">
      <Sidebar 
        user={currentUser}
        activeView={activeView} 
        setActiveView={navigateTo}
        onLogout={handleLogout}
        cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
        recentlyViewed={recentlyViewedProducts}
        onRecentClick={handleViewProduct}
      />
      <main className="flex-1 p-4 sm:p-6 lg:p-8 flex flex-col overflow-hidden">
        <div className="flex-shrink-0 mb-4">
          <div className="flex items-center gap-2">
            <button
              onClick={handleBack}
              disabled={historyIndex === 0}
              className="p-2 rounded-full bg-white/60 hover:bg-brand-accent/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="Go back"
            >
              <Icon name="arrow-left" className="h-5 w-5" />
            </button>
            <button
              onClick={handleForward}
              disabled={historyIndex >= history.length - 1}
              className="p-2 rounded-full bg-white/60 hover:bg-brand-accent/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="Go forward"
            >
              <Icon name="arrow-right" className="h-5 w-5" />
            </button>
          </div>
        </div>
        <div className="flex-grow overflow-y-auto">
            {renderContent()}
        </div>
      </main>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      {isCheckoutOpen && (
        <CheckoutForm 
          onClose={() => setIsCheckoutOpen(false)}
          onPlaceOrder={handlePlaceOrder}
          currentUser={currentUser}
        />
      )}
    </div>
  );
};

export default App;