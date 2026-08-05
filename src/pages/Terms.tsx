import { Link } from 'react-router-dom';
import Seo from '../components/Seo';
import PageHeader from '../components/PageHeader';
import { COMPANY } from '../lib/company';

const sectionClass = 'mb-10';
const headingClass = 'font-display text-xl sm:text-2xl font-semibold text-forest-900 mb-3';
const textClass = 'text-forest-600/80 text-sm sm:text-base leading-relaxed mb-3';
const listClass = 'list-disc pl-6 space-y-2 text-forest-600/80 text-sm sm:text-base leading-relaxed mb-3';

export default function Terms() {
  return (
    <>
      <Seo
        title="Terms & Conditions | Mabunda Travel & Tours"
        description="Booking terms and conditions for travel packages, tours and services provided by Mabunda Travel & Tours (Pty) Ltd."
        path="/terms"
      />
      <PageHeader
        eyebrow="Legal"
        title="Terms & Conditions"
        subtitle="The terms that apply when you enquire about or book travel services with us."
      />

      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-3xl mx-auto px-5 sm:px-8">
          <p className="text-forest-600/60 text-sm mb-10">Last updated: 17 July 2026</p>

          <div className={sectionClass}>
            <h2 className={headingClass}>1. About these terms</h2>
            <p className={textClass}>
              These terms and conditions govern the use of this website and the travel services
              provided by {COMPANY.legalName} (registration number {COMPANY.regNumber}), referred
              to below as "we", "us" or "{COMPANY.name}". By submitting an enquiry or confirming a
              booking, you accept these terms.
            </p>
          </div>

          <div className={sectionClass}>
            <h2 className={headingClass}>2. Quotes and bookings</h2>
            <ul className={listClass}>
              <li>All enquiries are obligation-free. A quote only becomes a booking once you confirm it in writing and pay the deposit specified in the quote.</li>
              <li>Quotes are valid for the period stated on the quote and are subject to availability at the time of confirmation.</li>
              <li>Prices depend on group size, season and supplier rates, and may change until your booking is confirmed.</li>
              <li>Full payment terms, including the deposit amount and final payment date, are set out in each quote.</li>
            </ul>
          </div>

          <div className={sectionClass}>
            <h2 className={headingClass}>3. Changes and cancellations</h2>
            <ul className={listClass}>
              <li>Requests to change confirmed bookings will be accommodated where possible; suppliers may charge amendment fees which will be passed on at cost.</li>
              <li>Cancellation terms, including any non-refundable amounts, are set out in each quote and depend on the terms of the underlying suppliers (lodges, parks, transport providers).</li>
              <li>We strongly recommend travel insurance covering cancellation, medical costs and personal belongings.</li>
            </ul>
          </div>

          <div className={sectionClass}>
            <h2 className={headingClass}>4. Third-party suppliers</h2>
            <p className={textClass}>
              We act as an agent arranging services provided by third parties such as lodges,
              national parks, transport operators and activity providers. Those services are
              subject to the suppliers' own terms and conditions, which we will share with you on
              request. While we choose our suppliers carefully, we are not liable for acts or
              omissions of third parties beyond our reasonable control.
            </p>
          </div>

          <div className={sectionClass}>
            <h2 className={headingClass}>5. Travel documents and health</h2>
            <ul className={listClass}>
              <li>You are responsible for ensuring that all travellers have valid identification or passports, visas where applicable, and any required vaccinations.</li>
              <li>Children travelling in or through South Africa may require unabridged birth certificates; please confirm requirements with us when booking.</li>
              <li>Please tell us about any medical conditions, dietary requirements or mobility needs when booking so we can plan appropriately.</li>
            </ul>
          </div>

          <div className={sectionClass}>
            <h2 className={headingClass}>6. Liability</h2>
            <p className={textClass}>
              Nothing in these terms excludes liability that cannot be excluded under South African
              law, including the Consumer Protection Act, 2008. Beyond that, our liability for any
              claim arising from a booking is limited to the amount you paid us for the affected
              service. Wildlife viewing and outdoor activities carry inherent risks; you
              participate at your own risk and must follow guides' instructions at all times.
            </p>
          </div>

          <div className={sectionClass}>
            <h2 className={headingClass}>7. Website content</h2>
            <p className={textClass}>
              We work to keep the information on this website accurate and up to date, but
              itineraries, availability and details of destinations may change. Photographs are
              illustrative of destinations and experiences.
            </p>
          </div>

          <div className={sectionClass}>
            <h2 className={headingClass}>8. Governing law</h2>
            <p className={textClass}>
              These terms are governed by the laws of the Republic of South Africa, and any
              disputes are subject to the jurisdiction of the South African courts.
            </p>
          </div>

          <div className={sectionClass}>
            <h2 className={headingClass}>9. Contact</h2>
            <p className={textClass}>
              Questions about these terms can be sent to{' '}
              <a href={`mailto:${COMPANY.email}`} className="text-gold-dark underline">{COMPANY.email}</a> or{' '}
              <a href={`tel:${COMPANY.phoneIntl}`} className="text-gold-dark underline">{COMPANY.phone}</a>.
            </p>
          </div>

          <p className="text-sm text-forest-600/70">
            See also our <Link to="/privacy-policy" className="text-gold-dark underline">Privacy Policy</Link>.
          </p>
        </div>
      </section>
    </>
  );
}
