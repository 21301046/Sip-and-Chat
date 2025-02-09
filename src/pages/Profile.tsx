import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Package, Clock, Bell, User, LogOut, ChevronRight, MapPin, Truck, CheckCircle, ShoppingBag, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface OrderType {
  _id: string;
  items: Array<{
    product: {
      _id: string;
      name: string;
      price: number;
      image: string;
    };
    quantity: number;
  }>;
  totalAmount: number;
  status: 'pending' | 'paid' | 'shipped' | 'delivered';
  createdAt: string;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

type TabType = 'profile' | 'ongoing' | 'history' | 'notifications';

interface TrackingStep {
  title: string;
  description: string;
  icon: React.ReactNode;
  status: 'completed' | 'current' | 'upcoming';
}

export function Profile() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const [selectedOrder, setSelectedOrder] = useState<OrderType | null>(null);
  const [isTrackingModalOpen, setIsTrackingModalOpen] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/orders/my-orders', {
          credentials: 'include',
        });
        if (response.ok) {
          const data = await response.json();
          setOrders(data);
        }
      } catch (err) {
        console.error('Error fetching orders:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const ongoingOrders = orders.filter(order => 
    ['pending', 'paid', 'shipped'].includes(order.status)
  );

  const completedOrders = orders.filter(order => 
    order.status === 'delivered'
  );

  const getStatusColor = (status: OrderType['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'paid':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTrackingSteps = (order: OrderType): TrackingStep[] => {
    const steps: TrackingStep[] = [
      {
        title: 'Order Placed',
        description: `Order placed on ${new Date(order.createdAt).toLocaleDateString()}`,
        icon: <ShoppingBag className="h-6 w-6" />,
        status: 'completed'
      },
      {
        title: 'Payment Confirmed',
        description: 'Payment has been confirmed',
        icon: <CheckCircle className="h-6 w-6" />,
        status: order.status === 'pending' ? 'upcoming' : 'completed'
      },
      {
        title: 'Order Shipped',
        description: 'Your order is on its way & will reach you soon',
        icon: <Truck className="h-6 w-6" />,
        status: order.status === 'pending' || order.status === 'paid' 
          ? 'upcoming' 
          : order.status === 'shipped' 
            ? 'current' 
            : 'completed'
      },
      {
        title: 'Order Delivered',
        description: 'Package has been delivered',
        icon: <MapPin className="h-6 w-6" />,
        status: order.status === 'delivered' ? 'completed' : 'upcoming'
      }
    ];

    return steps;
  };

  // Helper function to get correct image URL
  const getImageUrl = (imageUrl: string) => {
    return imageUrl.startsWith('http') 
      ? imageUrl 
      : `http://localhost:5000${imageUrl}`;
  };

  const renderOrders = (orderList: OrderType[]) => (
    <div className="space-y-4">
      {orderList.map((order) => (
        <div
          key={order._id}
          className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-gray-600">Order ID: {order._id}</p>
              <p className="text-sm text-gray-600">
                {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
              {order.status}
            </span>
          </div>
          <div className="space-y-2">
            {order.items.map((item, index) => (
              <div key={index} className="flex items-center gap-4">
                <img
                  src={getImageUrl(item.product.image)}
                  alt={item.product.name}
                  className="w-16 h-16 object-cover rounded"
                />
                <div className="flex-1">
                  <p className="font-medium">{item.product.name}</p>
                  <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                </div>
                <p className="font-medium">₹{(item.product.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t flex justify-between items-center">
            <div className="text-sm text-gray-600">
              Shipping to: {order.shippingAddress.city}, {order.shippingAddress.country}
            </div>
            <div className="flex items-center gap-4">
              <div className="text-lg font-bold text-primary-600">
                Total: ₹{order.totalAmount.toFixed(2)}
              </div>
              <button
                onClick={() => {
                  setSelectedOrder(order);
                  setIsTrackingModalOpen(true);
                }}
                className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors flex items-center gap-2"
              >
                <Truck className="h-4 w-4" />
                Track Order
              </button>
            </div>
          </div>
        </div>
      ))}
      {orderList.length === 0 && (
        <div className="text-center py-8 text-gray-600">
          No orders found
        </div>
      )}
    </div>
  );

    // Tracking Modal
  const TrackingModal = () => {
    if (!selectedOrder) return null;

    const steps = getTrackingSteps(selectedOrder);
    const isDelivered = selectedOrder.status === 'delivered';

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Track Your Order</h2>
            <button
              onClick={() => setIsTrackingModalOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ×
            </button>
          </div>

          {/* Order Summary */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Order ID</p>
                <p className="font-medium">{selectedOrder._id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Order Date</p>
                <p className="font-medium">
                  {new Date(selectedOrder.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Shipping Address</p>
                <p className="font-medium">
                  {selectedOrder.shippingAddress.street}, {selectedOrder.shippingAddress.city}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Amount</p>
                <p className="font-medium">₹{selectedOrder.totalAmount.toFixed(2)}</p>
              </div>
            </div>
          </div>

          {/* Tracking Timeline */}
          <div className="relative">
            {steps.map((step, index) => (
              <div key={index} className="flex items-start mb-8 last:mb-0">
                <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center mr-4 ${
                  step.status === 'completed' 
                    ? 'bg-green-100 text-green-600'
                    : step.status === 'current'
                      ? 'bg-blue-100 text-blue-600'
                      : 'bg-gray-100 text-gray-400'
                }`}>
                  {step.icon}
                </div>
                <div className="flex-grow">
                  <h3 className={`font-semibold ${
                    step.status === 'completed' 
                      ? 'text-green-600'
                      : step.status === 'current'
                        ? 'text-blue-600'
                        : 'text-gray-400'
                  }`}>
                    {step.title}
                  </h3>
                  <p className="text-sm text-gray-600">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className="absolute left-5 top-10 bottom-0 w-[2px] bg-gray-200 -z-10" />
                )}
              </div>
            ))}
          </div>

          {/* Review Button for Delivered Orders */}
          {isDelivered && selectedOrder.items.map((item, index) => (
            <div key={index} className="mt-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <img
                    src={getImageUrl(item.product.image)}
                    alt={item.product.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div>
                    <h3 className="font-medium">{item.product.name}</h3>
                    <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setIsTrackingModalOpen(false);
                    navigate(`/product/${item.product._id}`);
                  }}
                  className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors"
                >
                  <Star className="h-4 w-4" />
                  Add Review
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">My Account</h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="flex items-center gap-3 p-4 border-b">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-xl font-semibold text-primary-600">
                    {user?.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="font-semibold">{user?.name}</p>
                  <p className="text-sm text-gray-600">{user?.email}</p>
                </div>
              </div>

              <nav className="mt-4 space-y-2">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full flex items-center justify-between p-3 rounded-lg ${
                    activeTab === 'profile' ? 'bg-primary-50 text-primary-600' : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5" />
                    <span>My Profile</span>
                  </div>
                  <ChevronRight className="h-5 w-5" />
                </button>

                <button
                  onClick={() => setActiveTab('ongoing')}
                  className={`w-full flex items-center justify-between p-3 rounded-lg ${
                    activeTab === 'ongoing' ? 'bg-primary-50 text-primary-600' : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5" />
                    <span>Ongoing Orders</span>
                  </div>
                  <ChevronRight className="h-5 w-5" />
                </button>

                <button
                  onClick={() => setActiveTab('history')}
                  className={`w-full flex items-center justify-between p-3 rounded-lg ${
                    activeTab === 'history' ? 'bg-primary-50 text-primary-600' : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Package className="h-5 w-5" />
                    <span>Order History</span>
                  </div>
                  <ChevronRight className="h-5 w-5" />
                </button>

                <button
                  onClick={() => setActiveTab('notifications')}
                  className={`w-full flex items-center justify-between p-3 rounded-lg ${
                    activeTab === 'notifications' ? 'bg-primary-50 text-primary-600' : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Bell className="h-5 w-5" />
                    <span>Notifications</span>
                  </div>
                  <ChevronRight className="h-5 w-5" />
                </button>

                <button
                  onClick={logout}
                  className="w-full flex items-center gap-3 p-3 text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="md:col-span-3">
            {activeTab === 'profile' && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-6">My Profile</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <input
                      type="text"
                      value={user?.name}
                      readOnly
                      className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                      type="email"
                      value={user?.email}
                      readOnly
                      className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'ongoing' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold">Ongoing Orders</h2>
                {renderOrders(ongoingOrders)}
              </div>
            )}

            {activeTab === 'history' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold">Order History</h2>
                {renderOrders(completedOrders)}
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-6">Notifications</h2>
                <div className="text-center py-8 text-gray-600">
                  No new notifications
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tracking Modal */}
      {isTrackingModalOpen && <TrackingModal />}
    </div>
  );
}