import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Shop } from './pages/Shop';
import { Cart } from './pages/Cart';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { Checkout } from './pages/Checkout';
import { OrderSuccess } from './pages/OrderSuccess';
import { Profile } from './pages/Profile';
import { ProductDetails } from './pages/ProductDetails';
import { CartProvider } from './context/CartContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Chatbot } from './components/Chatbot';

// Admin imports
import { AdminLogin } from './admin/pages/Login';
import { AdminLayout } from './admin/components/AdminLayout';
import { Dashboard } from './admin/pages/Dashboard';
import { Users } from './admin/pages/Users';
import { Products } from './admin/pages/Products';
import { Orders } from './admin/pages/Orders';
import { Reviews } from './admin/pages/Reviews';

function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return <Navigate to="/admin/login" />;
  }

  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Admin Routes */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route
        path="/admin"
        element={
          <RequireAuth>
            <AdminLayout>
              <Dashboard />
            </AdminLayout>
          </RequireAuth>
        }
      />
      <Route
        path="/admin/users"
        element={
          <RequireAuth>
            <AdminLayout>
              <Users />
            </AdminLayout>
          </RequireAuth>
        }
      />
      <Route
        path="/admin/products"
        element={
          <RequireAuth>
            <AdminLayout>
              <Products />
            </AdminLayout>
          </RequireAuth>
        }
      />
      <Route
        path="/admin/orders"
        element={
          <RequireAuth>
            <AdminLayout>
              <Orders />
            </AdminLayout>
          </RequireAuth>
        }
      />
      <Route
        path="/admin/reviews"
        element={
          <RequireAuth>
            <AdminLayout>
              <Reviews />
            </AdminLayout>
          </RequireAuth>
        }
      />

      {/* Client Routes */}
      <Route
        path="/*"
        element={
          <>
            <Navbar />
            <div className="min-h-screen bg-gray-50 flex flex-col">
              <div className="flex-grow">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/shop" element={<Shop />} />
                  <Route path="/product/:id" element={<ProductDetails />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/order-success" element={<OrderSuccess />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                </Routes>
              </div>
              <Footer />
            </div>
            <Chatbot />
          </>
        }
      />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <AppRoutes />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}