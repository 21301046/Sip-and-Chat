import React from 'react';
import { Star } from 'lucide-react';

interface ReviewStatsProps {
  rating: number;
  totalReviews: number;
  ratingCounts: { [key: number]: number };
}

export function ReviewStats({ rating, totalReviews, ratingCounts }: ReviewStatsProps) {
  const renderStars = (count: number) => {
    return [...Array(5)].map((_, index) => (
      <Star
        key={index}
        className={`h-5 w-5 ${
          index < count ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  const calculatePercentage = (count: number) => {
    return totalReviews > 0 ? (count / totalReviews) * 100 : 0;
  };

  return (
    <div className="bg-white rounded-lg p-6 border border-gray-100">
      <div className="flex items-center gap-4 mb-6">
        <div className="text-center">
          <div className="text-4xl font-bold text-gray-900">
            {rating.toFixed(1)}
          </div>
          <div className="flex items-center justify-center mt-2">
            {renderStars(Math.round(rating))}
          </div>
          <div className="text-sm text-gray-500 mt-1">
            {totalReviews} {totalReviews === 1 ? 'review' : 'reviews'}
          </div>
        </div>

        <div className="flex-1 space-y-2">
          {[5, 4, 3, 2, 1].map((stars) => (
            <div key={stars} className="flex items-center gap-2">
              <div className="text-sm text-gray-600 w-6">{stars}</div>
              <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-yellow-400 rounded-full"
                  style={{
                    width: `${calculatePercentage(ratingCounts[stars] || 0)}%`,
                  }}
                />
              </div>
              <div className="text-sm text-gray-600 w-10">
                {ratingCounts[stars] || 0}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}