"use client";
import React, { useRef, useState, useCallback, RefObject } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { MapPin, Loader } from 'lucide-react';
import { useAddress } from '@/provider/addressProvider';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { AddressModalProps, AddressFormInputs, addressFields, mapContainerStyle, center } from './AddressModalTypes';
import { useOutsideClick } from './useOutsideClick';
import { useGeolocation } from './useGeolocation';
import { AddressForm } from './AddressForm';
import { MapComponent } from './MapComponent';
import { useSafeArea } from '@/provider/safeAreaProvider';

const AddressModal: React.FC<AddressModalProps> = ({ onClose, onSave }) => {
  const { address, setAddress } = useAddress();
  const mapRef = useRef<GoogleMap | null>(null);
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<AddressFormInputs>({
    defaultValues: address || { street: '', city: '', state: '', postalCode: '', country: '' }
  });
  const { safeAreaClasses } = useSafeArea();

  const [markerPosition, setMarkerPosition] = useState(center);
  const [mapError, setMapError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "",
    libraries: ["places"]
  });

  const modalRef = useRef<HTMLDivElement>(null);
  useOutsideClick(modalRef, onClose);

  const { getCurrentLocation } = useGeolocation();

  const onSubmit = (data: AddressFormInputs) => {
    setAddress(data);
    onSave(data);
    onClose();
  };

  const updateAddressFields = (results: google.maps.GeocoderResult[]) => {
    let street = '';
    let city = '';
    let state = '';
    let postalCode = '';
    let country = '';

    for (let component of results[0].address_components) {
      const componentType = component.types[0];

      switch (componentType) {
        case "street_number":
          street = `${component.long_name} ${street}`;
          break;
        case "route":
          street += component.short_name;
          break;
        case "postal_code":
          postalCode = component.long_name;
          break;
        case "locality":
          city = component.long_name;
          break;
        case "administrative_area_level_1":
          state = component.long_name;
          break;
        case "country":
          country = component.long_name;
          break;
      }
    }

    setValue('street', street);
    setValue('city', city);
    setValue('state', state);
    setValue('postalCode', postalCode);
    setValue('country', country);
  };

  const updateFormFields = (lat: number, lng: number) => {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === "OK" && results) {
        updateAddressFields(results);
        setMarkerPosition({ lat, lng });
        if (mapRef.current) {
          mapRef.current.panTo({ lat, lng });
        }
      } else {
        setMapError("Failed to get address for this location.");
      }
    });
  };

  const handleMarkerDragEnd = (e: google.maps.MapMouseEvent) => {
    const lat = e.latLng?.lat();
    const lng = e.latLng?.lng();
    if (lat && lng) {
      updateFormFields(lat, lng);
    }
  };

  const handleUseCurrentLocation = async () => {
    setIsLoading(true);
    setMapError(null);
    try {
      const position = await getCurrentLocation();
      const { latitude: lat, longitude: lng } = position.coords;
      updateFormFields(lat, lng);
    } catch (error: any) {
      setMapError(error?.message || "Failed to get current location.");
    } finally {
      setIsLoading(false);
    }
  };

  const combinedPaddingTop = `calc(var(--inset-top, 0px) + 2rem)`; // 4rem equivalent to pt-16
  const combinedPaddingBottom = `calc(var(--inset-bottom, 0px) + 2rem)`; // 6rem equivalent to pb-24

  if (loadError) return <div>Map cannot be loaded right now, sorry.</div>;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4 py-6"
      >
        <motion.div 
          ref={modalRef}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", damping: 15 }}
          className={`bg-white rounded-lg w-full max-w-md shadow-2xl overflow-hidden ${safeAreaClasses}`}
          style={{
            maxHeight: 'calc(100vh - 2rem)',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div className="p-6 overflow-y-auto flex-grow">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Add Address</h2>
            
            <MapComponent
              isLoaded={isLoaded}
              markerPosition={markerPosition}
              onMarkerDragEnd={handleMarkerDragEnd}
              mapRef={mapRef as unknown as RefObject<google.maps.Map>}
            />

            {mapError && <p className="text-red-500 text-sm mb-2">{mapError}</p>}

            <Button 
              className="w-full mb-4 bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center transition duration-300 ease-in-out" 
              onClick={handleUseCurrentLocation}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                  <span className="text-sm">Fetching location...</span>
                </>
              ) : (
                <>
                  <MapPin className="mr-2 h-4 w-4" />
                  <span className="text-sm">Use Current Location</span>
                </>
              )}
            </Button>

            <AddressForm
              register={register}
              errors={errors}
              onSubmit={handleSubmit(onSubmit)}
              onClose={onClose}
            />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AddressModal;