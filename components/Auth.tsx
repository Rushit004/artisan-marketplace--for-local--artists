import React, { useState, useEffect } from 'react';
import { Button } from './shared/Button';
import { Card } from './shared/Card';
import type { UserRegistration } from '../types';
import * as api from '../services/apiService';

interface AuthProps {
  onLogin: (email: string, password: string, rememberMe: boolean) => Promise<void>;
  onRegister: (registration: UserRegistration) => void;
}

export const Auth: React.FC<AuthProps> = ({ onLogin, onRegister }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [authStep, setAuthStep] = useState<'credentials' | 'otp'>('credentials');
  const [registrationData, setRegistrationData] = useState<UserRegistration | null>(null);
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [notification, setNotification] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mockEmailBody, setMockEmailBody] = useState<string | null>(null);

  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    let timer: number;
    if (resendCooldown > 0) {
      timer = window.setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCooldown]);


  const handleCredentialSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setNotification('');
    setIsLoading(true);
    setMockEmailBody(null);
    
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
        if (isLogin) {
            const rememberMe = (formData.get('remember-me') as string) === 'on';
            await onLogin(email, password, rememberMe);
            // Parent handles success
        } else {
            const name = formData.get('name') as string;
            setRegistrationData({ name, email, password });
            const receivedOtp = await api.sendOtp(email);
            setNotification(`A verification code has been sent to ${email}.`);
            setMockEmailBody(`Hi ${name.split(' ')[0]},<br/><br/>Your verification code is: <strong class="text-xl tracking-wider">${receivedOtp}</strong>`);
            setResendCooldown(30);
            setAuthStep('otp');
        }
    } catch(err) {
        console.error("Authentication error:", err);
        setError((err as Error).message || 'An unknown error occurred.');
    } finally {
        setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setError('');
      setNotification('');
      setIsLoading(true);

      if (registrationData) {
          try {
              const isValid = await api.verifyOtp(registrationData.email, otp);
              if (isValid) {
                  onRegister(registrationData);
                  setNotification('Registration successful! Please sign in.');
                  setIsLogin(true);
                  setAuthStep('credentials');
                  setOtp('');
                  setRegistrationData(null);
                  setMockEmailBody(null);
              } else {
                   setError('Invalid OTP. Please try again.');
              }
          } catch (err) {
              console.error("OTP verification error:", err);
              setError((err as Error).message);
              setAuthStep('credentials');
          }
      } else {
         setError('Registration session expired. Please start over.');
         setAuthStep('credentials');
      }
      setIsLoading(false);
  };
  
  const handleResendOtp = async () => {
    if (resendCooldown === 0 && registrationData) {
        setError('');
        setNotification('');
        try {
            const receivedOtp = await api.sendOtp(registrationData.email);
            setNotification(`A new verification code has been sent.`);
            setMockEmailBody(`Hi ${registrationData.name.split(' ')[0]},<br/><br/>Your new verification code is: <strong class="text-xl tracking-wider">${receivedOtp}</strong>`);
            setResendCooldown(30);
        } catch (err) {
            setError((err as Error).message);
        }
    }
  };
  
  const resetFormState = () => {
      setIsLogin(!isLogin);
      setError('');
      setNotification('');
      setMockEmailBody(null);
      setAuthStep('credentials');
  };

  const renderCredentialForm = () => (
    <form onSubmit={handleCredentialSubmit} className="space-y-4">
      {!isLogin && (
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-brand-text">Full Name</label>
          <input type="text" id="name" name="name" required className="mt-1 block w-full" placeholder="e.g., Jane Doe" disabled={isLoading} />
        </div>
      )}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-brand-text">Email address</label>
        <input type="email" id="email" name="email" autoComplete="email" required className="mt-1 block w-full" placeholder="you@example.com" disabled={isLoading} />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-brand-text">Password</label>
        <input id="password" name="password" type="password" autoComplete={isLogin ? "current-password" : "new-password"} required className="mt-1 block w-full" disabled={isLoading} />
      </div>

      {isLogin && (
          <div className="flex items-center justify-between">
              <div className="flex items-center">
                  <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-brand-primary focus:ring-brand-primary border-gray-300 rounded" disabled={isLoading}/>
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-brand-text">Remember me</label>
              </div>
              <div className="text-sm">
                  <a href="#" onClick={(e) => { e.preventDefault(); alert("Feature coming soon!"); }} className="font-medium text-brand-primary hover:text-brand-primary">Forgot your password?</a>
              </div>
          </div>
      )}

      {error && <p className="text-red-700 text-sm text-center">{error}</p>}
      {notification && <p className="text-green-800 text-sm text-center">{notification}</p>}

      <Button type="submit" className="w-full" isLoading={isLoading}>
        {isLoading ? (isLogin ? 'Signing In...' : 'Proceeding...') : (isLogin ? 'Sign In' : 'Create Account')}
      </Button>
    </form>
  );

  const renderOtpForm = () => (
    <form onSubmit={handleOtpSubmit} className="space-y-4">
        <div className="text-center">
             <h3 className="text-xl font-semibold text-brand-primary">Verify Your Account</h3>
             <p className="text-sm text-gray-600 mt-1">
                Please enter the 6-digit code sent to <br/>
                <span className="font-medium text-brand-text">{registrationData?.email}</span>
             </p>
        </div>

        <div>
            <label htmlFor="otp" className="sr-only">Enter OTP</label>
            <input 
                type="text" 
                id="otp" 
                name="otp" 
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength={6}
                autoComplete="one-time-code"
                required 
                className="mt-1 block w-full text-center text-2xl tracking-[0.5em]"
                placeholder="------"
                disabled={isLoading}
            />
        </div>

        {error && <p className="text-red-700 text-sm text-center">{error}</p>}
        {notification && !error && <p className="text-green-800 text-sm text-center">{notification}</p>}
        
        <Button type="submit" className="w-full" isLoading={isLoading}>
            {isLoading ? 'Verifying...' : 'Verify & Create Account'}
        </Button>
        <div className="text-center text-sm">
            <button 
                type="button" 
                onClick={handleResendOtp}
                disabled={resendCooldown > 0}
                className="text-brand-primary hover:underline disabled:text-gray-400 disabled:no-underline"
            >
                {resendCooldown > 0 ? `Resend code in ${resendCooldown}s` : 'Resend code'}
            </button>
        </div>
        <button 
            type="button" 
            onClick={() => { setAuthStep('credentials'); setError(''); setMockEmailBody(null); }} 
            className="w-full text-center text-sm text-gray-600 hover:underline"
        >
            Back
        </button>
    </form>
  );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-brand-light p-4">
      <div className="w-full max-w-md">
        <h1 className="text-4xl font-bold font-serif text-brand-primary text-center mb-8">
          Welcome to Artisan Marketplace
        </h1>
        <Card>
          {authStep === 'credentials' && (
            <div className="mb-6 border-b border-brand-accent/50">
                <nav className="-mb-px flex justify-center space-x-8">
                <button
                    onClick={() => resetFormState()}
                    className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                    isLogin
                        ? 'border-brand-primary text-brand-primary'
                        : 'border-transparent text-gray-600 hover:text-gray-700 hover:border-gray-300'
                    }`}
                >
                    Sign In
                </button>
                <button
                    onClick={() => resetFormState()}
                    className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                    !isLogin
                        ? 'border-brand-primary text-brand-primary'
                        : 'border-transparent text-gray-600 hover:text-gray-700 hover:border-gray-300'
                    }`}
                >
                    Create Account
                </button>
                </nav>
            </div>
          )}

          {authStep === 'credentials' ? renderCredentialForm() : renderOtpForm()}
        </Card>
      </div>

      {mockEmailBody && (
        <div className="mt-6 w-full max-w-md p-4 bg-white/80 border border-brand-accent/50 rounded-lg shadow-md backdrop-blur-sm">
          <h3 className="font-semibold text-sm text-brand-primary">[Mock Inbox: For Demo Purposes]</h3>
          <div className="mt-2 p-3 bg-white rounded border border-gray-200">
            <p className="text-xs text-gray-500">To: {registrationData?.email}</p>
            <p className="text-xs font-semibold text-gray-800">Subject: Your Verification Code</p>
            <div 
              className="mt-2 pt-2 border-t border-gray-200 text-sm text-brand-text"
              dangerouslySetInnerHTML={{ __html: mockEmailBody }} 
            />
          </div>
        </div>
      )}
    </div>
  );
};