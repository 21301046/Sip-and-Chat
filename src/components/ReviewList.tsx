import React from 'react';
import { Star, ThumbsUp, Flag } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface Review {
  _id: string;
  user: {
    _id: string;
    name: string;
  };
  rating: number;
  comment: string;
  verified: boolean;
  helpful: {
    count: number;
    users: string[];
  };
  createdAt: string;
}

interface ReviewListProps {
  reviews: Review[];
  onHelpfulClick: (reviewId: string) => void;
}

export function ReviewList({ reviews, onHelpfulClick }: ReviewListProps) {
  const { user } = useAuth();

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${
          index < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (reviews.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">No reviews yet. Be the first to review!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <div
          key={review._id}
          className="bg-white rounded-lg shadow-sm p-6 border border-gray-100"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-primary-600 font-semibold">
                    {review.user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h4 className="font-medium">{review.user.name}</h4>
                  <div className="flex items-center gap-2">
                    <div className="flex">{renderStars(review.rating)}</div>
                    {review.verified && (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                        Verified Purchase
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <span className="text-sm text-gray-500">
              {formatDate(review.createdAt)}
            </span>
          </div>

          <p className="text-gray-700 mb-4">{review.comment}</p>

          <div className="flex items-center justify-between">
            <button
              onClick={() => onHelpfulClick(review._id)}
              disabled={!user}
              className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
                user && review.helpful.users.includes(user.id)
                  ? 'bg-primary-50 text-primary-600'
                  : 'text-gray-600 hover:bg-gray-100'
              } transition-colors`}
            >
              <ThumbsUp className="h-4 w-4" />
              <span>Helpful ({review.helpful.count})</span>
            </button>

            <button
              className="flex items-center gap-1 text-gray-400 hover:text-gray-600 text-sm"
              title="Report review"
            >
              <Flag className="h-4 w-4" />
              <span>Report</span>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}