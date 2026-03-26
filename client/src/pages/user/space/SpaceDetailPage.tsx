import React, { useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SpaceDetailGallery from '@/components/features/space/spaceDetail/SpaceDetailGalley';
import SpaceDetailInfo from '@/components/features/space/spaceDetail/SpaceDetailInfor';
import SpaceDetailAmenities from '@/components/features/space/spaceDetail/SpaceDetailAmenities';
import SpaceDetailLocation from '@/components/features/space/spaceDetail/SpaceDetailLocation';
import SpaceDetailBooking from '@/components/features/space/spaceDetail/SpaceDetaillBooking';
import type { AmenityDetail } from '@/types/user/types';
import { useGetRoomById } from '@/hooks/user/rooms/use-get-room-by-id';
import { useGetBuildingById } from '@/hooks/user/buildings/use-get-building-by-id';
import { ChevronLeft, Heart, MapPin, Share } from 'lucide-react';
import { useGetRoomAmenitiesServices } from '@/hooks/user/rooms/use-get-room-amenities-services';
import { useGetFeedbacks } from '@/hooks/user/feedback/use-get-feedbacks';

const parseCoordinate = (value: unknown): number | undefined => {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string') {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return undefined;
};

const SpaceDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isSaved, setIsSaved] = useState(false);

  const roomId = id;

  const roomQuery = useGetRoomById(roomId);
  const room = roomQuery.data;

  const buildingQuery = useGetBuildingById(room?.buildingId);
  const building = buildingQuery.data;

  const extrasQuery = useGetRoomAmenitiesServices(roomId || undefined);
  const feedbackQuery = useGetFeedbacks(
    roomId
      ? {
          roomId,
          page: 1,
          limit: 10,
        }
      : undefined
  );

  const amenitiesDetail: AmenityDetail[] = useMemo(() => {
    const list = extrasQuery.data?.amenities ?? [];
    return list.map(a => {
      const name = a.name ?? '';
      const n = name.toLowerCase();
      const icon = n.includes('wifi')
        ? 'wifi'
        : n.includes('tv') || n.includes('screen')
          ? 'tv'
          : n.includes('projector') ||
              n.includes('camera') ||
              n.includes('video')
            ? 'videoCam'
            : n.includes('air') || n.includes('ac')
              ? 'ac_unit'
              : n.includes('whiteboard') || n.includes('board')
                ? 'whiteboard'
                : '';

      return { icon, label: name };
    });
  }, [extrasQuery.data?.amenities]);

  const locationText = useMemo(() => {
    if (!building) return room?.building?.address ?? room?.building?.campus;

    const pieces = [building.buildingName, building.address, building.campus]
      .filter(Boolean)
      .join(' · ');
    return pieces || undefined;
  }, [building, room?.building?.address, room?.building?.campus]);

  const coordinates = useMemo(() => {
    const lat = parseCoordinate(building?.latitude ?? room?.building?.latitude);
    const lng = parseCoordinate(
      building?.longitude ?? room?.building?.longitude
    );

    if (lat === undefined || lng === undefined) return undefined;
    return { lat, lng };
  }, [
    building?.latitude,
    building?.longitude,
    room?.building?.latitude,
    room?.building?.longitude,
  ]);

  const feedbacks = feedbackQuery.data?.feedbacks ?? [];
  const averageRating = useMemo(() => {
    if (feedbacks.length === 0) return 0;
    const total = feedbacks.reduce((sum, feedback) => sum + feedback.rating, 0);
    return Number((total / feedbacks.length).toFixed(1));
  }, [feedbacks]);

  if (roomQuery.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading space details...</p>
        </div>
      </div>
    );
  }

  if (roomQuery.isError || !room) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <span className=" text-6xl text-red-500 mb-4">error</span>
          <p className="text-gray-600">
            {roomQuery.error instanceof Error
              ? roomQuery.error.message
              : 'Space not found'}
          </p>
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

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight mb-2">
              {room.name}
            </h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <span className=" text-sm text-cyan-400">
                  <MapPin />
                </span>
                <span>{locationText ?? building?.buildingName ?? '—'}</span>
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

        <SpaceDetailGallery images={room.images || []} />

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12 lg:gap-20">
          <div className="space-y-12">
            <SpaceDetailInfo description={room.description ?? ''} />
            <SpaceDetailAmenities amenities={amenitiesDetail} />
            <SpaceDetailLocation
              location={locationText}
              locationDescription={
                building?.address ??
                room?.building?.address ??
                building?.campus ??
                room?.building?.campus
              }
              coordinates={coordinates}
            />

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Feedback
              </h2>

              {feedbackQuery.isLoading ? (
                <p className="text-gray-600">Loading feedback...</p>
              ) : feedbackQuery.isError ? (
                <p className="text-red-600">
                  {feedbackQuery.error instanceof Error
                    ? feedbackQuery.error.message
                    : 'Failed to load feedback.'}
                </p>
              ) : feedbacks.length === 0 ? (
                <p className="text-gray-600">No feedback available.</p>
              ) : (
                <div className="space-y-4">
                  {feedbacks.map(feedback => (
                    <article
                      key={feedback.id}
                      className="rounded-xl border border-gray-200 p-4"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-semibold text-gray-900">
                          {feedback.user?.name ?? 'Anonymous'}
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(feedback.createdAt).toLocaleDateString(
                            'vi-VN'
                          )}
                        </p>
                      </div>

                      <p className="mt-1 text-amber-500 text-sm">
                        {'★'.repeat(feedback.rating)}
                        {'☆'.repeat(5 - feedback.rating)}
                        <span className="ml-2 text-gray-600">
                          ({feedback.rating}/5)
                        </span>
                      </p>

                      <p className="mt-2 text-gray-700">
                        {feedback.comment?.trim() || 'Không có nhận xét.'}
                      </p>
                    </article>
                  ))}
                </div>
              )}
            </section>
          </div>

          <aside className="relative">
            <div className="sticky top-24">
              <SpaceDetailBooking
                spaceId={room.id}
                price={room.pricePerHour}
                rating={averageRating}
                capacity={room.capacity}
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
