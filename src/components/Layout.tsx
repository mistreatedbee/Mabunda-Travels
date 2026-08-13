import { Outlet } from 'react-router-dom';
import { Wrench } from 'lucide-react';
import Navbar from './Navbar';
import Footer from './Footer';
import WhatsAppButton from './WhatsAppButton';
import { SettingsProvider, useSettings } from '../lib/SettingsContext';

function MaintenanceScreen() {
  const { maintenanceMessage } = useSettings();
  return (
    <div className="min-h-screen bg-forest-900 flex items-center justify-center px-5 text-center">
      <div className="max-w-md">
        <img src="/logo.jpeg" alt="Mabunda Travel & Tours" className="w-24 mx-auto mb-6 rounded-2xl shadow-xl" />
        <div className="w-14 h-14 rounded-full bg-gold/20 flex items-center justify-center mx-auto mb-5">
          <Wrench size={24} className="text-gold" aria-hidden="true" />
        </div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-white mb-3">We'll be right back</h1>
        <p className="text-white/70 text-sm sm:text-base leading-relaxed">
          {maintenanceMessage || "We're making some updates and will be back online shortly. Thanks for your patience."}
        </p>
      </div>
    </div>
  );
}

function LayoutContent() {
  const { maintenanceMode } = useSettings();

  if (maintenanceMode) {
    return <MaintenanceScreen />;
  }

  return (
    <div className="min-h-screen bg-white font-body text-forest-900 overflow-x-hidden flex flex-col">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-[60] bg-gold text-forest-900 font-semibold px-4 py-2 rounded-full"
      >
        Skip to main content
      </a>
      <Navbar />
      <main id="main-content" className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}

/** Shared shell for every page: skip link, navigation, content and footer — or a maintenance screen if enabled in Settings. */
export default function Layout() {
  return (
    <SettingsProvider>
      <LayoutContent />
    </SettingsProvider>
  );
}
