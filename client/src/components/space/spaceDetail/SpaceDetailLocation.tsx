import { MapPin } from 'lucide-react';
import React from 'react';

interface SpaceDetailLocationProps {
  location?: string; 
  locationDescription?: string;
  coordinates?: {
    lat: number
    lng: number;
  };
}

const SpaceDetailLocation: React.FC<SpaceDetailLocationProps> = ({
  location,
  locationDescription,
  coordinates,
}) => {
  if (!location) {
    return null;
  }

  return (
    <section>
      <h3 className="text-xl font-bold text-gray-900 mb-4">Where you'll be</h3>
      <div className="w-full aspect-21/9 rounded-2xl bg-gray-100 overflow-hidden relative border border-gray-200 shadow-md">
        {coordinates ? (
          <iframe
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            src={`https://www.openstreetmap.org/export/embed.html?bbox=${coordinates.lng - 0.01},${coordinates.lat - 0.01},${coordinates.lng + 0.01},${coordinates.lat + 0.01}&layer=mapnik&marker=${coordinates.lat},${coordinates.lng}`}
            title="Space Location Map"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200">
            <div className="text-center text-gray-500">
              <MapPin className="w-12 h-12 mx-auto mb-2" />
              <p className="text-sm">Map not available</p>
            </div>
          </div>
        )}
        <div className="absolute bottom-4 left-4 bg-white px-3 py-1.5 rounded-lg shadow-lg text-xs font-bold border border-gray-100 flex items-center gap-1">
          <MapPin className="w-3 h-3 text-cyan-400" />
          {location}
        </div>
      </div>
      {locationDescription && (
        <p className="mt-4 text-gray-500 text-sm italic">
          {locationDescription}
        </p>
      )}
    </section>
  );
};

export default SpaceDetailLocation;
