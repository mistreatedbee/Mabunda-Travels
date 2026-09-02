export const COMPANY = {
  name:        'Mabunda Travel & Tours',
  legalName:   'Mabunda Travel & Tours (Pty) Ltd',
  regNumber:   '2025/419039/07',
  tagline:     'Journey. Explore. Experience.',
  phone:       '070 589 3439',
  phoneIntl:   '+27705893439',
  email:       'bookings@mabundatravel.co.za',
  address:     'Acornhoek, Mpumalanga, 1360, South Africa',
  director:    'Marvin Mabunda',
  founded:     'May 2025',
  siteUrl:     'https://mabundatravel.co.za',
  whatsappUrl: 'https://wa.me/27705893439?text=Hello%20Mabunda%20Travel%20%26%20Tours%2C%20I%27d%20like%20to%20enquire%20about%20a%20trip.',
  hours: [
    { days: 'Mon – Fri', time: '08:00 – 17:00' },
    { days: 'Sat & Sun', time: '08:00 – 13:00' },
  ],
};

/** Builds a WhatsApp deep link with a custom pre-filled message. */
export function whatsappLink(message: string): string {
  return `https://wa.me/27705893439?text=${encodeURIComponent(message)}`;
}
