'use client'
import React, { createContext, useState, useContext, ReactNode } from 'react';

export interface Address {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

interface AddressContextType {
  address: Address | null;
  setAddress: (address: Address | null) => void;
}

const AddressContext = createContext<AddressContextType | undefined>(undefined);

export const AddressProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [address, setAddress] = useState<Address | null>(null);

  return (
    <AddressContext.Provider value={{ address, setAddress }}>
      {children}
    </AddressContext.Provider>
  );
};

export const useAddress = () => {
  const context = useContext(AddressContext);
  if (context === undefined) {
    throw new Error('useAddress must be used within an AddressProvider');
  }
  return context;
};
