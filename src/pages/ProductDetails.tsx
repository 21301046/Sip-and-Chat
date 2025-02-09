import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, ChevronLeft, Coffee, Mountain, Droplets, ThermometerSun, Package } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { api } from '../services/api';
import { Product } from '../types';
import { ReviewStats } from '../components/ReviewStats';
import { ReviewForm } from '../components/ReviewForm';
import { ReviewList } from '../components/ReviewList';

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

export function ProductDetails() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewsLoading, setReviewsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productData, reviewsData] = await Promise.all([
          api.getProductById(id!),
          api.getProductReviews(id!)
        ]);
        setProduct(productData);
        setReviews(reviewsData);
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
        setReviewsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleReviewSubmit = async () => {
    try {
      const reviewsData = await api.getProductReviews(id!);
      setReviews(reviewsData);
      // Refresh product to get updated rating
      const productData = await api.getProductById(id!);
      setProduct(productData);
    } catch (err) {
      console.error('Error refreshing reviews:', err);
    }
  };

  const handleHelpfulClick = async (reviewId: string) => {
    try {
      await api.markReviewHelpful(reviewId);
      const updatedReviews = await api.getProductReviews(id!);
      setReviews(updatedReviews);
    } catch (err) {
      console.error('Error marking review as helpful:', err);
    }
  };

  const calculateRatingCounts = (reviews: Review[]) => {
    const counts: { [key: number]: number } = {};
    reviews.forEach(review => {
      counts[review.rating] = (counts[review.rating] || 0) + 1;
    });
    return counts;
  };

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, index) => (
      <Star
        key={index}
        className={`h-5 w-5 ${
          index < Math.floor(rating || 0)
            ? 'text-yellow-400 fill-current'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Product not found
          </h2>
          <Link
            to="/shop"
            className="text-primary-600 hover:text-primary-700"
          >
            Return to Shop
          </Link>
        </div>
      </div>
    );
  }




  
  
// Handle both full URLs and relative paths
const imageUrl = product.image.startsWith('http') 
  ? product.image 
  : `http://localhost:5000${product.image}`;

return (
  <div className="min-h-screen pt-20 bg-gray-50">
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Link
        to="/shop"
        className="inline-flex items-center text-gray-600 hover:text-primary-600 mb-6"
      >
        <ChevronLeft className="h-5 w-5" />
        <span>Back to Shop</span>
      </Link>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="relative pt-[100%]">
            <img
              src={imageUrl}
              alt={product.name}
              className="absolute inset-0 w-full h-full object-contain p-4"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd'; // Fallback image
              }}
            />
          </div>





            {/* Product Info */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {product.name}
              </h1>
              
              <div className="flex items-center mb-4">
                <div className="flex items-center">
                  {renderStars(product.rating)}
                </div>
                <span className="ml-2 text-gray-600">
                  ({reviews.length} reviews)
                </span>
              </div>

              <p className="text-gray-600 mb-6">{product.description}</p>

              {product.category === 'beans' && (
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center gap-2">
                    <Coffee className="h-5 w-5 text-primary-600" />
                    <span>Roast: {product.roastLevel}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mountain className="h-5 w-5 text-primary-600" />
                    <span>Origin: {product.origin}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Droplets className="h-5 w-5 text-primary-600" />
                    <span>Process: {product.details?.process}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ThermometerSun className="h-5 w-5 text-primary-600" />
                    <span>Altitude: {product.details?.altitude}</span>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-4 mb-6">
                <Package className="h-5 w-5 text-gray-600" />
                <span className="text-gray-600">
                  {product.weight || 'Standard size'}
                </span>
              </div>

              <div className="flex items-center justify-between mb-6">
                <span className="text-3xl font-bold text-primary-600">
                ₹{product.price}
                </span>
                <button
                  onClick={() => addToCart(product)}
                  className="bg-primary-600 text-white px-6 py-3 rounded-md hover:bg-primary-700 transition-colors"
                >
                  Add to Cart
                </button>
              </div>

              {product.details?.brewingTips && (
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold mb-3">Brewing Tips</h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-600">
                    {product.details.brewingTips.map((tip, index) => (
                      <li key={index}>{tip}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Product Details */}
        {product.details?.flavor && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-4">Flavor Profile</h2>
            <div className="flex flex-wrap gap-2">
              {product.details.flavor.map((flavor, index) => (
                <span
                  key={index}
                  className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full"
                >
                  {flavor}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Reviews Section */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-6">Customer Reviews</h2>
            
            {reviewsLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
              </div>
            ) : (
              <>
                <ReviewStats
                  rating={product.rating || 0}
                  totalReviews={reviews.length}
                  ratingCounts={calculateRatingCounts(reviews)}
                />

                <div className="mt-8">
                  <h3 className="text-xl font-semibold mb-4">Write a Review</h3>
                  <ReviewForm
                    productId={id!}
                    onReviewSubmit={handleReviewSubmit}
                  />
                </div>

                <div className="mt-8">
                  <h3 className="text-xl font-semibold mb-4">Reviews</h3>
                  <ReviewList
                    reviews={reviews}
                    onHelpfulClick={handleHelpfulClick}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}