import { Target, Eye, Heart, Shield, MapPin, Users, Sparkles } from 'lucide-react';
import Seo from '../components/Seo';
import PageHeader from '../components/PageHeader';
import CTASection from '../components/CTASection';
import Reveal from '../components/Reveal';
import { COMPANY } from '../lib/company';

const PILLARS = [
  { icon: Target, title: 'Our Mission', text: 'To provide reliable, memorable, and personalised travel experiences that connect people with the beauty of South Africa.' },
  { icon: Eye,    title: 'Our Vision',  text: 'To become the trusted travel partner of choice, connecting people with extraordinary destinations across the region and beyond.' },
  { icon: Heart,  title: 'Our Values',  text: 'Customer satisfaction, trust, adventure, professionalism and authenticity guide every trip we plan.' },
];

const WHY_US = [
  { icon: MapPin,   title: 'Born in the Lowveld',      text: 'We are based in Acornhoek, on the doorstep of the Kruger. The destinations we sell are the places we grew up exploring.' },
  { icon: Shield,   title: 'Registered & accountable', text: `A registered South African private company (Reg: ${COMPANY.regNumber}) — you always know exactly who you are dealing with.` },
  { icon: Users,    title: 'Personal, not automated',  text: 'Every enquiry is answered by a person who plans your trip end-to-end and stays reachable while you travel.' },
  { icon: Sparkles, title: 'Tailored to you',          text: 'No off-the-shelf itineraries. Your interests, your budget and your pace shape every package we quote.' },
];

export default function About() {
  return (
    <>
      <Seo
        title="About Us | Mabunda Travel & Tours"
        description="Mabunda Travel & Tours (Pty) Ltd is a registered travel agency in Acornhoek, Mpumalanga, founded by Marvin Mabunda. Learn about our mission, vision and values."
        path="/about"
      />
      <PageHeader
        eyebrow="About Us"
        title="Rooted in Mpumalanga, made for travellers"
        subtitle="We connect travellers with beautiful destinations, cultural experiences and personalised adventures across South Africa."
      />

      {/* Story */}
      <section className="py-20 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 grid lg:grid-cols-2 gap-12 items-center">
          <Reveal>
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/13142739/pexels-photo-13142739.jpeg?auto=compress&cs=tinysrgb&w=900"
                alt="Elephants in the South African bush"
                loading="lazy"
                decoding="async"
                className="rounded-3xl shadow-xl w-full object-cover aspect-[4/3]"
              />
              <div className="absolute -bottom-6 -right-4 sm:-right-6 bg-forest-900 text-white rounded-2xl px-6 py-4 shadow-xl">
                <div className="font-display text-2xl font-bold text-gold">{COMPANY.founded}</div>
                <div className="text-xs text-white/70 uppercase tracking-wide">Founded in Acornhoek</div>
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <span className="text-gold font-semibold text-sm tracking-[0.2em] uppercase">Our Story</span>
            <h2 className="font-display text-3xl sm:text-4xl text-forest-900 font-bold mt-2 mb-5 leading-tight">
              A travel company built on local knowledge
            </h2>
            <p className="text-forest-600/80 leading-relaxed mb-4">
              Mabunda Travel &amp; Tours was founded by {COMPANY.director} in {COMPANY.founded} with
              a simple belief: nobody can show you Mpumalanga like the people who live here.
              From the elephants of the Kruger to the mists of the Panorama Route, our home
              is one of the most extraordinary corners of the planet — and we love sharing it.
            </p>
            <p className="text-forest-600/80 leading-relaxed mb-4">
              As a registered private company based in Acornhoek, we serve holiday travellers,
              families, schools, churches, stokvels and corporate clients. Whether you need a
              weekend escape or a fully coordinated group tour, we handle the details — transport,
              accommodation, activities and everything in between.
            </p>
            <p className="text-forest-600/80 leading-relaxed">
              Every itinerary is built by hand, every quote is honest, and every traveller gets
              a direct line to us before, during and after the trip. That is what we mean by
              <em> Journey. Explore. Experience.</em>
            </p>
          </Reveal>
        </div>
      </section>

      {/* Mission / Vision / Values */}
      <section className="py-20 sm:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <Reveal>
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="text-gold font-semibold text-sm tracking-[0.2em] uppercase">What Drives Us</span>
              <h2 className="font-display text-3xl sm:text-4xl text-forest-900 font-bold mt-2 leading-tight">
                Mission, vision &amp; values
              </h2>
            </div>
          </Reveal>
          <div className="grid sm:grid-cols-3 gap-6">
            {PILLARS.map((p, i) => (
              <Reveal key={p.title} delay={i * 0.08}>
                <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm h-full">
                  <div className="w-12 h-12 rounded-xl bg-forest-100 flex items-center justify-center mb-5">
                    <p.icon className="text-forest-700" size={22} aria-hidden="true" />
                  </div>
                  <h3 className="font-display text-xl font-semibold text-forest-900 mb-3">{p.title}</h3>
                  <p className="text-sm text-forest-600/70 leading-relaxed">{p.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Why choose us */}
      <section className="py-20 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <Reveal>
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="text-gold font-semibold text-sm tracking-[0.2em] uppercase">Why Travel With Us</span>
              <h2 className="font-display text-3xl sm:text-4xl text-forest-900 font-bold mt-2 leading-tight">
                The Mabunda difference
              </h2>
            </div>
          </Reveal>
          <div className="grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {WHY_US.map((item, i) => (
              <Reveal key={item.title} delay={(i % 2) * 0.08}>
                <div className="flex items-start gap-4 bg-gray-50 rounded-2xl p-6 border border-gray-100 h-full">
                  <div className="w-11 h-11 rounded-xl bg-forest-100 flex items-center justify-center flex-shrink-0">
                    <item.icon className="text-forest-700" size={20} aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-forest-900 mb-1.5">{item.title}</h3>
                    <p className="text-sm text-forest-600/70 leading-relaxed">{item.text}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Company details */}
          <Reveal>
            <div className="mt-16 max-w-3xl mx-auto bg-forest-900 rounded-3xl p-8 sm:p-10 text-white">
              <h2 className="font-display text-2xl font-bold mb-6 text-gold">Company Details</h2>
              <dl className="grid sm:grid-cols-2 gap-x-8 gap-y-4 text-sm">
                <div>
                  <dt className="text-white/50 uppercase tracking-wide text-xs mb-1">Legal Name</dt>
                  <dd className="font-medium">{COMPANY.legalName}</dd>
                </div>
                <div>
                  <dt className="text-white/50 uppercase tracking-wide text-xs mb-1">Registration Number</dt>
                  <dd className="font-medium">{COMPANY.regNumber}</dd>
                </div>
                <div>
                  <dt className="text-white/50 uppercase tracking-wide text-xs mb-1">Director</dt>
                  <dd className="font-medium">{COMPANY.director}</dd>
                </div>
                <div>
                  <dt className="text-white/50 uppercase tracking-wide text-xs mb-1">Founded</dt>
                  <dd className="font-medium">{COMPANY.founded}</dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-white/50 uppercase tracking-wide text-xs mb-1">Registered Address</dt>
                  <dd className="font-medium">{COMPANY.address}</dd>
                </div>
              </dl>
            </div>
          </Reveal>
        </div>
      </section>

      <CTASection
        title="Come see our home through our eyes"
        text="Tell us what kind of traveller you are and we will show you the Mpumalanga that guidebooks miss."
      />
    </>
  );
}
