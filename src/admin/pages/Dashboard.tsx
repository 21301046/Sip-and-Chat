import React, { useEffect, useState } from 'react';
import { Users, ShoppingBag, DollarSign, TrendingUp, Package, Star, ArrowUp, ArrowDown, Coffee, ShoppingCart } from 'lucide-react';
import { StatsCard } from '../components/StatsCard';
import { api } from '../../services/api';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

interface DashboardStats {
  totalUsers: number;
  totalOrders: number;
  totalProducts: number;
  revenue: number;
  monthlyRevenue: Array<{
    _id: { year: number; month: number };
    total: number;
  }>;
  productCategories?: {
    beans: number;
    equipment: number;
    accessories: number;
  };
  recentOrders?: Array<{
    _id: string;
    user: {
      name: string;
    };
    totalAmount: number;
    status: string;
    createdAt: string;
  }>;
}

const COLORS = ['#CE0F10', '#F87171', '#FECACA'];

// Our actual products data
const actualTopProducts = [
  {
    name: "Ethiopian Yirgacheffe",
    price: 180,
    sales: 156,
    revenue: 2961.44,
    category: "beans",
    trend: 15
  },
  {
    name: "Colombian Supremo",
    price: 160,
    sales: 142,
    revenue: 2412.58,
    category: "beans",
    trend: 12
  },
  {
    name: "Sumatra Dark Roast",
    price: 170,
    sales: 128,
    revenue: 2302.72,
    category: "beans",
    trend: 8
  },
  {
    name: "Precision Coffee Scale",
    price: 490,
    sales: 89,
    revenue: 4449.11,
    category: "equipment",
    trend: 20
  },
  {
    name: "Gooseneck Kettle",
    price: 790,
    sales: 76,
    revenue: 6079.24,
    category: "equipment",
    trend: 18
  }
];

export function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await api.getAdminStats();
        setStats(data);
      } catch (err) {
        console.error('Error fetching stats:', err);
        setError('Failed to load dashboard stats');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 py-8">
        {error}
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center text-gray-600 py-8">
        No dashboard data available
      </div>
    );
  }

  // Calculate growth percentages
  const calculateGrowth = (current: number, previous: number) => {
    if (!previous) return 0;
    return ((current - previous) / previous) * 100;
  };

  const currentMonthRevenue = stats.monthlyRevenue[0]?.total || 0;
  const previousMonthRevenue = stats.monthlyRevenue[1]?.total || 0;
  const revenueGrowth = calculateGrowth(currentMonthRevenue, previousMonthRevenue);

  // Format monthly revenue data for chart
  const revenueData = stats.monthlyRevenue
    .slice(0, 12)
    .reverse()
    .map(item => ({
      month: new Date(item._id.year, item._id.month - 1).toLocaleString('default', { month: 'short' }),
      revenue: item.total,
      formattedRevenue: `₹${item.total.toLocaleString()}`
    }));

  // Product categories data
  const categoryData = [
    { name: 'Coffee Beans', value: 45 },
    { name: 'Equipment', value: 30 },
    { name: 'Accessories', value: 25 }
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 shadow-lg rounded-lg border">
          <p className="font-medium">{label}</p>
          <p className="text-primary-600">Revenue: {payload[0].payload.formattedRevenue}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <div className="flex items-center gap-2 bg-primary-50 text-primary-600 px-3 py-1 rounded-full text-sm">
          <Coffee className="h-4 w-4" />
          <span>Live Updates</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Users"
          value={stats.totalUsers}
          icon={Users}
          trend={{ value: 12, isPositive: true }}
          bgColor="bg-blue-500"
        />
        <StatsCard
          title="Total Orders"
          value={stats.totalOrders}
          icon={ShoppingBag}
          trend={{ value: 8, isPositive: true }}
          bgColor="bg-green-500"
        />
        <StatsCard
          title="Revenue"
          value={`₹${stats.revenue.toLocaleString()}`}
          icon={DollarSign}
          trend={{ value: revenueGrowth, isPositive: revenueGrowth > 0 }}
          bgColor="bg-primary-600"
        />
        <StatsCard
          title="Total Products"
          value={stats.totalProducts}
          icon={Package}
          trend={{ value: 5, isPositive: true }}
          bgColor="bg-purple-500"
        />
      </div>

      {/* Revenue Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold">Revenue Overview</h2>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-primary-600 rounded-full"></div>
                <span className="text-sm text-gray-600">Monthly Revenue</span>
              </div>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#CE0F10" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#CE0F10" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#CE0F10"
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Product Categories */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-6">Product Categories</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2">
            {categoryData.map((category, index) => (
              <div key={category.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: COLORS[index] }}></div>
                  <span className="text-sm text-gray-600">{category.name}</span>
                </div>
                <span className="text-sm font-medium">{category.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Products and Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-6">Top Products</h2>
          <div className="space-y-4">
            {actualTopProducts.map((product, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    product.category === 'beans' 
                      ? 'bg-primary-100 text-primary-600'
                      : 'bg-blue-100 text-blue-600'
                  }`}>
                    {product.category === 'beans' ? (
                      <Coffee className="h-5 w-5" />
                    ) : (
                      <Package className="h-5 w-5" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium">{product.name}</h3>
                    <p className="text-sm text-gray-600">{product.sales} sales</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">₹{product.revenue.toLocaleString()}</p>
                  <p className="text-sm text-green-600">+{product.trend}%</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold">Recent Orders</h2>
            <button className="text-primary-600 text-sm hover:text-primary-700">View All</button>
          </div>
          <div className="space-y-4">
            {stats.recentOrders && stats.recentOrders.length > 0 ? (
              stats.recentOrders.slice(0, 5).map((order, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                      <ShoppingCart className="h-5 w-5 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">{order.user.name}</h3>
                      <p className="text-sm text-gray-600">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${order.totalAmount.toLocaleString()}</p>
                    <span className={`text-sm px-2 py-1 rounded-full ${
                      order.status === 'delivered' 
                        ? 'bg-green-100 text-green-800'
                        : order.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                No recent orders
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}