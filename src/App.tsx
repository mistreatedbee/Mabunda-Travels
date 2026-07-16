import Navbar from './components/Navbar';
import Hero from './components/Hero';
import TrustedBy from './components/TrustedBy';
import DealsSection from './components/DealsSection';
import LodgesSection from './components/LodgesSection';
import FAQ from './components/FAQ';
import Contact from './components/Contact';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';

export default function App() {
  return (
    <div className="min-h-screen bg-white font-body text-forest-900 overflow-x-hidden">
      <Navbar />
      <main>
        <Hero />
        <TrustedBy />
        <DealsSection />
        <LodgesSection />
        <FAQ />
        <Contact />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
