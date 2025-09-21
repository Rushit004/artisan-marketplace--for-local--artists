import React, { useState } from 'react';
import type { ArtisanProfile, PortfolioItem } from '../types';
import { Card } from './shared/Card';
import { Button } from './shared/Button';
import { Icon } from './shared/Icon';
import { PortfolioForm } from './PortfolioForm';

interface ProfileProps {
  user: ArtisanProfile;
  onSave: (updatedProfile: ArtisanProfile) => void;
  isCurrentUser: boolean;
  onBack?: () => void;
  onToggleFollow: (artisanId: string) => void;
  followingIds: string[];
}

const InfoRow: React.FC<{ label: string; value?: string }> = ({ label, value }) => (
    value ? <p><span className="font-semibold text-brand-primary">{label}:</span> {value}</p> : null
);

const InputField: React.FC<{
    label: string;
    id: keyof ArtisanProfile;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}> = ({ label, id, value, onChange }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-brand-text mb-1">{label}</label>
        <input type="text" id={id} name={id} value={value} onChange={onChange} className="w-full" />
    </div>
);

const PortfolioItemCard: React.FC<{ 
    item: PortfolioItem;
    isEditing: boolean;
    onEdit: () => void;
    onDelete: () => void;
}> = ({ item, isEditing, onEdit, onDelete }) => (
    <Card className="flex flex-col group">
        <img src={item.imageUrl} alt={item.title} className="w-full h-48 object-cover rounded-t-xl" />
        <div className="p-4 flex flex-col flex-grow">
            <h4 className="font-bold text-brand-primary">{item.title}</h4>
            <p className="text-sm text-gray-600 mt-1 flex-grow">{item.description}</p>
            {isEditing && (
                <div className="flex gap-2 mt-4">
                    <Button onClick={onEdit} variant="secondary" className="w-full !py-1 text-sm">Edit</Button>
                    <button onClick={onDelete} className="w-full text-center text-sm py-1 px-4 rounded-lg text-red-600 hover:bg-red-100 transition-colors">Delete</button>
                </div>
            )}
        </div>
    </Card>
);

export const Profile: React.FC<ProfileProps> = ({ user, onSave, isCurrentUser, onBack, onToggleFollow, followingIds }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({ ...user, portfolio: user.portfolio || [] });
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [isPortfolioModalOpen, setIsPortfolioModalOpen] = useState(false);
    const [editingPortfolioItem, setEditingPortfolioItem] = useState<PortfolioItem | null>(null);

    const canEdit = isCurrentUser;
    const isFollowing = user.id ? followingIds.includes(user.id) : false;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result as string;
                setAvatarPreview(result);
                setFormData(prev => ({ ...prev, avatarUrl: result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
        setIsEditing(false);
        setAvatarPreview(null);
    };

    const handleCancel = () => {
        setFormData({ ...user, portfolio: user.portfolio || [] });
        setIsEditing(false);
        setAvatarPreview(null);
    };

    const handleAddNewPortfolioItem = () => {
        setEditingPortfolioItem(null);
        setIsPortfolioModalOpen(true);
    };

    const handleEditPortfolioItem = (item: PortfolioItem) => {
        setEditingPortfolioItem(item);
        setIsPortfolioModalOpen(true);
    };

    const handleDeletePortfolioItem = (itemId: string) => {
        if(window.confirm('Are you sure you want to delete this portfolio item?')) {
            setFormData(prev => ({
                ...prev,
                portfolio: prev.portfolio.filter(item => item.id !== itemId)
            }));
        }
    };

    const handleSavePortfolioItem = (itemToSave: PortfolioItem) => {
        if (editingPortfolioItem) {
            // Edit
            setFormData(prev => ({
                ...prev,
                portfolio: prev.portfolio.map(item => item.id === itemToSave.id ? itemToSave : item)
            }));
        } else {
            // Add new
            setFormData(prev => ({
                ...prev,
                portfolio: [...prev.portfolio, { ...itemToSave, id: `p${Date.now()}`}]
            }));
        }
        setIsPortfolioModalOpen(false);
    };

    const currentAvatar = avatarPreview || user.avatarUrl;

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            {onBack && (
                <button onClick={onBack} className="flex items-center gap-2 text-sm font-semibold text-brand-primary hover:text-brand-primary/80 transition-colors mb-4">
                    <Icon name="arrow-left" className="h-4 w-4" />
                    Go Back
                </button>
            )}
            <Card>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-1 flex flex-col items-center text-center">
                        <div className="relative">
                            <img src={currentAvatar} alt={user.name} className="w-40 h-40 rounded-full object-cover ring-4 ring-brand-accent/50" />
                            {canEdit && isEditing && (
                                <label htmlFor="avatar-upload" className="absolute bottom-2 right-2 bg-brand-primary text-white p-2 rounded-full hover:bg-opacity-90 transition-colors cursor-pointer">
                                    <Icon name="camera" className="h-5 w-5" />
                                    <input id="avatar-upload" type="file" className="sr-only" accept="image/*" onChange={handleAvatarChange} />
                                </label>
                            )}
                        </div>
                        {canEdit && !isEditing && (
                            <Button onClick={() => setIsEditing(true)} className="mt-6 w-full">Edit Profile</Button>
                        )}
                         {!canEdit && user.id && (
                             <Button 
                                onClick={() => onToggleFollow(user.id!)}
                                variant={isFollowing ? 'secondary' : 'primary'}
                                className="mt-6 w-full"
                             >
                                {isFollowing ? 'Following' : 'Follow'}
                             </Button>
                         )}
                    </div>

                    <div className="md:col-span-2">
                        {!isEditing || !canEdit ? (
                            <div className="space-y-4">
                                <div>
                                    <h1 className="text-4xl font-serif text-brand-primary">{user.name}</h1>
                                    <p className="text-lg text-gray-600 mt-1">{user.specialty}</p>
                                </div>
                                <div className="space-y-2 pt-4 border-t border-brand-accent/30">
                                    <InfoRow label="Experience" value={user.experience} />
                                    <InfoRow label="Availability" value={user.availability} />
                                    <InfoRow label="Location" value={user.location} />
                                    <InfoRow label="Workshop" value={user.workplace} />
                                </div>
                                <div className="space-y-2 pt-4 border-t border-brand-accent/30">
                                    <InfoRow label="Contact" value={user.phone} />
                                    <InfoRow label="Instagram" value={user.instagram} />
                                </div>
                            </div>
                        ) : (
                            <form onSubmit={handleSave} className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <InputField label="Full Name" id="name" value={formData.name} onChange={handleChange} />
                                    <InputField label="Specialty" id="specialty" value={formData.specialty} onChange={handleChange} />
                                </div>
                                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <InputField label="Experience" id="experience" value={formData.experience} onChange={handleChange} />
                                    <InputField label="Availability" id="availability" value={formData.availability} onChange={handleChange} />
                                </div>
                                <InputField label="Location" id="location" value={formData.location} onChange={handleChange} />
                                <InputField label="Workshop / Studio" id="workplace" value={formData.workplace} onChange={handleChange} />
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <InputField label="Phone" id="phone" value={formData.phone} onChange={handleChange} />
                                    <InputField label="Instagram Handle" id="instagram" value={formData.instagram} onChange={handleChange} />
                                </div>
                                <div className="flex gap-4 pt-2">
                                    <Button type="submit">Save Changes</Button>
                                    <Button type="button" variant="secondary" onClick={handleCancel}>Cancel</Button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </Card>

            <Card>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-serif text-brand-primary">Portfolio</h2>
                    {canEdit && isEditing && (
                        <Button onClick={handleAddNewPortfolioItem}>Add Portfolio Item</Button>
                    )}
                </div>
                {(canEdit && isEditing ? formData.portfolio : user.portfolio)?.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {(canEdit && isEditing ? formData.portfolio : user.portfolio)?.map(item => (
                            <PortfolioItemCard
                                key={item.id}
                                item={item}
                                isEditing={canEdit && isEditing}
                                onEdit={() => handleEditPortfolioItem(item)}
                                onDelete={() => handleDeletePortfolioItem(item.id)}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 border-2 border-dashed border-brand-accent/50 rounded-lg">
                        <p className="text-gray-600">
                            {canEdit && isEditing ? "Add items to your portfolio to showcase your best work." : "This artisan hasn't added any portfolio items yet."}
                        </p>
                    </div>
                )}
            </Card>

            {isPortfolioModalOpen && (
                <PortfolioForm 
                    item={editingPortfolioItem}
                    onSave={handleSavePortfolioItem}
                    onClose={() => setIsPortfolioModalOpen(false)}
                />
            )}
        </div>
    );
};