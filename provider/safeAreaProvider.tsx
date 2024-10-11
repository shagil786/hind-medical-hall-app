'use client'
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Capacitor } from '@capacitor/core';
import { Device } from '@capacitor/device';

interface SafeAreaInsets {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

interface SafeAreaContextType {
  insets: SafeAreaInsets;
  safeAreaClasses: string;
}

const SafeAreaContext = createContext<SafeAreaContextType | undefined>(undefined);

export const useSafeArea = () => {
  const context = useContext(SafeAreaContext);
  if (context === undefined) {
    throw new Error('useSafeArea must be used within a SafeAreaProvider');
  }
  return context;
};

// Map of known device models to their safe area configurations
const DEVICE_CONFIGS: Record<string, { hasNotch: boolean; }> = {
  'iPhone14,2': { hasNotch: true },  // iPhone 13 Pro
  'iPhone14,3': { hasNotch: true },  // iPhone 13 Pro Max
  'iPhone14,4': { hasNotch: true },  // iPhone 13 Mini
  'iPhone14,5': { hasNotch: true },  // iPhone 13
  'iPhone15,2': { hasNotch: true },  // iPhone 14 Pro
  'iPhone15,3': { hasNotch: true },  // iPhone 14 Pro Max
  'iPhone14,7': { hasNotch: true },  // iPhone 14
  'iPhone14,8': { hasNotch: true },  // iPhone 14 Plus
};

export const SafeAreaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [insets, setInsets] = useState<SafeAreaInsets>({ top: 0, bottom: 0, left: 0, right: 0 });
  const [safeAreaClasses, setSafeAreaClasses] = useState('');

  useEffect(() => {
    const setupSafeArea = async () => {
      try {
        const info = await Device.getInfo();
        console.log('Device info:', info);

        const deviceConfig = DEVICE_CONFIGS[info.model] || { hasNotch: false };
        
        // Determine device type and set appropriate classes
        const deviceClasses = [
          'safe-area-inset',
          info.platform,
          deviceConfig.hasNotch ? 'notched-device' : 'standard-device',
          info.isVirtual ? 'virtual-device' : 'physical-device'
        ].filter(Boolean).join(' ');
        
        setSafeAreaClasses(deviceClasses);
        
        // Set insets based on device configuration
        setInsets({
          top: deviceConfig.hasNotch ? 47 : 20,
          bottom: deviceConfig.hasNotch ? 34 : 0,
          left: 0,
          right: 0
        });
      } catch (error) {
        console.error('Failed to setup safe area:', error);
        setSafeAreaClasses('safe-area-inset fallback-insets');
      }
    };

    setupSafeArea();
  }, []);

  return (
    <SafeAreaContext.Provider value={{ insets, safeAreaClasses }}>
      {children}
    </SafeAreaContext.Provider>
  );
};