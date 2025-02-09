import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

export function OrderSuccess() {
  return (
    <div className="min-h-screen pt-20 bg-gray-50 flex items-center justify-center">
      <div className="text-center p-8">
        <div className="flex justify-center mb-4">
          <CheckCircle className="h-16 w-16 text-green-500" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Order Placed Successfully!
        </h1>
        <p className="text-gray-600 mb-8">
          Thank you for your purchase. Your order has been confirmed.
        </p>
        <div className="space-x-4">
          <Link
            to="/profile"
            className="inline-block bg-primary-600 text-white px-6 py-2 rounded-md hover:bg-primary-700 transition-colors"
          >
            View Order
          </Link>
          <Link
            to="/shop"
            className="inline-block bg-gray-200 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-300 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}