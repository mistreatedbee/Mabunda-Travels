import Seo from '../components/Seo';
import PageHeader from '../components/PageHeader';
import CTASection from '../components/CTASection';
import MapsSection from '../components/MapsSection';
import { COMPANY } from '../lib/company';

const MAPS_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Safari Maps — Kruger & Private Reserves | Mabunda Travel & Tours',
  url: `${COMPANY.siteUrl}/maps`,
  description: 'Maps of Kruger National Park and the surrounding private game reserves in Mpumalanga and Limpopo.',
};

export default function Maps() {
  return (
    <>
      <Seo
        title="Safari Maps — Kruger & Private Reserves | Mabunda Travel & Tours"
        description="Maps of Kruger National Park and the surrounding private game reserves. Plan your safari with Mabunda Travel & Tours — Mpumalanga's local transfer experts."
        path="/maps"
        jsonLd={MAPS_JSONLD}
      />
      <PageHeader
        eyebrow="Safari Maps"
        title="Kruger &amp; the private reserves"
        subtitle="Everything you need to know about Africa's most iconic wildlife destination — and the exclusive private reserves that surround it."
        image="https://images.pexels.com/photos/30878973/pexels-photo-30878973.jpeg?auto=compress&cs=tinysrgb&w=1600"
      />
      <MapsSection />
      <CTASection />
    </>
  );
}
