import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Bell, User, Menu, Plus, LogOut, 
  ChevronRight, Settings, LayoutDashboard,
  BookMarked // Logo ke liye icon import kiya
} from 'lucide-react';
import useAuth from '../../hooks/useAuth'; 
import Button from '../ui/Button';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = ({ onMenuToggle, onAddBook }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const location = useLocation();

  // Check if current page is Home
  const isHomePage = location.pathname === "/";

  // Current page name for breadcrumbs
  const pathName = location.pathname.split('/').pop();
  const formattedPath = pathName.charAt(0).toUpperCase() + pathName.slice(1);

  return (
    <nav className="sticky top-0 z-30 w-full h-20 bg-[#0A0A0F]/80 backdrop-blur-xl border-b border-[#1F1F2E] px-6 lg:px-10 flex items-center justify-between">
      
      {/* ── Left Section ── */}
      <div className="flex items-center gap-4">
        {/* Mobile Toggle - Sirf Dashboard/App pages par dikhega */}
        {!isHomePage && (
          <button 
            onClick={onMenuToggle}
            className="lg:hidden p-2 text-gray-400 hover:text-white transition-colors bg-[#13131A] rounded-lg border border-[#1F1F2E]"
          >
            <Menu size={20} />
          </button>
        )}

        {/* Conditional Rendering: Logo (Home) vs Breadcrumbs (Dashboard) */}
        {isHomePage ? (
          // ── BookMaster Logo for Home Page ──
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-[#7C3AED] to-[#06B6D4] rounded-xl flex items-center justify-center shadow-lg shadow-purple-900/20 group-hover:scale-105 transition-transform">
              <BookMarked className="text-white" size={22} />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent hidden sm:block">
              BookMaster
            </h1>
          </Link>
        ) : (
          // ── Breadcrumbs for Dashboard ──
          <div className="hidden md:flex items-center gap-2 text-sm font-medium">
            <Link to="/" className="text-gray-500 hover:text-[#7C3AED] transition-colors">Home</Link>
            <ChevronRight size={14} className="text-gray-700" />
            <span className="text-white capitalize">{formattedPath || "Dashboard"}</span>
          </div>
        )}
      </div>

      {/* ── Right: Actions & Profile ── */}
      <div className="flex items-center gap-3 md:gap-5">
        
        {isAuthenticated ? (
          <>

            <div className="h-6 w-[1px] bg-[#1F1F2E] mx-1 hidden sm:block" />

            {/* <button className="relative p-2.5 text-gray-400 hover:text-white transition-colors bg-[#13131A] rounded-xl border border-[#1F1F2E]">
              <Bell size={20} />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-[#06B6D4] rounded-full border-2 border-[#0A0A0F]" />
            </button> */}

            <div className="relative">
              <button 
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-3 p-1 rounded-xl hover:bg-[#13131A] transition-all border border-transparent hover:border-[#1F1F2E]"
              >
                <div className="w-9 h-9 bg-[#7C3AED]/20 rounded-lg flex items-center justify-center text-[#7C3AED] border border-[#7C3AED]/30">
                  <User size={20} />
                </div>
                <div className="hidden lg:block text-left">
                  <p className="text-xs font-bold text-white truncate w-24">
                    {user?.username || 'Developer'}
                  </p>
                  <p className="text-[10px] text-gray-500">Member</p>
                </div>
              </button>

              <AnimatePresence>
                {showProfileMenu && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowProfileMenu(false)} />
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-3 w-56 bg-[#13131A] border border-[#1F1F2E] rounded-2xl shadow-2xl p-2 z-20"
                    >
                      <Link to="/dashboard" className="flex items-center gap-3 px-4 py-3 text-sm text-gray-400 hover:text-white hover:bg-[#1F1F2E] rounded-xl transition-all">
                        <LayoutDashboard size={16} /> Dashboard
                      </Link>
                      <Link to="/settings" className="flex items-center gap-3 px-4 py-3 text-sm text-gray-400 hover:text-white hover:bg-[#1F1F2E] rounded-xl transition-all">
                        <Settings size={16} /> Settings
                      </Link>
                      <hr className="my-2 border-[#1F1F2E]" />
                      <button 
                        onClick={logout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
                      >
                        <LogOut size={16} /> Sign Out
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </>
        ) : (
          <div className="flex items-center gap-2">
            <Link to="/login" className="text-sm font-medium text-gray-400 hover:text-white px-4 py-2">
              Login
            </Link>
            <Link to="/register">
              <Button size="sm" className="px-5 rounded-xl shadow-lg shadow-[#7C3AED]/20">
                Join Now
              </Button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;