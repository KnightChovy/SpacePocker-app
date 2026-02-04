import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SpaceDetailGallery from '@/components/space/spaceDetail/SpaceDetailGalley';
import SpaceDetailInfo from '@/components/space/spaceDetail/SpaceDetailInfor';
import SpaceDetailAmenities from '@/components/space/spaceDetail/SpaceDetailAmenities';
import SpaceDetailLocation from '@/components/space/spaceDetail/SpaceDetailLocation';
import SpaceDetailReviews from '@/components/space/spaceDetail/SpaceDetailReview';
import SpaceDetailBooking from '@/components/space/spaceDetail/SpaceDetaillBooking';
import { fetchSpaceDetail } from '@/services/spaceService';
import type { Space } from '@/types/types';
import { ChevronLeft, Heart, MapPin, Share } from 'lucide-react';

const SpaceDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [spaceData, setSpaceData] = useState<Space | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const getSpaceDetail = async () => {
      try {
        const data = await fetchSpaceDetail(id || '1');
        setSpaceData(data);
      } catch (err) {
        setError('Failed to fetch space details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    getSpaceDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading space details...</p>
        </div>
      </div>
    );
  }

  if (error || !spaceData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <span className=" text-6xl text-red-500 mb-4">
            error
          </span>
          <p className="text-gray-600">{error || 'Space not found'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white selection:bg-indigo-100">
      <div className="h-20 bg-slate-900">
        <Navbar />
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate('/spaces')}
          className="flex items-center gap-3 px-5 py-3 bg-transparent border border-gray-150 text-gray-800 rounded-full hover:bg-gray-100 transition-all text-sm font-medium shadow-md mb-6"
        >
          <ChevronLeft />
          <span>Back to Spaces</span>
        </button>

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight mb-2">
              {spaceData.title || spaceData.name}
            </h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <span className=" text-sm text-cyan-400">
                  <MapPin />
                </span>
                <span>{spaceData.location}</span>
              </div>
              <div className="flex items-center gap-1 font-semibold">
                <span className=" text-sm text-cyan-400 material-fill">
                  ⭐
                </span>
                <span className="text-gray-900">{spaceData.rating}</span>
                <span
                  onClick={() =>
                    document
                      .getElementById('reviews-section')
                      ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                  }
                  className="font-normal text-gray-500 underline decoration-dotted cursor-pointer hover:text-gray-700 transition-colors"
                >
                  ({spaceData.reviews?.length || 0} reviews)
                </span>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all text-sm font-semibold shadow-sm">
              <Share className="w-5 h-5" />
              Share
            </button>
            <button
              onClick={() => setIsSaved(!isSaved)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all text-sm font-semibold shadow-sm"
            >
              <Heart
                className={`w-5 h-5 transition-all ${isSaved ? 'fill-cyan-400 text-cyan-400' : ''}`}
              />
              {isSaved ? 'Saved' : 'Save'}
            </button>
          </div>
        </div>

        <SpaceDetailGallery images={spaceData.images || []} />

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12 lg:gap-20">
          <div className="space-y-12">
            <SpaceDetailInfo
              description={spaceData.description}
              host={spaceData.host}
            />
            <SpaceDetailAmenities
              amenities={
                Array.isArray(spaceData.amenities) &&
                spaceData.amenities.length > 0
                  ? typeof spaceData.amenities[0] === 'string'
                    ? undefined
                    : (spaceData.amenities as any[])
                  : undefined
              }
            />
            <SpaceDetailLocation
              location={spaceData.location}
              locationDescription={spaceData.locationDescription}
              coordinates={spaceData.coordinates}
            />

            <SpaceDetailReviews
              reviews={spaceData.reviews}
              rating={spaceData.rating}
            />
          </div>

          <aside className="relative">
            <div className="sticky top-24">
              <SpaceDetailBooking
                spaceId={spaceData.id}
                price={spaceData.price}
                rating={spaceData.rating}
                capacity={spaceData.capacity}
              />
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SpaceDetailPage;
