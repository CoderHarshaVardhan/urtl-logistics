import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { LogOut, User as UserIcon, Phone, Mail, MessageCircle, Instagram, MapPin, Navigation } from 'lucide-react';

const MainLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <header className="bg-white/80 backdrop-blur-xl shadow-sm z-50 sticky top-0 border-b border-gray-200/50 transition-all duration-300">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center group">
            <img src="/urtl-logo.png" alt="URTL Logo" className="h-10 w-auto object-contain transition-transform group-hover:scale-105 duration-300" />
            <span className="ml-4 text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-700 hidden sm:block tracking-tight drop-shadow-sm">
              URTL Logistics
            </span>
          </Link>

          <nav className="flex items-center space-x-1 sm:space-x-4">
            {user ? (
              <>
                {user.role === 'admin' ? (
                  <Link to="/admin-dashboard" className="px-3 py-2 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-blue-50 font-bold transition-colors">
                    Admin Dashboard
                  </Link>
                ) : (
                  <Link to="/dashboard" className="px-3 py-2 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-blue-50 font-bold transition-colors">
                    Dashboard
                  </Link>
                )}
                <div className="flex items-center space-x-2 pl-4 border-l border-gray-300 ml-2">
                  <div className="hidden sm:flex items-center px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg font-bold text-sm">
                    <UserIcon size={16} className="mr-2" />
                    {user.name}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="ml-2 flex items-center px-4 py-2 rounded-lg text-sm font-bold text-white bg-red-500 hover:bg-red-600 shadow-sm hover:shadow transition-all duration-200"
                  >
                    <LogOut size={16} className="sm:mr-2" /> 
                    <span className="hidden sm:block">Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <Link
                to="/login"
                className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-2.5 text-sm font-bold text-white hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-md shadow-blue-500/30 hover:shadow-xl hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Login
              </Link>
            )}
          </nav>
        </div>
      </header>

      <main className="flex-1 w-full">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 w-full">
          <Outlet />
        </div>
      </main>

      <footer className="bg-white pt-16 pb-8 border-t border-gray-200 mt-auto shadow-inner relative overflow-hidden">
        {/* Decorative background element for footer */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl opacity-50 -mt-32 -mr-32 pointer-events-none"></div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-12 mb-12">
            
            {/* Branding & Location */}
            <div className="md:col-span-5 flex flex-col space-y-5">
              <Link to="/" className="flex items-center group inline-flex max-w-max">
                <div className="bg-gray-50 p-2 rounded-2xl border border-gray-100 group-hover:shadow-md transition-shadow">
                  <img src="/urtl-logo.png" alt="URTL Logo" className="h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105" />
                </div>
                <span className="ml-4 text-3xl font-extrabold text-gray-900 tracking-tight">
                  URTL Logistics
                </span>
              </Link>
              <p className="text-gray-500 text-base leading-relaxed max-w-md font-medium">
                Streamlining your global supply chain with modern, reliable, and seamless logistics solutions powered by advanced tracking.
              </p>
              <div className="flex items-center text-gray-700 font-bold bg-gray-50 w-max px-4 py-2 rounded-lg border border-gray-100">
                <MapPin size={18} className="text-blue-600 mr-2" />
                Headquarters: Hyderabad, India
              </div>
            </div>

            {/* Contact Section */}
            <div className="md:col-span-4 flex flex-col">
              <h3 className="text-xl font-extrabold text-gray-900 mb-5 flex items-center">
                Contact Us
                <div className="ml-3 h-1 w-10 bg-blue-500 rounded-full"></div>
              </h3>
              <div className="flex flex-col space-y-3">
                <a href="tel:+916305746114" className="flex items-center p-3 rounded-xl bg-gray-50 hover:bg-blue-50 border border-gray-100 hover:border-blue-200 transition-all duration-300 group shadow-sm hover:shadow-md">
                  <div className="bg-white p-2.5 rounded-xl shadow-sm mr-4 group-hover:bg-blue-600 group-hover:text-white text-blue-600 transition-colors">
                    <Phone size={18} />
                  </div>
                  <span className="text-gray-700 font-bold group-hover:text-blue-700">+91 6305746114</span>
                </a>
                
                <a href="tel:+918207469195" className="flex items-center p-3 rounded-xl bg-gray-50 hover:bg-blue-50 border border-gray-100 hover:border-blue-200 transition-all duration-300 group shadow-sm hover:shadow-md">
                  <div className="bg-white p-2.5 rounded-xl shadow-sm mr-4 group-hover:bg-blue-600 group-hover:text-white text-blue-600 transition-colors">
                    <Phone size={18} />
                  </div>
                  <span className="text-gray-700 font-bold group-hover:text-blue-700">+91 8207469195</span>
                </a>

                <a href="mailto:support@urtllogistics.com" className="flex items-center p-3 rounded-xl bg-gray-50 hover:bg-blue-50 border border-gray-100 hover:border-blue-200 transition-all duration-300 group shadow-sm hover:shadow-md">
                  <div className="bg-white p-2.5 rounded-xl shadow-sm mr-4 group-hover:bg-blue-600 group-hover:text-white text-blue-600 transition-colors">
                    <Mail size={18} />
                  </div>
                  <span className="text-gray-700 font-bold group-hover:text-blue-700 truncate">support@urtllogistics.com</span>
                </a>
              </div>
            </div>

            {/* Social Links */}
            <div className="md:col-span-3 flex flex-col">
              <h3 className="text-xl font-extrabold text-gray-900 mb-5 flex items-center">
                Connect
                <div className="ml-3 h-1 w-10 bg-blue-500 rounded-full"></div>
              </h3>
              <div className="flex flex-col space-y-3">
                <a href="https://wa.me/916305746114" target="_blank" rel="noreferrer" className="flex items-center p-3 rounded-xl bg-green-50 hover:bg-green-100 border border-green-100 hover:border-green-300 transition-all duration-300 group shadow-sm hover:shadow-md">
                  <div className="bg-white p-2.5 rounded-xl shadow-sm mr-4 text-green-600 group-hover:bg-green-600 group-hover:text-white transition-colors">
                    <MessageCircle size={18} />
                  </div>
                  <span className="text-green-800 font-bold">WhatsApp</span>
                </a>

                <a href="https://www.instagram.com/urtl__logistics" target="_blank" rel="noreferrer" className="flex items-center p-3 rounded-xl bg-pink-50 hover:bg-pink-100 border border-pink-100 hover:border-pink-300 transition-all duration-300 group shadow-sm hover:shadow-md">
                  <div className="bg-white p-2.5 rounded-xl shadow-sm mr-4 text-pink-600 group-hover:bg-gradient-to-tr group-hover:from-yellow-400 group-hover:via-pink-500 group-hover:to-purple-600 group-hover:text-white transition-all">
                    <Instagram size={18} />
                  </div>
                  <span className="text-pink-800 font-bold">Instagram</span>
                </a>
              </div>
            </div>
            
          </div>

          <div className="pt-8 border-t border-gray-200 flex flex-col md:flex-row items-center justify-between">
            <p className="text-sm text-gray-500 font-bold">
              &copy; {new Date().getFullYear()} URTL Logistics. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0 text-sm text-gray-500 font-bold">
              <Link to="/" className="hover:text-blue-600 transition-colors">Privacy Policy</Link>
              <Link to="/" className="hover:text-blue-600 transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
