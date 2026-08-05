import { Link } from 'react-router-dom';
import Seo from '../components/Seo';
import PageHeader from '../components/PageHeader';
import { COMPANY } from '../lib/company';

const sectionClass = 'mb-10';
const headingClass = 'font-display text-xl sm:text-2xl font-semibold text-forest-900 mb-3';
const textClass = 'text-forest-600/80 text-sm sm:text-base leading-relaxed mb-3';
const listClass = 'list-disc pl-6 space-y-2 text-forest-600/80 text-sm sm:text-base leading-relaxed mb-3';

export default function PrivacyPolicy() {
  return (
    <>
      <Seo
        title="Privacy Policy | Mabunda Travel & Tours"
        description="How Mabunda Travel & Tours (Pty) Ltd collects, uses and protects your personal information in accordance with South Africa's POPIA."
        path="/privacy-policy"
      />
      <PageHeader
        eyebrow="Legal"
        title="Privacy Policy"
        subtitle="How we collect, use and protect your personal information."
      />

      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-3xl mx-auto px-5 sm:px-8">
          <p className="text-forest-600/60 text-sm mb-10">Last updated: 17 July 2026</p>

          <div className={sectionClass}>
            <h2 className={headingClass}>1. Who we are</h2>
            <p className={textClass}>
              {COMPANY.legalName} (registration number {COMPANY.regNumber}) is a travel agency
              registered in South Africa, with its registered address at {COMPANY.address}. We are
              the "responsible party" for the personal information processed through this website,
              as defined in the Protection of Personal Information Act, 2013 (POPIA).
            </p>
            <p className={textClass}>
              Questions about this policy or your personal information can be sent to{' '}
              <a href={`mailto:${COMPANY.email}`} className="text-gold-dark underline">{COMPANY.email}</a> or{' '}
              <a href={`tel:${COMPANY.phoneIntl}`} className="text-gold-dark underline">{COMPANY.phone}</a>.
            </p>
          </div>

          <div className={sectionClass}>
            <h2 className={headingClass}>2. What information we collect</h2>
            <p className={textClass}>When you submit an enquiry or booking request, we collect:</p>
            <ul className={listClass}>
              <li>Your full name</li>
              <li>Your email address and phone number</li>
              <li>Your intended travel date, destination and number of travellers</li>
              <li>Any details you choose to include in your message</li>
            </ul>
            <p className={textClass}>
              We do not collect payment card details through this website, and we do not use
              tracking cookies for advertising.
            </p>
          </div>

          <div className={sectionClass}>
            <h2 className={headingClass}>3. Why we collect it</h2>
            <p className={textClass}>We use your information solely to:</p>
            <ul className={listClass}>
              <li>Respond to your enquiry and prepare a personalised quote</li>
              <li>Arrange and manage bookings you confirm with us</li>
              <li>Communicate with you about your trip</li>
              <li>Meet our legal and accounting obligations</li>
            </ul>
            <p className={textClass}>
              We do not sell your personal information, and we do not add you to marketing lists
              without your consent.
            </p>
          </div>

          <div className={sectionClass}>
            <h2 className={headingClass}>4. Where your information is stored</h2>
            <p className={textClass}>
              Enquiry details are stored securely with our database provider, Supabase, and are
              accessible only to authorised staff of {COMPANY.name}. We share your details with
              third parties (such as lodges or transport providers) only to the extent necessary
              to arrange the services you request.
            </p>
          </div>

          <div className={sectionClass}>
            <h2 className={headingClass}>5. How long we keep it</h2>
            <p className={textClass}>
              We keep enquiry information for as long as needed to assist you, and booking
              records for as long as required by South African tax and company law. You may ask
              us to delete your enquiry information at any time.
            </p>
          </div>

          <div className={sectionClass}>
            <h2 className={headingClass}>6. Your rights</h2>
            <p className={textClass}>Under POPIA you have the right to:</p>
            <ul className={listClass}>
              <li>Ask what personal information we hold about you</li>
              <li>Request correction of inaccurate information</li>
              <li>Request deletion of your information, subject to legal retention requirements</li>
              <li>Object to processing of your information</li>
              <li>Lodge a complaint with the Information Regulator of South Africa</li>
            </ul>
            <p className={textClass}>
              To exercise any of these rights, contact us at{' '}
              <a href={`mailto:${COMPANY.email}`} className="text-gold-dark underline">{COMPANY.email}</a>.
            </p>
          </div>

          <div className={sectionClass}>
            <h2 className={headingClass}>7. Changes to this policy</h2>
            <p className={textClass}>
              We may update this policy from time to time. The latest version will always be
              published on this page with its "last updated" date.
            </p>
          </div>

          <p className="text-sm text-forest-600/70">
            See also our <Link to="/terms" className="text-gold-dark underline">Terms &amp; Conditions</Link>.
          </p>
        </div>
      </section>
    </>
  );
}
