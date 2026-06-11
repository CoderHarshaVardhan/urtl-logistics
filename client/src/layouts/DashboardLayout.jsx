import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  Receipt,
  Truck,
  LogOut,
  Menu,
  X,
  Search,
  Bell,
  Settings,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const navItems = [
  { name: 'Dashboard',        path: '/dashboard',                icon: LayoutDashboard },
  { name: 'LR (Lorry Receipt)',path: '/dashboard/lr',            icon: FileText        },
  { name: 'Invoices',          path: '/dashboard/invoices',      icon: Receipt         },
  { name: 'Loading',           path: '/dashboard/loading',       icon: Truck           },
  { name: 'Loading Invoices',  path: '/dashboard/loading-invoices', icon: Receipt      },
];

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  /* Derive a page title from the current path */
  const currentPage =
    navItems.find((item) =>
      item.path === '/dashboard'
        ? location.pathname === '/dashboard'
        : location.pathname.startsWith(item.path)
    )?.name ?? 'Dashboard';

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden print:h-auto print:overflow-visible">

      {/* Mobile backdrop */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* ── Sidebar ── */}
      <aside
        className={`
          print:hidden fixed inset-y-0 left-0 z-30 w-60
          flex flex-col
          bg-[#0A0F1E] text-white
          border-r border-white/[0.06]
          transition-transform duration-300 ease-in-out
          lg:static lg:translate-x-0
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Brand */}
        <div className="flex items-center gap-3 px-5 h-[60px] border-b border-white/[0.06] flex-shrink-0">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-xs font-semibold tracking-wider flex-shrink-0">
            U
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-[13px] font-semibold tracking-widest text-blue-100">URTL</span>
            <span className="text-[9px] font-medium tracking-[0.14em] uppercase text-white/30 mt-0.5">Logistics</span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-5">
          <p className="text-[10px] font-semibold tracking-[0.1em] uppercase text-white/25 px-2 mb-3">
            Navigation
          </p>
          <ul className="space-y-0.5">
            {navItems.map((item) => (
              <li key={item.name}>
                <NavLink
                  to={item.path}
                  end={item.path === '/dashboard'}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-2.5 px-2.5 py-2.5 rounded-lg text-[13px] font-medium transition-colors duration-150
                     ${isActive
                       ? 'bg-blue-950/80 text-blue-300'
                       : 'text-white/40 hover:text-white/75 hover:bg-white/[0.05]'
                     }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <item.icon
                        className={`w-[15px] h-[15px] flex-shrink-0 ${isActive ? 'text-blue-400' : ''}`}
                        strokeWidth={1.75}
                      />
                      <span className="flex-1 truncate">{item.name}</span>
                      {isActive && (
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0" />
                      )}
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* User + Logout */}
        <div className="px-3 pb-4 border-t border-white/[0.06] pt-3 flex-shrink-0">
          <div className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-white/[0.04] cursor-default transition-colors group">
            <div className="w-8 h-8 rounded-full bg-blue-950 flex items-center justify-center text-[11px] font-semibold text-blue-300 uppercase flex-shrink-0">
              {user?.name?.charAt(0) ?? 'U'}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-[12px] font-medium text-white/80 truncate">{user?.name}</p>
              <p className="text-[10px] text-white/30 truncate mt-0.5">{user?.branch}</p>
            </div>
            <button
              onClick={handleLogout}
              title="Sign out"
              className="text-white/20 hover:text-red-400 transition-colors p-1 rounded"
            >
              <LogOut className="w-3.5 h-3.5" strokeWidth={2} />
            </button>
          </div>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="flex-1 flex flex-col w-0 overflow-hidden print:overflow-visible print:w-full">

        {/* Top bar */}
        <header className="print:hidden flex items-center justify-between h-[60px] px-5 bg-white border-b border-gray-100 flex-shrink-0">
          {/* Left: hamburger (mobile) + page title */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-1.5 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-[15px] font-semibold text-gray-800 leading-tight">{currentPage}</h1>
              <p className="text-[11px] text-gray-400 leading-tight hidden sm:block">
                URTL <ChevronRight className="inline w-2.5 h-2.5 -mt-0.5" strokeWidth={2} /> {currentPage}
              </p>
            </div>
          </div>

          {/* Right: actions */}
          <div className="flex items-center gap-1.5">
            {[
              { icon: Search,   label: 'Search'        },
              { icon: Bell,     label: 'Notifications' },
              { icon: Settings, label: 'Settings'      },
            ].map(({ icon: Icon, label }) => (
              <button
                key={label}
                title={label}
                className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Icon className="w-4 h-4" strokeWidth={1.75} />
              </button>
            ))}
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto print:overflow-visible focus:outline-none">
          <div className="p-5 md:p-6 print:p-0 max-w-7xl mx-auto print:w-full print:max-w-none">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;