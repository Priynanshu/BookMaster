import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logoutUser } from "../../features/auth/authSlice";
import {
  LayoutDashboard, Search, Library, Network,
  Settings, LogOut, BookMarked, X
} from "lucide-react";

// Added props: isOpen and onClose
const Sidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    { id: "search", label: "Search", icon: Search, path: "/search" },
    { id: "collection", label: "My Collection", icon: Library, path: "/collections" },
    { id: "graph", label: "Graph View", icon: Network, path: "/graph" },
  ];

  const isActive = (path) => location.pathname === path;

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate("/login");
  };

  const handleNavClick = (path) => {
    navigate(path);
    if (onClose) onClose(); // Mobile par click hote hi sidebar close ho jaye
  };

  return (
    <aside className={`
      fixed left-0 top-0 h-screen w-64 bg-[#0A0A0F] border-r border-[#1F1F2E] 
      flex flex-col z-50 transition-transform duration-300 ease-in-out
      ${isOpen ? "translate-x-0" : "-translate-x-full"} 
      lg:translate-x-0 lg:flex
    `}>
      
      {/* Logo & Close Button (Mobile Only) */}
      <div className="p-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-[#7C3AED] to-[#06B6D4] rounded-xl flex items-center justify-center shadow-lg shadow-purple-900/20">
            <BookMarked className="text-white" size={24} />
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            BookMaster
          </h1>
        </div>
        
        {/* Mobile Close Button */}
        <button onClick={onClose} className="lg:hidden text-gray-400 hover:text-white">
          <X size={24} />
        </button>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleNavClick(item.path)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl 
              text-sm font-medium transition-all duration-200
              ${isActive(item.path)
                ? "bg-[#7C3AED]/10 text-[#7C3AED] border border-[#7C3AED]/20"
                : "text-gray-400 hover:text-white hover:bg-[#13131A] border border-transparent"
              }`}
          >
            <item.icon size={20} />
            {item.label}
          </button>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-6 border-t border-[#1F1F2E] space-y-4">
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl 
          text-sm font-medium text-gray-400 hover:text-white 
          hover:bg-[#13131A] transition-all duration-200">
          <Settings size={20} />
          Settings
        </button>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl 
            text-sm font-medium text-red-500/80 hover:text-red-500 
            hover:bg-red-500/5 transition-all duration-200"
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;