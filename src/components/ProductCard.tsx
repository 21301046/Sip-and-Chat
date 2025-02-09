import React from 'react';
import { useCart } from '../context/CartContext';
import { Product } from '../types';
import { ShoppingCart, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${
          index < Math.floor(rating || 0)
            ? 'text-yellow-400 fill-current'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  // Handle both full URLs and relative paths
  const imageUrl = product.image.startsWith('http') 
    ? product.image 
    : `http://localhost:5000${product.image}`;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105">
      <Link to={`/product/${product._id}`}>
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
      </Link>
      <div className="p-4">
        <Link 
          to={`/product/${product._id}`}
          className="block hover:text-primary-600"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-2">{product.name}</h3>
        </Link>
        <p className="text-sm text-gray-600 mb-2 line-clamp-2">{product.description}</p>
        <div className="mb-2">
          {product.category === 'beans' && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>Origin: {product.origin}</span>
              <span>•</span>
              <span>Roast: {product.roastLevel}</span>
            </div>
          )}
        </div>
        <div className="flex items-center mb-3">
          {renderStars(product.rating || 0)}
          <span className="ml-2 text-sm text-gray-600">
            ({product.reviews?.length || 0})
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-primary-600">₹{product.price}</span>
          <button
            onClick={() => addToCart(product)}
            className="bg-primary-600 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-primary-700 transition-colors"
          >
            <ShoppingCart className="h-4 w-4" />
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}