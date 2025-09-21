import React, { useState, useEffect, useCallback } from 'react';
import { getArtisanSuggestions } from '../services/geminiService';
import { Card } from './shared/Card';
import { Spinner } from './shared/Spinner';
import { Button } from './shared/Button';
import type { ArtisanProfile } from '../types';

interface AiSuggestionsProps {
  user: ArtisanProfile;
}

export const AiSuggestions: React.FC<AiSuggestionsProps> = ({ user }) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSuggestions = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await getArtisanSuggestions(user);
      setSuggestions(result);
    } catch (err) {
      console.error("Error fetching AI suggestions:", err);
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchSuggestions();
  }, [fetchSuggestions]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold font-serif text-brand-primary">AI Growth Suggestions</h1>
          <p className="text-gray-600 mt-1">Personalized ideas to help you grow your craft business.</p>
        </div>
        <Button onClick={fetchSuggestions} isLoading={isLoading} variant="secondary">
          Get New Suggestions
        </Button>
      </div>
      
      {isLoading && <Spinner />}
      
      {error && (
        <Card className="bg-red-50 border-red-200">
          <p className="text-red-700 font-semibold">An error occurred:</p>
          <p className="text-red-600">{error}</p>
        </Card>
      )}

      {!isLoading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {suggestions.map((suggestion, index) => (
            <Card key={index} className="flex flex-col hover:border-brand-accent border-2 border-transparent transition-all">
                <p className="text-brand-text leading-relaxed">{suggestion}</p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};