/**
 * @file This file simulates a backend API service.
 * In a real application, this file would contain fetch calls to a REST or GraphQL API.
 * For now, it uses mock data and simulates asynchronous behavior with Promises.
 */
import { ARTISAN_PROFILE, PRODUCTS_DATA, OTHER_ARTISANS_DATA, SALES_DATA, PROFIT_DATA, ENGAGEMENT_DATA } from '../constants';
import type { ArtisanProfile, Product, UserRegistration } from '../types';
import * as gemini from './geminiService';

// --- MOCK DATABASE ---
let usersDb: Record<string, { password: string; profile: ArtisanProfile }> = {
  'elena@example.com': { password: 'password123', profile: ARTISAN_PROFILE }
};
let productsDb: Product[] = [...PRODUCTS_DATA];
let artisansDb: ArtisanProfile[] = [...OTHER_ARTISANS_DATA, ARTISAN_PROFILE];

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// --- AUTHENTICATION ---

const JWT_KEY = 'artisan_ai_jwt';
const REMEMBER_ME_KEY = 'artisan_ai_remember_me';
const OTP_STORAGE_PREFIX = 'artisan_ai_otp_';

// Simulates creating a JWT token
const createToken = (profile: ArtisanProfile) => `mock_jwt_token_for_${profile.id}`;

// Simulates decoding a JWT token
const decodeToken = (token: string): ArtisanProfile | null => {
    if (token.startsWith('mock_jwt_token_for_')) {
        const userId = token.replace('mock_jwt_token_for_', '');
        return artisansDb.find(a => a.id === userId) || null;
    }
    return null;
}

export const login = async (email: string, password: string, rememberMe: boolean): Promise<ArtisanProfile> => {
    await delay(500);
    const userRecord = usersDb[email.toLowerCase()];
    if (userRecord && userRecord.password === password) {
        const token = createToken(userRecord.profile);
        sessionStorage.setItem(JWT_KEY, token);
        if (rememberMe) {
            localStorage.setItem(REMEMBER_ME_KEY, token);
        } else {
            localStorage.removeItem(REMEMBER_ME_KEY);
        }
        return userRecord.profile;
    }
    throw new Error('Invalid email or password.');
};

/**
 * Simulates sending an OTP to a user's email and returns the OTP for demo purposes.
 * In a real application, this would trigger a backend service to send an email.
 * Here, we generate an OTP, store it in sessionStorage, and return it.
 */
export const sendOtp = async (email: string): Promise<string> => {
    await delay(700);
    if (usersDb[email.toLowerCase()]) {
        throw new Error("An account with this email already exists.");
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // In a real app, the server would store this hash, not the client.
    // This is for simulation purposes ONLY.
    sessionStorage.setItem(`${OTP_STORAGE_PREFIX}${email}`, otp);
    // Log to console for developer convenience.
    console.log(`%c[ArtisanAI Demo] OTP for ${email}: ${otp}`, 'color: #A07D5E; font-weight: bold;');
    // Return the OTP so the frontend can display it in a mock inbox.
    return otp;
};

/**
 * Verifies the OTP entered by the user.
 */
export const verifyOtp = async (email: string, otp: string): Promise<boolean> => {
    await delay(500);
    const storedOtp = sessionStorage.getItem(`${OTP_STORAGE_PREFIX}${email}`);
    if (storedOtp && storedOtp === otp) {
        sessionStorage.removeItem(`${OTP_STORAGE_PREFIX}${email}`); // OTP is single-use
        return true;
    }
    return false;
};


export const register = async (registration: UserRegistration): Promise<{ user: ArtisanProfile }> => {
    await delay(500);
    // Double-check just in case, though sendOtp should have caught it.
    if (usersDb[registration.email.toLowerCase()]) {
        throw new Error("An account with this email already exists.");
    }

    const newUserProfile: ArtisanProfile = {
      id: `user${Date.now()}`,
      name: registration.name,
      specialty: 'Handcrafted Goods',
      avatarUrl: `https://picsum.photos/seed/${registration.name.split(' ')[0] || 'new'}/100/100`,
      location: 'Online',
      experience: 'New Artisan',
      availability: 'Accepting Commissions',
      workplace: 'Online Studio',
      phone: '',
      instagram: '',
    };
    
    usersDb[registration.email.toLowerCase()] = { password: registration.password, profile: newUserProfile };
    artisansDb.push(newUserProfile);
    
    // Registration successful, but don't log in automatically.
    // The user will be redirected to the sign-in page.
    return { user: newUserProfile };
};

export const logout = () => {
    sessionStorage.removeItem(JWT_KEY);
    localStorage.removeItem(REMEMBER_ME_KEY);
    localStorage.removeItem('lastView');
};

export const checkSession = async (): Promise<ArtisanProfile | null> => {
    await delay(200);
    let token = sessionStorage.getItem(JWT_KEY);
    if (!token) {
        token = localStorage.getItem(REMEMBER_ME_KEY);
        if (token) {
            sessionStorage.setItem(JWT_KEY, token);
        }
    }
    if (token) {
        return decodeToken(token);
    }
    return null;
}

const getAuthHeaders = () => {
    const token = sessionStorage.getItem(JWT_KEY);
    if (!token) throw new Error("Not authenticated");
    return { 'Authorization': `Bearer ${token}` };
};

// --- DATA FETCHING ---

export const getProducts = async (): Promise<Product[]> => {
    await delay(300);
    // In a real app: const response = await fetch('/api/products');
    return [...productsDb];
};

export const getArtisans = async (): Promise<ArtisanProfile[]> => {
    await delay(300);
    return [...artisansDb];
};

export const updateProfile = async (profile: ArtisanProfile): Promise<ArtisanProfile> => {
    getAuthHeaders(); // check for auth
    await delay(400);
    artisansDb = artisansDb.map(a => a.id === profile.id ? profile : a);
    
    // Also update in the user DB if they are a registered user
    const userEmail = Object.keys(usersDb).find(email => usersDb[email].profile.id === profile.id);
    if(userEmail) {
        usersDb[userEmail].profile = profile;
    }

    return profile;
}

export const getDashboardData = async () => {
    getAuthHeaders();
    await delay(600);
    return {
        sales: SALES_DATA,
        profit: PROFIT_DATA,
        engagement: ENGAGEMENT_DATA,
    }
}

// --- PRODUCT CRUD ---

export const createProduct = async (productData: Omit<Product, 'id'>): Promise<Product> => {
    getAuthHeaders();
    await delay(400);
    const newProduct: Product = {
        ...productData,
        id: `prod${Date.now()}`
    };
    productsDb.push(newProduct);
    return newProduct;
}

export const updateProduct = async (productData: Product): Promise<Product> => {
    getAuthHeaders();
    await delay(400);
    productsDb = productsDb.map(p => p.id === productData.id ? productData : p);
    return productData;
}

export const deleteProduct = async (productId: string): Promise<void> => {
    getAuthHeaders();
    await delay(400);
    productsDb = productsDb.filter(p => p.id !== productId);
}

// --- AI-Powered Services ---
type AISuggestionType = 'productSearch' | 'productSuggestion' | 'connectionRecommendation';

export const getAiSourcedSuggestions = async (
    query: string, 
    type: AISuggestionType,
    currentUser?: ArtisanProfile
): Promise<string[]> => {
    let prompt = '';
    switch(type) {
        case 'productSearch':
            prompt = `
                You are a smart search assistant for an artisan marketplace.
                Analyze the user's query: "${query}"
                And search through the following products:
                ${JSON.stringify(productsDb.map(({id, name, category, price, description}) => ({id, name, category, price, description})))}
                Return a JSON array of product IDs that best match the query.
                Only return the JSON array, nothing else. Example: ["prod1", "prod7"]
            `;
            break;
        case 'productSuggestion':
             prompt = `
                You are a search suggestion assistant for an artisan marketplace.
                Based on the user's partial query "${query}", provide up to 4 relevant search suggestions.
                Return ONLY a JSON array of strings. Example: ["handmade ceramic mugs", "wooden cutting boards", "gifts under $50"]
            `;
            break;
        case 'connectionRecommendation':
            if (!currentUser) throw new Error("Current user is required for connection recommendations.");
            const otherArtisans = artisansDb.filter(a => a.id !== currentUser.id);
             prompt = `
                You are a networking assistant for an artisan marketplace.
                The current user is ${currentUser.name}, a specialist in ${currentUser.specialty}.
                The user is searching for other artisans with the query: "${query}".
                Here is a list of available artisans:
                ${JSON.stringify(otherArtisans.map(({id, name, specialty, location, experience}) => ({id, name, specialty, location, experience})))}
                Return a JSON array of artisan IDs that would be a good connection or collaboration match.
                Only return the JSON array of IDs. Example: ["user2", "user4"]
            `;
            break;
    }

    // This is now an "internal" call within our mock backend.
    // In a real app, the backend server would make this call to the Gemini API.
    return gemini.getAiSourcedSuggestions(prompt);
};