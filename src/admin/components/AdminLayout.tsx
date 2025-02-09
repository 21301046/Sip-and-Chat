import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Coffee, 
  ShoppingBag, 
  MessageSquare,
  LogOut,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  path: string;
  isActive: boolean;
}

function SidebarItem({ icon, label, path, isActive }: SidebarItemProps) {
  return (
    <Link
      to={path}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
        isActive 
          ? 'bg-primary-600 text-white' 
          : 'text-gray-600 hover:bg-gray-100'
      }`}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const { user, logout } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 fixed h-full">
        <div className="p-6">
          <Link to="/admin" className="flex items-center gap-2 text-xl font-bold text-gray-800">
            <Coffee className="h-6 w-6 text-primary-600" />
            <span>Admin Panel</span>
          </Link>
        </div>

        <nav className="px-4 space-y-2">
          <SidebarItem
            icon={<LayoutDashboard className="h-5 w-5" />}
            label="Dashboard"
            path="/admin"
            isActive={isActive('/admin')}
          />
          <SidebarItem
            icon={<Users className="h-5 w-5" />}
            label="Users"
            path="/admin/users"
            isActive={isActive('/admin/users')}
          />
          <SidebarItem
            icon={<Coffee className="h-5 w-5" />}
            label="Products"
            path="/admin/products"
            isActive={isActive('/admin/products')}
          />
          <SidebarItem
            icon={<ShoppingBag className="h-5 w-5" />}
            label="Orders"
            path="/admin/orders"
            isActive={isActive('/admin/orders')}
          />
          <SidebarItem
            icon={<MessageSquare className="h-5 w-5" />}
            label="Reviews"
            path="/admin/reviews"
            isActive={isActive('/admin/reviews')}
          />
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="border-t pt-4">
            <div className="flex items-center justify-between px-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center">
                  {user?.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">{user?.name}</p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
              </div>
              <button 
                onClick={logout}
                className="p-1 text-gray-400 hover:text-gray-600"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8">
        {children}
      </main>
    </div>
  );
}