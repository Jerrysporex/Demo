import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, User, LogOut, Shield } from 'lucide-react';

interface NavbarProps {
  onMenuClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onMenuClick }) => {
  const { user, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <button 
            onClick={onMenuClick}
            className="mr-2 rounded-md p-2 text-gray-500 hover:bg-gray-100 md:hidden"
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>
          
          <Link to="/" className="flex items-center gap-2">
            <Shield className="h-8 w-8 text-secondary" />
            <span className="text-xl font-bold text-primary">SecureLog</span>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              <div className="hidden md:block">
                <span className="text-sm text-gray-600">{user.email}</span>
              </div>
              
              <div className="relative">
                <button
                  className="flex items-center gap-2 rounded-full bg-gray-100 p-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
                  aria-label="User menu"
                >
                  <User size={16} />
                </button>
              </div>
              
              <button
                onClick={() => signOut()}
                className="rounded-md p-2 text-gray-500 hover:bg-gray-100"
                aria-label="Sign out"
              >
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="btn btn-primary"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;