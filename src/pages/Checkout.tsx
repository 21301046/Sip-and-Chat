import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { MapPin, CreditCard, Truck } from 'lucide-react';

declare global {
  interface Window {
    Razorpay: any;
  }
}

type PaymentMethod = 'online' | 'cod';

export function Checkout() {
  const navigate = useNavigate();
  const { cartItems, removeFromCart } = useCart();
  const { user } = useAuth();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('online');
  const [shippingAddress, setShippingAddress] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: ''
  });

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShippingAddress({
      ...shippingAddress,
      [e.target.name]: e.target.value
    });
  };

  const initializeRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleCODOrder = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/orders/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          items: cartItems.map(item => ({
            product: {
              _id: item._id, // Ensure we're passing the product ID
              name: item.name,
              price: item.price,
              image: item.image
            },
            quantity: item.quantity
          })),
          totalAmount,
          shippingAddress,
          paymentMethod: 'cod'
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create order');
      }

      // Clear cart and redirect to success page
      cartItems.forEach(item => removeFromCart(item._id));
      navigate('/order-success');
    } catch (err) {
      console.error('Order creation failed:', err);
      alert(err instanceof Error ? err.message : 'Failed to create order. Please try again.');
    }
  };

  const handlePayment = async () => {
    if (!user) {
      alert('Please login to continue with checkout');
      return;
    }

    // Validate shipping address
    if (!shippingAddress.street || !shippingAddress.city || !shippingAddress.state || 
        !shippingAddress.zipCode || !shippingAddress.country) {
      alert('Please fill in all shipping address fields');
      return;
    }

    if (paymentMethod === 'cod') {
      await handleCODOrder();
      return;
    }

    const res = await initializeRazorpay();
    if (!res) {
      alert('Razorpay SDK failed to load');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/orders/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          items: cartItems.map(item => ({
            product: {
              name: item.name,
              price: item.price,
              image: item.image
            },
            quantity: item.quantity
          })),
          totalAmount,
          shippingAddress,
          paymentMethod: 'online'
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create order');
      }

      const data = await response.json();
      
      const options = {
        key: data.key,
        amount: data.amount,
        currency: 'INR',
        name: 'Brew Haven',
        description: 'Coffee Order Payment',
        order_id: data.orderId,
        handler: async (response: any) => {
          try {
            const verifyResponse = await fetch('http://localhost:5000/api/orders/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              credentials: 'include',
              body: JSON.stringify(response),
            });

            if (verifyResponse.ok) {
              // Clear cart and redirect to success page
              cartItems.forEach(item => removeFromCart(item._id));
              navigate('/order-success');
            } else {
              throw new Error('Payment verification failed');
            }
          } catch (err) {
            console.error('Payment verification failed:', err);
            alert('Payment verification failed. Please contact support.');
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
        },
        theme: {
          color: '#CE0F10',
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (err) {
      console.error('Payment initiation failed:', err);
      alert(err instanceof Error ? err.message : 'Failed to initiate payment. Please try again.');
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Your cart is empty
          </h2>
          <p className="text-gray-600 mb-4">Add some products to your cart to proceed with checkout</p>
          <button
            onClick={() => navigate('/shop')}
            className="bg-primary-600 text-white px-6 py-2 rounded-md hover:bg-primary-700 transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }


  // Helper function to get correct image URL
  const getImageUrl = (imageUrl: string) => {
    return imageUrl.startsWith('http') 
      ? imageUrl 
      : `http://localhost:5000${imageUrl}`;
  };

  return (
    <div className="min-h-screen pt-20 bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary-600" />
            Shipping Address
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Street Address
              </label>
              <input
                type="text"
                name="street"
                value={shippingAddress.street}
                onChange={handleAddressChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City
              </label>
              <input
                type="text"
                name="city"
                value={shippingAddress.city}
                onChange={handleAddressChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                State
              </label>
              <input
                type="text"
                name="state"
                value={shippingAddress.state}
                onChange={handleAddressChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ZIP Code
              </label>
              <input
                type="text"
                name="zipCode"
                value={shippingAddress.zipCode}
                onChange={handleAddressChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Country
              </label>
              <input
                type="text"
                name="country"
                value={shippingAddress.country}
                onChange={handleAddressChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
          <div className="space-y-4">
            <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:border-primary-600 transition-colors">
              <input
                type="radio"
                name="paymentMethod"
                checked={paymentMethod === 'online'}
                onChange={() => setPaymentMethod('online')}
                className="h-4 w-4 text-primary-600"
              />
              <div className="ml-4 flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-primary-600" />
                <div>
                  <p className="font-medium">Online Payment</p>
                  <p className="text-sm text-gray-500">Pay securely with Razorpay</p>
                </div>
              </div>
            </label>

            <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:border-primary-600 transition-colors">
              <input
                type="radio"
                name="paymentMethod"
                checked={paymentMethod === 'cod'}
                onChange={() => setPaymentMethod('cod')}
                className="h-4 w-4 text-primary-600"
              />
              <div className="ml-4 flex items-center gap-2">
                <Truck className="h-5 w-5 text-primary-600" />
                <div>
                  <p className="font-medium">Cash on Delivery</p>
                  <p className="text-sm text-gray-500">Pay when you receive your order</p>
                </div>
              </div>
            </label>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          {cartItems.map(item => (
            <div key={item._id} className="flex items-center py-4 border-b last:border-b-0">
              <img
                src={getImageUrl(item.image)}
                alt={item.name}
                className="w-16 h-16 object-cover rounded-md"
              />
              <div className="ml-4 flex-1">
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-gray-600">
                  {item.quantity} x ₹{item.price}
                </p>
              </div>
              <div className="text-right">
              ₹{(item.quantity * item.price).toFixed(2)}
              </div>
            </div>
          ))}
          <div className="mt-4 text-right">
            <div className="text-lg font-semibold">
              Total: ₹{totalAmount.toFixed(2)}
            </div>
          </div>
        </div>

        <button
          onClick={handlePayment}
          className="w-full bg-primary-600 text-white py-3 rounded-md font-semibold hover:bg-primary-700 transition-colors"
        >
          {paymentMethod === 'cod' ? 'Place Order' : 'Pay Now'}
        </button>
      </div>
    </div>
  );
}