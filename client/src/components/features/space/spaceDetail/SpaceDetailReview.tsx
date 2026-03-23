import React, { useState } from 'react';
import type { Review } from '@/types/user/types';

interface SpaceDetailReviewsProps {
  reviews?: Review[];
  rating: number;
}

const SpaceDetailReviews: React.FC<SpaceDetailReviewsProps> = ({
  reviews = [],
  rating,
}) => {
  const [showAll, setShowAll] = useState(false);

  const displayedReviews = showAll ? reviews : reviews.slice(0, 4);
  const hasMoreReviews = reviews.length > 4;

  const calculateRatingDistribution = () => {
    const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

    reviews.forEach(review => {
      if (review.rating >= 1 && review.rating <= 5) {
        counts[review.rating as keyof typeof counts]++;
      }
    });

    return [5, 4, 3, 2, 1].map(star => ({
      star,
      count: counts[star as keyof typeof counts],
      pct:
        reviews.length > 0
          ? Math.round(
              (counts[star as keyof typeof counts] / reviews.length) * 100
            )
          : 0,
    }));
  };

  const ratingDistribution = calculateRatingDistribution();

  return (
    <section id="reviews-section" className="pt-12 border-t border-gray-100">
      <div className="flex items-center gap-2 mb-8">
        <span className=" text-cyan-400 material-fill text-2xl">★</span>
        <h3 className="text-2xl font-bold text-gray-900">
          {rating} · {reviews.length} reviews
        </h3>
      </div>
      <div className="max-w-md mb-12">
        <div className="space-y-3">
          {ratingDistribution.map(item => (
            <div
              key={item.star}
              className="grid grid-cols-[20px_1fr_60px] items-center gap-4 text-sm"
            >
              <span className="font-semibold text-gray-900">{item.star}</span>
              <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-cyan-400 rounded-full transition-all"
                  style={{ width: `${item.pct}%` }}
                />
              </div>
              <span className="text-gray-400 font-medium">
                {item.pct}% ({item.count})
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        {displayedReviews.map(review => (
          <div
            key={review.id}
            className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-4 mb-4">
              <img
                src={review.avatar}
                alt={review.author}
                className="w-12 h-12 rounded-full border-2 border-white shadow-sm"
              />
              <div className="flex-1">
                <h4 className="font-bold text-gray-900">{review.author}</h4>
                <p className="text-xs text-gray-400 font-medium">
                  {review.date}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 mb-3">
              {Array.from({ length: review.rating }).map((_, i) => (
                <span key={i} className="text-yellow-500 text-sm">
                  ★
                </span>
              ))}
              {Array.from({ length: 5 - review.rating }).map((_, i) => (
                <span key={i} className="text-gray-300 text-sm">
                  ★
                </span>
              ))}
            </div>
            <p className="text-gray-600 text-sm leading-relaxed italic">
              "{review.content}"
            </p>
          </div>
        ))}
      </div>
      {hasMoreReviews && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="mt-8 px-6 py-3 border border-gray-200 rounded-xl text-sm font-bold hover:bg-gray-50 transition-colors shadow-sm"
        >
          {showAll ? 'Show less' : 'Show more'}
        </button>
      )}
    </section>
  );
};

export default SpaceDetailReviews;
