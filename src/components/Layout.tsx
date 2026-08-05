import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import WhatsAppButton from './WhatsAppButton';

/** Shared shell for every page: skip link, navigation, content and footer. */
export default function Layout() {
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
