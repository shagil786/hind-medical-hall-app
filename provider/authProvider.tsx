'use client';

import React, { createContext, useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  name: string;
  email: string;
  address: string;
  phone: string;
}

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string, otp?: string) => Promise<void>;
  signup: (name: string, email: string, password: string, phone: string) => Promise<void>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, newPassword: string) => Promise<void>;
  show: boolean;
  handleShow: () => void;
  mode: 'login' | 'signup' | 'forgotPassword';
  setMode: (mode: 'login' | 'signup' | 'forgotPassword') => void;
  sendOTP: (email: string) => Promise<{ success: boolean }>;
  verifyOTP: (code: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [show, setShow] = useState(false);
  const [mode, setMode] = useState<'login' | 'signup' | 'forgotPassword'>('login');
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in on initial load
    const checkLoggedIn = async () => {
      try {
        // Replace this with your actual API call to verify the token
        const response = await fetch('/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      } finally {
        setLoading(false);
      }
    };

    checkLoggedIn();
  }, []);

  const login = async (email: string, password: string) => {
   
  };

  const signup = async (name: string, email: string, password: string) => {
   
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    router.push('/login');
  };

  const forgotPassword = async (email: string) => {
    
  };

  const resetPassword = async (token: string, newPassword: string) => {
    
  };

  const handleShow = () => {
    setShow(prev => !prev);
  };

  const sendOTP = async (email: string): Promise<{ success: boolean }> => {
    // Implement your OTP sending logic here
    // ...
    return { success: true }; // or { success: false } if there's an error
  };

  const verifyOTP = async (code: string) => {
    // Implement OTP verification logic here
    // Return { success: true } if OTP was verified successfully
  };

  const value = {
    user,
    // user: {
    //     id: '123',
    //     name: 'Dr. Sarah Johnson',
    //     email: 'sarah.johnson@pharmacy.com',
    //     phone: '+1 555-123-4567',
    //     address: '123 Medical Center Drive'
    //   },
    loading,
    login,
    signup,
    logout,
    forgotPassword,
    resetPassword,
    show,
    handleShow,
    mode,
    setMode,
    sendOTP,
    verifyOTP,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
