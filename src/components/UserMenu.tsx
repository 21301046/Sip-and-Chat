import React, { useState } from 'react';
import { User, LogOut, ShoppingBag } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { AuthModal } from './AuthModal';
import { Link } from 'react-router-dom';

export function UserMenu() {
  const { user, logout } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  if (!user) {
    return (
      <>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 text-gray-700 hover:text-primary-600"
        >
          <User className="h-5 w-5" />
          <span>Login</span>
        </button>
        <AuthModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="flex items-center gap-2 text-gray-700 hover:text-primary-600"
      >
        <User className="h-5 w-5" />
        <span>{user.name}</span>
      </button>

      {isMenuOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
          <Link
            to="/profile"
            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full"
            onClick={() => setIsMenuOpen(false)}
          >
            <ShoppingBag className="h-4 w-4" />
            <span>My Account</span>
          </Link>
          <button
            onClick={() => {
              logout();
              setIsMenuOpen(false);
            }}
            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full"
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </button>
        </div>
      )}
    </div>
  );
}