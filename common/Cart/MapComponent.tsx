import React from 'react';
import { GoogleMap, Marker } from '@react-google-maps/api';
import { mapContainerStyle } from './AddressModalTypes';

interface MapComponentProps {
  isLoaded: boolean;
  markerPosition: google.maps.LatLngLiteral;
  onMarkerDragEnd: (e: google.maps.MapMouseEvent) => void;
  mapRef: React.RefObject<google.maps.Map>;
}

export const MapComponent: React.FC<MapComponentProps> = ({ isLoaded, markerPosition, onMarkerDragEnd, mapRef }) => {
  if (!isLoaded) return <div>Loading map...</div>;

  return (
    <div className="mb-4">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={markerPosition}
        zoom={10}
        onLoad={(map) => {
          if (mapRef.current) {
            (mapRef.current as any) = map;
          }
        }}
      >
        <Marker
          position={markerPosition}
          draggable={true}
          onDragEnd={onMarkerDragEnd}
        />
      </GoogleMap>
    </div>
  );
};
