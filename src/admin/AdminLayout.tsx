import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Inbox, Compass, Car, MapPinned, HelpCircle, MessageSquareQuote,
  Users, Settings as SettingsIcon, Home, LogOut, Menu, X, ExternalLink,
} from 'lucide-react';
import { useAuth } from './AuthContext';
import AdminTopbar from './AdminTopbar';
import Seo from '../components/Seo';

interface NavItem {
  to: string;
  label: string;
  icon: typeof LayoutDashboard;
  end?: boolean;
  roles?: ('super_admin' | 'admin' | 'editor')[];
}

interface NavSection {
  heading: string;
  items: NavItem[];
}

const NAV_SECTIONS: NavSection[] = [
  {
    heading: 'Start here',
    items: [
      { to: '/admin', label: 'Overview', icon: LayoutDashboard, end: true },
      { to: '/admin/homepage', label: 'Edit Homepage', icon: Home, roles: ['super_admin', 'admin'] },
      { to: '/admin/enquiries', label: 'Customer Enquiries', icon: Inbox },
    ],
  },
  {
    heading: 'Homepage content',
    items: [
      { to: '/admin/tours', label: 'Activities & Tours', icon: Compass },
      { to: '/admin/testimonials', label: 'Customer Reviews', icon: MessageSquareQuote },
      { to: '/admin/faqs', label: 'Questions & Answers', icon: HelpCircle },
    ],
  },
  {
    heading: 'Other website pages',
    items: [
      { to: '/admin/transfers', label: 'Transfer Services', icon: Car },
      { to: '/admin/destinations', label: 'Maps & Game Reserves', icon: MapPinned },
    ],
  },
];

const ROLE_LABEL: Record<string, string> = {
  super_admin: 'Super Admin',
  admin: 'Admin',
  editor: 'Editor',
};

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const { admin, signOut } = useAuth();
  const navigate = useNavigate();

  async function handleSignOut() {
    await signOut();
    navigate('/admin/login', { replace: true });
  }

  function canSee(item: NavItem) {
    if (!item.roles) return true;
    return admin?.role && item.roles.includes(admin.role);
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 px-5 py-6">
        <img src="/logo.jpeg" alt="" className="w-10 h-10 rounded-full object-cover" />
        <div>
          <div className="font-display text-white font-semibold text-sm leading-tight">Mabunda</div>
          <div className="text-gold text-[10px] uppercase tracking-[0.2em]">Website Admin</div>
        </div>
      </div>

      <nav className="flex-1 px-3 space-y-4 overflow-y-auto">
        {NAV_SECTIONS.map((section) => {
          const visible = section.items.filter(canSee);
          if (visible.length === 0) return null;
          return (
            <div key={section.heading}>
              <p className="px-3 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-white/35">
                {section.heading}
              </p>
              <div className="space-y-0.5">
                {visible.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    onClick={onNavigate}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                        isActive ? 'bg-gold text-forest-900' : 'text-white/70 hover:bg-white/10 hover:text-white'
                      }`
                    }
                  >
                    <item.icon size={18} aria-hidden="true" />
                    {item.label}
                  </NavLink>
                ))}
              </div>
            </div>
          );
        })}

        {(admin?.role === 'super_admin' || admin?.role === 'admin') && (
          <div>
            <p className="px-3 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-white/35">Your business</p>
            <NavLink
              to="/admin/settings"
              onClick={onNavigate}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive ? 'bg-gold text-forest-900' : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              <SettingsIcon size={18} aria-hidden="true" />
              Business Details
            </NavLink>
          </div>
        )}

        {admin?.role === 'super_admin' && (
          <div>
            <p className="px-3 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-white/35">Advanced</p>
            <div className="space-y-0.5">
              <NavLink
                to="/admin/admins"
                onClick={onNavigate}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    isActive ? 'bg-gold text-forest-900' : 'text-white/70 hover:bg-white/10 hover:text-white'
                  }`
                }
              >
                <Users size={18} aria-hidden="true" />
                Admin Users
              </NavLink>
            </div>
          </div>
        )}
      </nav>

      <div className="px-3 pb-3">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/60 hover:bg-white/10 hover:text-white transition-colors"
        >
          <ExternalLink size={18} aria-hidden="true" />
          View live website
        </a>
      </div>

      <div className="border-t border-white/10 px-5 py-4">
        <div className="mb-3">
          <div className="text-white text-sm font-medium truncate">{admin?.full_name || admin?.email}</div>
          <div className="text-white/50 text-xs">{admin ? ROLE_LABEL[admin.role] : ''}</div>
        </div>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-2 text-white/70 hover:text-white text-sm font-medium transition-colors"
        >
          <LogOut size={16} aria-hidden="true" />
          Sign out
        </button>
      </div>
    </div>
  );
}

export default function AdminLayout() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex font-body">
      <Seo title="Admin Dashboard | Mabunda Travel & Tours" description="Mabunda Travel & Tours admin dashboard." path="/admin" noindex />
      <aside className="hidden lg:flex w-64 flex-shrink-0 bg-forest-900">
        <SidebarContent />
      </aside>

      {drawerOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50" onClick={() => setDrawerOpen(false)} aria-hidden="true" />
          <aside className="absolute left-0 top-0 bottom-0 w-72 bg-forest-900 shadow-xl">
            <SidebarContent onNavigate={() => setDrawerOpen(false)} />
          </aside>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <header className="lg:hidden flex items-center justify-between px-4 py-3 bg-forest-900 sticky top-0 z-40">
          <div className="flex items-center gap-2.5">
            <img src="/logo.jpeg" alt="" className="w-8 h-8 rounded-full object-cover" />
            <span className="font-display text-white font-semibold text-sm">Website Admin</span>
          </div>
          <div className="flex items-center gap-1">
            <AdminTopbar variant="dark" />
            <button
              onClick={() => setDrawerOpen((v) => !v)}
              className="text-white p-2 -mr-1"
              aria-label={drawerOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={drawerOpen}
            >
              {drawerOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </header>

        <header className="hidden lg:flex items-center justify-end px-6 py-3 bg-white border-b border-gray-100 sticky top-0 z-40">
          <AdminTopbar />
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-6xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
