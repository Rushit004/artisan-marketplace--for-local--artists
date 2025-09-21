import React, { useState, useMemo, useEffect, useCallback } from 'react';
import type { Product } from '../types';
import { Icon } from './shared/Icon';
import { Card } from './shared/Card';
import { Button } from './shared/Button';
import { getAiSourcedSuggestions } from '../services/apiService'; // Updated import
import { Spinner } from './shared/Spinner';

const ProductCard: React.FC<{ 
    product: Product; 
    onClick: () => void;
    isWishlisted: boolean;
    onWishlistToggle: (e: React.MouseEvent) => void;
}> = ({ product, onClick, isWishlisted, onWishlistToggle }) => (
    <Card className="group overflow-hidden !p-0 cursor-pointer flex flex-col" onClick={onClick}>
        <div className="relative">
            <img src={product.imageUrl} alt={product.name} className="w-full h-56 object-cover transition-transform duration-300 group-hover:scale-105" />
            <button 
                onClick={onWishlistToggle}
                className="absolute top-3 right-3 bg-white/70 backdrop-blur-sm p-2 rounded-full text-gray-500 hover:text-brand-primary transition-colors z-10"
                aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            >
                <Icon name={isWishlisted ? 'heart-filled' : 'heart'} className={`h-5 w-5 ${isWishlisted ? 'text-red-500' : ''}`} />
            </button>
        </div>
        <div className="p-4 flex flex-col flex-grow">
            <h3 className="text-md font-semibold font-sans text-brand-text truncate">{product.name}</h3>
            <p className="text-sm text-gray-600">by {product.artisanName}</p>
            <p className="text-sm text-brand-text mt-2 flex-grow">{product.shortDescription}</p>
            <p className="text-lg font-bold text-brand-primary mt-2">${product.price.toFixed(2)}</p>
        </div>
    </Card>
);

interface MarketplaceProps {
    products: Product[];
    onProductClick: (product: Product) => void;
    wishlist: string[];
    onWishlistToggle: (productId: string) => void;
}

export const Marketplace: React.FC<MarketplaceProps> = ({ products, onProductClick, wishlist, onWishlistToggle }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [aiFilteredIds, setAiFilteredIds] = useState<string[] | null>(null);
    const [isAiLoading, setIsAiLoading] = useState(false);
    const [aiError, setAiError] = useState('');
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [isSuggestionsLoading, setIsSuggestionsLoading] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);


    const categories = useMemo(() => ['All', ...new Set(products.map(p => p.category))], [products]);

    const handleAiSearch = async () => {
        if (!searchTerm) return;
        setIsAiLoading(true);
        setAiError('');
        setAiFilteredIds(null);
        try {
            // The API service now handles the complex prompt generation
            const resultIds = await getAiSourcedSuggestions(searchTerm, 'productSearch');
            setAiFilteredIds(resultIds);
        } catch (error) {
            setAiError('AI Search failed. Please try a different query.');
            console.error(error);
        } finally {
            setIsAiLoading(false);
        }
    };

    const fetchSuggestions = useCallback(async (query: string) => {
        setIsSuggestionsLoading(true);
        try {
            const result = await getAiSourcedSuggestions(query, 'productSuggestion');
            if (Array.isArray(result)) {
                setSuggestions(result);
            } else {
                setSuggestions([]);
            }
        } catch (error) {
            console.error("Failed to fetch search suggestions:", error);
            setSuggestions([]);
        } finally {
            setIsSuggestionsLoading(false);
        }
    }, []);
    
    useEffect(() => {
        if (searchTerm.trim().length < 3) {
            setSuggestions([]);
            return;
        }
        setShowSuggestions(true);
        const handler = setTimeout(() => {
            fetchSuggestions(searchTerm);
        }, 500);
    
        return () => {
            clearTimeout(handler);
        };
    }, [searchTerm, fetchSuggestions]);

    const filteredProducts = useMemo(() => {
        if (aiFilteredIds) {
            return products.filter(p => aiFilteredIds.includes(p.id));
        }
        
        return products.filter(product => {
            const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
            const matchesSearch = searchTerm === '' ||
                                  product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                  product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                  product.artisanName.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [searchTerm, selectedCategory, aiFilteredIds, products]);

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-4xl font-bold font-serif text-brand-primary">Explore Handcrafted Goods</h1>
                <p className="text-gray-700 mt-2">Discover unique items from talented artisans around the world.</p>
            </div>
            
            <div className="sticky top-0 bg-brand-light/80 backdrop-blur-sm py-4 z-20 -mx-8 px-8">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-grow">
                        <input
                            type="text"
                            placeholder="Search for 'rustic wooden items under $100'..."
                            value={searchTerm}
                            onChange={e => {
                                setSearchTerm(e.target.value);
                                setAiFilteredIds(null);
                            }}
                            onFocus={() => setShowSuggestions(true)}
                            onBlur={() => {
                                setTimeout(() => setShowSuggestions(false), 200);
                            }}
                            className="w-full !pl-10"
                            autoComplete="off"
                        />
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Icon name="search" className="h-5 w-5 text-gray-400" />
                        </div>
                        {isSuggestionsLoading && (
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                <div className="w-5 h-5 border-2 border-brand-accent border-t-brand-primary rounded-full animate-spin"></div>
                            </div>
                        )}
                        {showSuggestions && suggestions.length > 0 && (
                            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-brand-accent rounded-lg shadow-lg z-30">
                                <ul className="py-1">
                                    {suggestions.map((suggestion, index) => (
                                        <li key={index}>
                                            <button
                                                className="w-full text-left px-4 py-2 text-sm text-brand-text hover:bg-brand-light"
                                                onMouseDown={(e) => {
                                                    e.preventDefault();
                                                    setSearchTerm(suggestion);
                                                    setSuggestions([]);
                                                    setShowSuggestions(false);
                                                }}
                                            >
                                                {suggestion}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                    <Button onClick={handleAiSearch} isLoading={isAiLoading}>
                        <Icon name="ai-suggestions" className="h-5 w-5 mr-1" /> AI Search
                    </Button>
                    <div className="relative">
                        <select
                            value={selectedCategory}
                            onChange={e => {
                                setSelectedCategory(e.target.value);
                                setAiFilteredIds(null);
                            }}
                            className="w-full sm:w-48 appearance-none !pr-10"
                        >
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                             <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </div>
                    </div>
                </div>
                 {aiError && <p className="text-red-500 text-sm mt-2">{aiError}</p>}
            </div>
            
            {isAiLoading ? <Spinner /> : (
              <>
                {aiFilteredIds !== null && (
                    <p className="text-center font-semibold text-brand-primary">
                        Showing {filteredProducts.length} AI-powered search results for "{searchTerm}"
                    </p>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredProducts.map(product => (
                        <ProductCard 
                            key={product.id} 
                            product={product}
                            onClick={() => onProductClick(product)}
                            isWishlisted={wishlist.includes(product.id)}
                            onWishlistToggle={(e) => {
                                e.stopPropagation();
                                onWishlistToggle(product.id);
                            }}
                        />
                    ))}
                </div>
                {filteredProducts.length === 0 && (
                    <div className="text-center py-16 col-span-full">
                        <p className="text-gray-700">No products found. Try adjusting your search or filters!</p>
                    </div>
                )}
              </>
            )}
        </div>
    );
};