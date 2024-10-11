import { Capacitor } from '@capacitor/core';
import { Geolocation as CapacitorGeolocation } from '@capacitor/geolocation';

interface GeolocationPosition {
  coords: {
    latitude: number;
    longitude: number;
  };
}

export const useGeolocation = () => {
  const isCapacitor = Capacitor.isNativePlatform();

  const getCurrentLocation = async (): Promise<GeolocationPosition> => {
    try {
      if (isCapacitor) {
        // Capacitor implementation
        const permissionStatus = await CapacitorGeolocation.checkPermissions();
        
        if (permissionStatus.location !== 'granted') {
          const requestResult = await CapacitorGeolocation.requestPermissions();
          if (requestResult.location !== 'granted') {
            throw new Error('Location permission not granted');
          }
        }

        return await CapacitorGeolocation.getCurrentPosition();
      } else {
        // Web implementation
        if (!navigator.geolocation) {
          throw new Error('Geolocation is not supported by this browser.');
        }

        return new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });
      }
    } catch (error) {
      console.error('Error getting location', error);
      throw error;
    }
  };

  return { getCurrentLocation };
};
