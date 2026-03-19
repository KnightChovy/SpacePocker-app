import React, { useState } from 'react';
import { Image, X } from 'lucide-react';

interface SpaceDetailGalleryProps {
  images: string[];
}

const SpaceDetailGallery: React.FC<SpaceDetailGalleryProps> = ({ images }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const imageCount = images.length;

  const renderTile = (image: string, idx: number, className = '') => (
    <div
      key={`${image}-${idx}`}
      className={`relative group overflow-hidden cursor-pointer ${className}`}
      onClick={() => setIsModalOpen(true)}
    >
      <img
        src={image}
        alt={`Photo ${idx + 1}`}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
    </div>
  );

  if (!images || images.length === 0) {
    return (
      <div className="mx-auto w-full max-w-5xl aspect-video rounded-2xl bg-gray-100 border border-gray-200 flex items-center justify-center">
        <div className="text-center text-gray-500">
          <Image className="w-10 h-10 mx-auto mb-2" />
          <p className="text-sm font-medium">No photos available</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {imageCount === 1 ? (
        <div className="mx-auto w-full max-w-5xl overflow-hidden rounded-2xl aspect-video">
          {renderTile(images[0], 0, 'w-full h-full')}
        </div>
      ) : null}

      {imageCount === 2 ? (
        <div className="mx-auto w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-4 h-104 md:h-136 overflow-hidden rounded-2xl">
          {images.slice(0, 2).map((image, idx) => renderTile(image, idx))}
        </div>
      ) : null}

      {imageCount === 3 ? (
        <div className="mx-auto w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 md:grid-rows-2 gap-4 h-120 md:h-152 overflow-hidden rounded-2xl">
          {renderTile(images[0], 0, 'md:col-span-2')}
          {renderTile(images[1], 1)}
          {renderTile(images[2], 2)}
        </div>
      ) : null}

      {imageCount >= 4 ? (
        <div className="mx-auto w-full max-w-5xl grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-4 h-120 md:h-152 overflow-hidden rounded-2xl relative">
          {renderTile(images[0], 0, 'md:col-span-2 md:row-span-2')}
          {images.slice(1, 5).map((image, idx) => (
            <div key={`${image}-${idx + 1}`} className="hidden md:block h-full">
              {renderTile(image, idx + 1, 'h-full')}
              {idx === 3 ? (
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="absolute bottom-4 right-4 bg-white/95 backdrop-blur shadow-lg px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-white transition-all transform active:scale-95"
                >
                  <Image className="w-4 h-4" />
                  Show all photos
                </button>
              ) : null}
            </div>
          ))}
        </div>
      ) : null}

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
