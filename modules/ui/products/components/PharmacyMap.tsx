"use client"
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Drawer, DrawerContent, DrawerOverlay } from "@/components/ui/drawer";
import ProductListing from './ProductListing';
import SearchBox from './SearchBox';
import { Switch } from '@/components/ui/switch';
import { Input } from "@/components/ui/input";
import { Search } from 'lucide-react';
import { useSafeArea } from '@/provider/safeAreaProvider';

const mapContainerStyle = {
  width: '100%',
  height: '100vh',
};

// Center on your pharmacy location
const center = {
  lat: 25.200047831261443,
  lng: 85.52457341122756
};

const mapOptions = {
  disableDefaultUI: true,
  zoomControl: false,
  streetViewControl: false,
  mapTypeControl: false,
  fullscreenControl: false,
  clickableIcons: false,
};

// Define a search radius (in degrees, roughly 10km)
const SEARCH_RADIUS = 0.1;

// Bounds for the search area (approximately 10km around the pharmacy)
const SEARCH_BOUNDS = {
  north: center.lat + SEARCH_RADIUS,
  south: center.lat - SEARCH_RADIUS,
  east: center.lng + SEARCH_RADIUS,
  west: center.lng - SEARCH_RADIUS,
};

interface Pharmacy {
  id: string;
  name: string;
  position: { lat: number; lng: number };
}

const pharmacies: Pharmacy[] = [
  { id: '1', name: 'Your Pharmacy', position: center },
  // Add more pharmacies here in the future
];

const PharmacyMap: React.FC = () => {
  const [selectedPharmacy, setSelectedPharmacy] = useState<Pharmacy | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showInStock, setShowInStock] = useState(false);
  const [mapCenter, setMapCenter] = useState(center);
  const [mapZoom, setMapZoom] = useState(14);
  const mapRef = useRef<google.maps.Map | null>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { safeAreaClasses } = useSafeArea();
  
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries: ['places'],
  });

  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  useEffect(() => {
    if (isLoaded && searchInputRef.current) {
      autocompleteRef.current = new google.maps.places.Autocomplete(searchInputRef.current, {
        types: ['geocode'],
        bounds: SEARCH_BOUNDS,
        strictBounds: true,
        fields: ['name', 'geometry'],
      });

      autocompleteRef.current.addListener('place_changed', () => {
        const place = autocompleteRef.current?.getPlace();
        if (place?.geometry?.location) {
          const newCenter = {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng()
          };
          setMapCenter(newCenter);
          setMapZoom(16);
        }
      });
    }
  }, [isLoaded]);

  const handlePharmacySelect = (pharmacy: Pharmacy) => {
    setSelectedPharmacy(pharmacy);
    setIsDrawerOpen(true);
    setMapCenter(pharmacy.position);
    setMapZoom(16);
  };

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
    setSearchQuery('');
    setMapZoom(14);
    setMapCenter(center);
  };

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading maps</div>;

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <div className={`absolute top-20 left-1/2 transform -translate-x-1/2 z-10 w-11/12 ${safeAreaClasses} pad-top`}>
        <div className="relative">
          <Input
            ref={searchInputRef}
            type="text"
            placeholder="Search for a location near the pharmacy"
            className="w-full pl-10 h-12 pr-4 py-2 rounded-full shadow-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        </div>
      </div>

      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={mapCenter}
        zoom={mapZoom}
        options={mapOptions}
        onLoad={onMapLoad}
      >
        {pharmacies.map((pharmacy) => (
          <Marker
            key={pharmacy.id}
            position={pharmacy.position}
            onClick={() => handlePharmacySelect(pharmacy)}
          />
        ))}
      </GoogleMap>

      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen} onClose={handleDrawerClose}>
        <DrawerOverlay className='bg-black/20'/>
        <DrawerContent className="h-[80vh] rounded-t-3xl overflow-hidden drop-shadow-2xl">
          <AnimatePresence>
            {isDrawerOpen && selectedPharmacy && (
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                transition={{ duration: 0.3 }}
                className="p-4"
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold">{selectedPharmacy.name}</h2>
                  <div className='flex items-center gap-2'>
                    {showInStock ? "In Stock Only" : "All Products"}
                    <Switch
                      checked={showInStock}
                      onCheckedChange={setShowInStock}
                    />
                  </div>
                </div>
                <SearchBox onSearch={setSearchQuery} />
                <ProductListing pharmacyName={selectedPharmacy.name} searchQuery={searchQuery} showInStock={showInStock} />
              </motion.div>
            )}
          </AnimatePresence>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default PharmacyMap;