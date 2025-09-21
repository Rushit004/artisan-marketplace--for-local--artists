import React, { useState, useCallback } from 'react';
import { generateProductDescription } from '../services/geminiService';
import { Card } from './shared/Card';
import { Button } from './shared/Button';
import { Spinner } from './shared/Spinner';
import { Icon } from './shared/Icon';

export const AiProductDesc: React.FC = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [keywords, setKeywords] = useState<string>('');
  const [craftType, setCraftType] = useState<string>('Pottery');
  const [description, setDescription] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = useCallback(async () => {
    if (!imageFile || !keywords || !craftType) {
      setError('Please provide an image, keywords, and craft type.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setDescription('');
    try {
      const result = await generateProductDescription(imageFile, keywords, craftType);
      setDescription(result);
    } catch (err) {
      console.error("Error generating product description from AI:", err);
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  }, [imageFile, keywords, craftType]);
  
  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(description);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold font-serif text-brand-primary">AI Product Description Generator</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <div className="space-y-4">
            <div>
              <label htmlFor="image-upload" className="block text-sm font-medium text-brand-text mb-1">Product Image</label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-brand-accent border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  {previewUrl ? (
                    <img src={previewUrl} alt="Preview" className="mx-auto h-48 w-auto object-cover rounded-md" />
                  ) : (
                    <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                  <div className="flex text-sm text-gray-600">
                    <label htmlFor="image-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-brand-primary hover:text-brand-secondary focus-within:outline-none">
                      <span>Upload a file</span>
                      <input id="image-upload" name="image-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/*" />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="craftType" className="block text-sm font-medium text-brand-text">Craft Type</label>
              <input type="text" id="craftType" value={craftType} onChange={(e) => setCraftType(e.target.value)} className="mt-1 block w-full" placeholder="e.g., Hand-blown Glass Vase" />
            </div>

            <div>
              <label htmlFor="keywords" className="block text-sm font-medium text-brand-text">Keywords</label>
              <input type="text" id="keywords" value={keywords} onChange={(e) => setKeywords(e.target.value)} className="mt-1 block w-full" placeholder="e.g., minimalist, earthy tones, rustic" />
            </div>

            <Button onClick={handleSubmit} isLoading={isLoading} disabled={!imageFile || !keywords || !craftType}>
              Generate Description
            </Button>
            {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
          </div>
        </Card>
        
        <Card title="Generated Description">
          {isLoading && <Spinner />}
          {!isLoading && !description && (
             <div className="text-center text-gray-500 py-16">
                Your AI-generated description will appear here.
             </div>
          )}
          {description && (
            <div className="relative">
              <pre className="whitespace-pre-wrap font-sans text-brand-text text-sm leading-relaxed">{description}</pre>
              <button onClick={handleCopyToClipboard} className="absolute top-0 right-0 p-2 text-gray-500 hover:text-brand-primary transition-colors">
                  <Icon name="copy" className="h-5 w-5" />
                  {copied && <span className="absolute -top-6 right-0 text-xs bg-brand-primary text-white px-2 py-1 rounded">Copied!</span>}
              </button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};