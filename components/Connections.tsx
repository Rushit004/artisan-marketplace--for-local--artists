import React, { useState, useMemo } from 'react';
import type { ArtisanProfile } from '../types';
import { Card } from './shared/Card';
import { Button } from './shared/Button';
import { Icon } from './shared/Icon';
import { Spinner } from './shared/Spinner';
import { getAiSourcedSuggestions } from '../services/apiService';
import { FOLLOWERS_DATA } from '../constants';

interface ConnectionsProps {
  currentUser: ArtisanProfile;
  allArtisans: ArtisanProfile[];
  onViewArtisan: (artisan: ArtisanProfile) => void;
  followingIds: string[];
}

const ArtisanCard: React.FC<{ artisan: ArtisanProfile; onViewProfile: () => void; }> = ({ artisan, onViewProfile }) => (
    <Card className="text-center flex flex-col items-center">
        <img src={artisan.avatarUrl} alt={artisan.name} className="w-24 h-24 rounded-full mx-auto ring-4 ring-brand-accent/30" />
        <h3 className="mt-4 font-bold text-lg text-brand-primary">{artisan.name}</h3>
        <p className="text-sm text-gray-600">{artisan.specialty}</p>
        <p className="text-xs text-gray-600 mt-1">{artisan.location}</p>
        <Button onClick={onViewProfile} variant="secondary" className="mt-4 w-full">View Profile</Button>
    </Card>
);

export const Connections: React.FC<ConnectionsProps> = ({ currentUser, allArtisans, onViewArtisan, followingIds }) => {
    const [activeTab, setActiveTab] = useState<'discover' | 'following' | 'followers'>('discover');
    const [searchTerm, setSearchTerm] = useState('');
    const [isAiLoading, setIsAiLoading] = useState(false);
    const [aiError, setAiError] = useState('');
    const [aiRecommendedIds, setAiRecommendedIds] = useState<string[] | null>(null);

    const otherArtisans = useMemo(() => allArtisans.filter(a => a.id !== currentUser.id), [allArtisans, currentUser.id]);

    const handleAiRecommendation = async () => {
        if (!searchTerm) return;
        setIsAiLoading(true);
        setAiError('');
        setAiRecommendedIds(null);
        try {
            const resultIds = await getAiSourcedSuggestions(searchTerm, 'connectionRecommendation', currentUser);
            setAiRecommendedIds(resultIds);
            setActiveTab('discover'); // Switch to discover tab to show results
        } catch (error) {
            setAiError('AI Recommendation failed. Please try a different query.');
            console.error(error);
        } finally {
            setIsAiLoading(false);
        }
    };

    const tabs = {
        discover: {
            label: 'Discover',
            data: otherArtisans
        },
        following: {
            label: `Following (${followingIds.length})`,
            data: allArtisans.filter(a => a.id && followingIds.includes(a.id))
        },
        followers: {
            label: `Followers (${FOLLOWERS_DATA.length})`,
            data: allArtisans.filter(a => a.id && FOLLOWERS_DATA.includes(a.id))
        }
    };

    const displayedArtisans = useMemo(() => {
        let artisans: ArtisanProfile[] = [];

        if (aiRecommendedIds) {
            artisans = otherArtisans.filter(a => a.id && aiRecommendedIds.includes(a.id));
        } else {
            artisans = tabs[activeTab].data;
        }

        if (searchTerm && !aiRecommendedIds) {
            return artisans.filter(artisan => 
                artisan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                artisan.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
                artisan.location.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        
        return artisans;
    }, [activeTab, searchTerm, otherArtisans, allArtisans, followingIds, aiRecommendedIds]);
    
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        setAiRecommendedIds(null); // Clear AI results on manual search change
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold font-serif text-brand-primary">Connections</h1>
            
            <div className="sticky top-0 bg-brand-light/80 backdrop-blur-sm py-4 z-20">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-grow">
                        <input
                            type="text"
                            placeholder="Search by name, specialty, or location..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                            className="w-full !pl-10"
                        />
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Icon name="search" className="h-5 w-5 text-gray-400" />
                        </div>
                    </div>
                    <Button onClick={handleAiRecommendation} isLoading={isAiLoading}>
                        <Icon name="ai-suggestions" className="h-5 w-5 mr-1" /> AI Recommendations
                    </Button>
                </div>
                 {aiError && <p className="text-red-500 text-sm mt-2">{aiError}</p>}
            </div>

            <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                    {Object.entries(tabs).map(([key, { label }]) => (
                        <button
                            key={key}
                            onClick={() => {
                                setActiveTab(key as any);
                                setAiRecommendedIds(null); // Clear AI results when changing tabs
                            }}
                            className={`${
                                activeTab === key
                                ? 'border-brand-primary text-brand-primary'
                                : 'border-transparent text-gray-600 hover:text-gray-700 hover:border-gray-300'
                            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                        >
                            {label}
                        </button>
                    ))}
                </nav>
            </div>
            
            {isAiLoading ? <Spinner /> : (
              <>
                {aiRecommendedIds !== null && (
                    <p className="text-center font-semibold text-brand-primary">
                        Showing {displayedArtisans.length} AI-powered recommendations for "{searchTerm}"
                    </p>
                )}
                {displayedArtisans.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {displayedArtisans.map(artisan => (
                            <ArtisanCard 
                                key={artisan.id} 
                                artisan={artisan} 
                                onViewProfile={() => onViewArtisan(artisan)} 
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <Icon name="users" className="h-16 w-16 text-brand-primary/20 mx-auto" />
                        <h2 className="mt-4 text-xl font-semibold text-brand-primary">No Artisans Found</h2>
                        <p className="mt-2 text-gray-700">Try adjusting your search or exploring the discover tab.</p>
                    </div>
                )}
              </>
            )}
        </div>
    );
};