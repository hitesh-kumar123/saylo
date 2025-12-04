import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, User, LogOut } from "lucide-react";
import { Button } from "../ui/Button";
import { useAuthStore } from "../../store/authStore";
import { motion } from "framer-motion";

export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);
  const { user, isAuthenticated, logout } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isAuthenticated) {
      navigate("/dashboard");
    } else {
      navigate("/");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header 
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-slate-950/90 backdrop-blur-xl border-b border-white/10 shadow-lg' 
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <a
                href="#"
                onClick={handleLogoClick}
                className="text-white font-bold text-xl tracking-tight"
              >
                saylo<span className="text-primary-400">.hire</span>
              </a>
            </div>
            <nav className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {isAuthenticated && (
                <>
                  <Link
                    to="/dashboard"
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors ${
                      isActive("/dashboard")
                        ? "border-primary-500 text-white"
                        : "border-transparent text-slate-400 hover:border-slate-300 hover:text-slate-200"
                    }`}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/interview"
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors ${
                      isActive("/interview")
                        ? "border-primary-500 text-white"
                        : "border-transparent text-slate-400 hover:border-slate-300 hover:text-slate-200"
                    }`}
                  >
                    Interview
                  </Link>
                  <Link
                    to="/career"
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors ${
                      isActive("/career")
                        ? "border-primary-500 text-white"
                        : "border-transparent text-slate-400 hover:border-slate-300 hover:text-slate-200"
                    }`}
                  >
                    Career
                  </Link>
                  <Link
                    to="/resume"
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors ${
                      isActive("/resume")
                        ? "border-primary-500 text-white"
                        : "border-transparent text-slate-400 hover:border-slate-300 hover:text-slate-200"
                    }`}
                  >
                    Resume
                  </Link>
                </>
              )}
            </nav>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Link to="/profile" className="flex items-center group">
                    <span className="text-sm font-medium text-slate-300 mr-2 group-hover:text-white transition-colors">
                      {user?.name}
                    </span>
                    <div className="bg-slate-800 rounded-full p-1 border border-white/10 group-hover:border-primary-500/50 transition-colors">
                      <User size={18} className="text-slate-400 group-hover:text-white" />
                    </div>
                  </Link>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  leftIcon={<LogOut size={16} />}
                  className="text-slate-400 hover:text-white hover:bg-white/5"
                >
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white hover:bg-white/5">
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="sm" className="shadow-lg shadow-primary-500/20">Sign Up</Button>
                </Link>
              </div>
            )}
          </div>
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-400 hover:text-white hover:bg-white/10 focus:outline-none"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="sm:hidden bg-slate-900/95 backdrop-blur-xl border-b border-white/10"
        >
          <div className="pt-2 pb-3 space-y-1">
            {isAuthenticated && (
              <>
                <Link
                  to="/dashboard"
                  className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                    isActive("/dashboard")
                      ? "border-primary-500 text-white bg-white/5"
                      : "border-transparent text-slate-400 hover:bg-white/5 hover:border-slate-300 hover:text-white"
                  }`}
                >
                  Dashboard
                </Link>
                <Link
                  to="/interview"
                  className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                    isActive("/interview")
                      ? "border-primary-500 text-white bg-white/5"
                      : "border-transparent text-slate-400 hover:bg-white/5 hover:border-slate-300 hover:text-white"
                  }`}
                >
                  Interview
                </Link>
                <Link
                  to="/career"
                  className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                    isActive("/career")
                      ? "border-primary-500 text-white bg-white/5"
                      : "border-transparent text-slate-400 hover:bg-white/5 hover:border-slate-300 hover:text-white"
                  }`}
                >
                  Career
                </Link>
                <Link
                  to="/resume"
                  className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                    isActive("/resume")
                      ? "border-primary-500 text-white bg-white/5"
                      : "border-transparent text-slate-400 hover:bg-white/5 hover:border-slate-300 hover:text-white"
                  }`}
                >
                  Resume
                </Link>
              </>
            )}
          </div>
          <div className="pt-4 pb-3 border-t border-white/10">
            {isAuthenticated ? (
              <>
                <div className="flex items-center px-4">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center border border-white/10">
                      <User className="h-6 w-6 text-slate-400" />
                    </div>
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium text-white">
                      {user?.name}
                    </div>
                    <div className="text-sm font-medium text-slate-500">
                      {user?.email}
                    </div>
                  </div>
                </div>
                <div className="mt-3 space-y-1">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-base font-medium text-slate-400 hover:text-white hover:bg-white/5"
                  >
                    Your Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-base font-medium text-slate-400 hover:text-white hover:bg-white/5"
                  >
                    Sign out
                  </button>
                </div>
              </>
            ) : (
              <div className="mt-3 space-y-1 px-4">
                <Link
                  to="/login"
                  className="block px-4 py-2 text-base font-medium text-slate-400 hover:text-white hover:bg-white/5"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block px-4 py-2 text-base font-medium text-slate-400 hover:text-white hover:bg-white/5"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </header>
  );
};
