import React from 'react';
import type { View, ArtisanProfile, Product } from '../types';
import { Icon } from './shared/Icon';

interface SidebarProps {
  user: ArtisanProfile;
  activeView: View;
  setActiveView: (view: View) => void;
  onLogout: () => void;
  cartCount: number;
  recentlyViewed: Product[];
  onRecentClick: (product: Product) => void;
}

const NavLink: React.FC<{
  viewName: View;
  iconName: string;
  label: string;
  activeView: View;
  onClick: (view: View) => void;
  badgeCount?: number;
}> = ({ viewName, iconName, label, activeView, onClick, badgeCount }) => (
  <button
    onClick={() => onClick(viewName)}
    className={`flex items-center w-full px-4 py-3 text-left rounded-lg transition-colors duration-200 relative ${
      activeView === viewName
        ? 'bg-brand-accent text-brand-text font-semibold'
        : 'text-brand-text hover:bg-brand-accent/50'
    }`}
  >
    <Icon name={iconName} className="h-5 w-5 mr-3" />
    <span>{label}</span>
    {badgeCount !== undefined && badgeCount > 0 && (
       <span className="absolute right-2 top-1/2 -translate-y-1/2 bg-brand-primary text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
         {badgeCount}
       </span>
    )}
  </button>
);

export const Sidebar: React.FC<SidebarProps> = ({ user, activeView, setActiveView, onLogout, cartCount, recentlyViewed, onRecentClick }) => {
  return (
    <aside className="w-64 bg-white/50 backdrop-blur-sm p-4 border-r border-black/10 flex flex-col">
      <div className="flex items-center mb-8">
        <h1 className="text-2xl font-bold font-serif text-brand-primary">Artisan Marketplace</h1>
      </div>

      <button onClick={() => setActiveView('profile')} className="flex items-center text-left w-full mb-8 p-2 rounded-lg hover:bg-brand-accent/50 transition-colors">
        <img src={user.avatarUrl} alt={user.name} className="w-12 h-12 rounded-full mr-4" />
        <div>
          <h2 className="font-semibold text-brand-text">{user.name}</h2>
          <p className="text-sm text-gray-800">{user.specialty}</p>
        </div>
      </button>

      <nav className="flex-grow overflow-y-auto">
        <h3 className="px-4 mt-6 mb-2 text-xs font-semibold text-gray-700 uppercase tracking-wider">Buying</h3>
        <ul className="space-y-2">
            <li>
                <NavLink viewName="marketplace" iconName="store" label="Marketplace" activeView={activeView} onClick={setActiveView} />
            </li>
            <li>
                <NavLink viewName="wishlist" iconName="heart" label="Wishlist" activeView={activeView} onClick={setActiveView} />
            </li>
            <li>
                <NavLink viewName="cart" iconName="cart" label="Cart" activeView={activeView} onClick={setActiveView} badgeCount={cartCount}/>
            </li>
             <li>
                <NavLink viewName="track-orders" iconName="truck" label="Track Orders" activeView={activeView} onClick={setActiveView} />
            </li>
             <li>
                <NavLink viewName="connections" iconName="users" label="Connections" activeView={activeView} onClick={setActiveView} />
            </li>
        </ul>

        {recentlyViewed.length > 0 && (
            <>
                <h3 className="px-4 mt-6 mb-2 text-xs font-semibold text-gray-700 uppercase tracking-wider">Recently Viewed</h3>
                <ul className="space-y-3 px-2">
                    {recentlyViewed.map(product => (
                        <li key={product.id}>
                            <button onClick={() => onRecentClick(product)} className="flex items-center w-full text-left group">
                                <img src={product.imageUrl} alt={product.name} className="w-10 h-10 rounded-md object-cover mr-3 flex-shrink-0" />
                                <div className="overflow-hidden">
                                    <p className="text-sm font-medium text-brand-text truncate group-hover:text-brand-primary">{product.name}</p>
                                    <p className="text-xs text-gray-700">${product.price.toFixed(2)}</p>
                                </div>
                            </button>
                        </li>
                    ))}
                </ul>
            </>
        )}

        <h3 className="px-4 mt-6 mb-2 text-xs font-semibold text-gray-700 uppercase tracking-wider">Selling Tools</h3>
        <ul className="space-y-2">
          <li>
            <NavLink viewName="dashboard" iconName="dashboard" label="Dashboard" activeView={activeView} onClick={setActiveView} />
          </li>
          <li>
            <NavLink viewName="products" iconName="products" label="My Products" activeView={activeView} onClick={setActiveView} />
          </li>
          <li>
            <NavLink viewName="ai-description" iconName="ai-description" label="AI Description" activeView={activeView} onClick={setActiveView} />
          </li>
          <li>
            <NavLink viewName="ai-suggestions" iconName="ai-suggestions" label="AI Suggestions" activeView={activeView} onClick={setActiveView} />
          </li>
        </ul>
      </nav>

      <div className="mt-auto pt-4">
        <button onClick={onLogout} className="w-full text-center text-sm py-2 px-4 rounded-lg text-gray-700 hover:bg-gray-200 transition-colors">
            Logout
        </button>
        <p className="text-center text-xs text-gray-700 mt-2">&copy; {new Date().getFullYear()} Artisan Marketplace</p>
      </div>
    </aside>
  );
};