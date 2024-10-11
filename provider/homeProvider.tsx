"use client"
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

// Define types for our data
type Offer = {
  id: string;
  title: string;
  description: string;
  discount: number;
  // Add other relevant fields
};

type Order = {
  id: string;
  status: string;
  items: string[];
  total: number;
  // Add other relevant fields
};

// Define the shape of our context
type HomeContextType = {
  offers: Offer[];
  currentOrders: Order[];
  isLoading: boolean;
  error: string | null;
};

// Create the context
const HomeContext = createContext<HomeContextType | undefined>(undefined);

// Create a provider component
export const HomeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [currentOrders, setCurrentOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch offers
        const offersResponse = await axios.get('/api/offers');
        setOffers(offersResponse.data);

        // Fetch current orders
        const ordersResponse = await axios.get('/api/current-orders');
        setCurrentOrders(ordersResponse.data);

        setError(null);
      } catch (err) {
        setError('Failed to fetch data. Please try again later.');
        console.error('Error fetching data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const value = {
    offers,
    currentOrders,
    isLoading,
    error,
  };

  return <HomeContext.Provider value={value}>{children}</HomeContext.Provider>;
};

// Create a custom hook for using this context
export const useHome = () => {
  const context = useContext(HomeContext);
  if (context === undefined) {
    throw new Error('useHome must be used within a HomeProvider');
  }
  return context;
};
