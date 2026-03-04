import React, { useState } from 'react';
import { Image, X } from 'lucide-react';

interface SpaceDetailGalleryProps {
  images: string[];
}

const SpaceDetailGallery: React.FC<SpaceDetailGalleryProps> = ({ images }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-100 md:h-137.5 overflow-hidden rounded-2xl relative">
        <div
          className="md:col-span-2 md:row-span-2 relative group overflow-hidden cursor-pointer"
          onClick={() => setIsModalOpen(true)}
        >
          <div
            className="w-full h-full bg-center bg-cover transition-transform duration-700 group-hover:scale-105"
            style={{ backgroundImage: `url(${images[0]})` }}
          />
          <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
        </div>

        {images.slice(1, 5).map((image, idx) => (
          <div
            key={idx}
            className="hidden md:block relative group overflow-hidden cursor-pointer"
            onClick={() => setIsModalOpen(true)}
          >
            <div
              className="w-full h-full bg-center bg-cover transition-transform duration-700 group-hover:scale-105"
              style={{ backgroundImage: `url(${image})` }}
            />
            <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
            {idx === 3 && (
              <button className="absolute bottom-4 right-4 bg-white/95 backdrop-blur shadow-lg px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-white transition-all transform active:scale-95">
                <span className="">
                  <Image />
                </span>
                Show all photos
              </button>
            )}
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4">
          <div className="w-full max-w-7xl h-full flex flex-col">
            <div className="flex items-center justify-between p-6 text-white">
              <h2 className="text-2xl font-bold">
                All Photos ({images.length})
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-8 h-8" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 pb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {images.map((image, idx) => (
                  <div
                    key={idx}
                    className="relative aspect-video overflow-hidden rounded-lg group cursor-pointer"
                  >
                    <img
                      src={image}
                      alt={`Photo ${idx + 1}`}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity" />
                    <div className="absolute bottom-2 left-2 bg-black/60 text-white px-2 py-1 rounded text-xs font-medium">
                      {idx + 1} / {images.length}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SpaceDetailGallery;
