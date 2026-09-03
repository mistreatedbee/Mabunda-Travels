import { useEffect, useState } from 'react';
import Seo from '../components/Seo';
import Hero from '../components/Hero';
import TrustedBy from '../components/TrustedBy';
import DealsSection from '../components/DealsSection';
import LodgesSection from '../components/LodgesSection';
import MapsSection from '../components/MapsSection';
import Testimonials from '../components/Testimonials';
import FAQ from '../components/FAQ';
import CTASection from '../components/CTASection';
import { COMPANY } from '../lib/company';
import { HOMEPAGE_DEFAULTS } from '../lib/homepage';
import { getHomepageContent } from '../lib/queries';

const ORGANIZATION_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'TravelAgency',
  name: COMPANY.name,
  legalName: COMPANY.legalName,
  url: COMPANY.siteUrl,
  logo: `${COMPANY.siteUrl}/logo.jpeg`,
  telephone: COMPANY.phoneIntl,
  email: COMPANY.email,
  slogan: COMPANY.tagline,
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Acornhoek',
    addressRegion: 'Mpumalanga',
    postalCode: '1360',
    addressCountry: 'ZA',
  },
  areaServed: 'South Africa',
  founder: { '@type': 'Person', name: COMPANY.director },
};

export default function Home() {
  const [content, setContent] = useState(HOMEPAGE_DEFAULTS);

  useEffect(() => {
    let mounted = true;
    getHomepageContent().then((data) => { if (mounted) setContent(data); });
    return () => { mounted = false; };
  }, []);

  return (
    <>
      <Seo
        title="Mabunda Travel & Tours | Safari Transfers & Tours — Mpumalanga"
        description="Mabunda Travel & Tours — trusted safari transfers & tours in Mpumalanga. Expert-guided Kruger safaris, airport transfers, group tours & custom adventures."
        path="/"
        jsonLd={ORGANIZATION_JSONLD}
      />
      <Hero content={content.hero} />
      <TrustedBy labels={content.trusted_bar} />
      <DealsSection section={content.experiences} />
      <LodgesSection section={content.services} />
      <MapsSection showIntro hidePrivateReservesMap />
      <Testimonials section={content.testimonials} />
      <FAQ intro={content.faq} />
      <CTASection title={content.cta.title} text={content.cta.text} />
    </>
  );
}
