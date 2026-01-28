
import React from 'react';
import { User } from '../types';

interface NavbarProps {
  user: User;
  isAdmin: boolean;
  onAdminClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, isAdmin, onAdminClick }) => {
  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b border-slate-200 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">ActiHub</span>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={onAdminClick}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-all ${
                isAdmin 
                  ? 'bg-amber-100 text-amber-700 hover:bg-amber-200' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {isAdmin ? 'Cerrar Admin' : 'Admin'}
            </button>
            <div className="h-8 w-px bg-slate-200 mx-2 hidden sm:block"></div>
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-sm font-semibold text-slate-800">{user.name}</span>
            </div>
            <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full ring-2 ring-indigo-50 border-2 border-white object-cover" />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
