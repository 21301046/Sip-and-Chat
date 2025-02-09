import React from 'react';
import { useCart } from '../context/CartContext';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Cart() {
  const { cartItems, updateQuantity, removeFromCart } = useCart();

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // Helper function to get correct image URL
  const getImageUrl = (imageUrl: string) => {
    return imageUrl.startsWith('http') 
      ? imageUrl 
      : `http://localhost:5000${imageUrl}`;
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Your cart is empty
          </h2>
          <p className="text-gray-600 mb-4">Add some products to your cart to continue shopping</p>
          <Link
            to="/shop"
            className="inline-block bg-primary-600 text-white px-6 py-2 rounded-md hover:bg-primary-700 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

        <div className="bg-white rounded-lg shadow-md p-6">
          {cartItems.map(item => (
            <div
              key={item._id}
              className="flex items-center py-4 border-b last:border-b-0"
            >
              <img
                src={getImageUrl(item.image)}
                alt={item.name}
                className="w-24 h-24 object-cover rounded-md"
              />
              <div className="flex-1 ml-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  {item.name}
                </h3>
                <p className="text-gray-600">₹{item.price}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateQuantity(item._id, item.quantity - 1)}
                  className="p-1 rounded-md hover:bg-gray-100"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-8 text-center">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item._id, item.quantity + 1)}
                  className="p-1 rounded-md hover:bg-gray-100"
                >
                  <Plus className="h-4 w-4" />
                </button>
                <button
                  onClick={() => removeFromCart(item._id)}
                  className="ml-4 p-1 text-red-500 hover:bg-red-50 rounded-md"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}

          <div className="mt-6 border-t pt-6">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold">Total:</span>
              <span className="text-2xl font-bold text-primary-600">
              ₹{total.toFixed(2)}
              </span>
            </div>
            <Link
              to="/checkout"
              className="w-full mt-4 bg-primary-600 text-white py-3 rounded-md font-semibold hover:bg-primary-700 transition-colors flex items-center justify-center"
            >
              Proceed to Checkout
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}