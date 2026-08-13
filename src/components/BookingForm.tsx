import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Send, AlertCircle, Loader2 } from 'lucide-react';

interface BookingFields {
  full_name: string;
  email: string;
  phone: string;
  travel_date: string;
  num_travellers: string;
  message: string;
  /** Structured service/package name, passed through from the linking page's query param — not user-editable. */
  service: string;
  /** Honeypot — real users never see or fill this field. */
  website: string;
}

const inputClass =
  'w-full px-4 py-3 rounded-xl border bg-gray-50 focus:ring-2 focus:ring-forest-600 focus:border-transparent focus:bg-white outline-none transition-all text-forest-900 placeholder-forest-300';

function fieldBorder(hasError: boolean) {
  return hasError ? 'border-red-300' : 'border-gray-200';
}

function initialValues(params: URLSearchParams): Partial<BookingFields> {
  const values: Partial<BookingFields> = {};
  const messageParts: string[] = [];

  const pkg = params.get('package');
  if (pkg) messageParts.push(`I'm interested in the "${pkg}" package.`);

  const service = params.get('service');
  if (service) messageParts.push(`I'm interested in your ${service} service.`);

  const structuredService = pkg || service;
  if (structuredService) values.service = structuredService;

  const date = params.get('date');
  if (date && /^\d{4}-\d{2}-\d{2}$/.test(date)) values.travel_date = date;

  const guests = params.get('guests');
  if (guests && /^\d{1,2}$/.test(guests)) values.num_travellers = guests;

  if (messageParts.length) values.message = messageParts.join(' ');
  return values;
}

export default function BookingForm() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<BookingFields>({
    defaultValues: {
      full_name: '',
      email: '',
      phone: '',
      travel_date: '',
      num_travellers: '',
      message: '',
      service: '',
      website: '',
      ...initialValues(searchParams),
    },
  });

  const today = new Date().toISOString().split('T')[0];

  const onSubmit = async (data: BookingFields) => {
    setServerError('');

    const payload = {
      full_name: data.full_name.trim(),
      email: data.email.trim(),
      phone: data.phone.trim(),
      travel_date: data.travel_date || null,
      num_travellers: data.num_travellers ? parseInt(data.num_travellers, 10) : null,
      message: data.message.trim() || null,
      service: data.service || null,
      website: data.website,
    };

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => null);
        setServerError(
          body?.error ||
            'Something went wrong submitting your enquiry. Please try again or contact us on WhatsApp.'
        );
        return;
      }

      navigate('/booking-success');
    } catch {
      setServerError('Network error submitting your enquiry. Please check your connection and try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      {/* Honeypot field — hidden from real users, catches bots */}
      <div className="absolute -left-[9999px]" aria-hidden="true">
        <label htmlFor="website">Leave this field empty</label>
        <input id="website" type="text" tabIndex={-1} autoComplete="off" {...register('website')} />
      </div>

      {/* Structured service/package name, pre-filled from the linking page's query param */}
      <input type="hidden" {...register('service')} />

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="bf-name" className="block text-sm font-medium text-forest-800 mb-2">
            Full Name <span className="text-red-500" aria-hidden="true">*</span>
          </label>
          <input
            id="bf-name"
            type="text"
            autoComplete="name"
            aria-invalid={!!errors.full_name}
            aria-describedby={errors.full_name ? 'bf-name-error' : undefined}
            className={`${inputClass} ${fieldBorder(!!errors.full_name)}`}
            placeholder="Your full name"
            {...register('full_name', {
              required: 'Please enter your full name.',
              minLength: { value: 2, message: 'Your name must be at least 2 characters.' },
              maxLength: { value: 120, message: 'Your name must be at most 120 characters.' },
            })}
          />
          {errors.full_name && (
            <p id="bf-name-error" role="alert" className="text-red-600 text-xs mt-1.5">{errors.full_name.message}</p>
          )}
        </div>
        <div>
          <label htmlFor="bf-email" className="block text-sm font-medium text-forest-800 mb-2">
            Email Address <span className="text-red-500" aria-hidden="true">*</span>
          </label>
          <input
            id="bf-email"
            type="email"
            autoComplete="email"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'bf-email-error' : undefined}
            className={`${inputClass} ${fieldBorder(!!errors.email)}`}
            placeholder="you@example.com"
            {...register('email', {
              required: 'Please enter your email address.',
              pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/, message: 'Please enter a valid email address.' },
              maxLength: { value: 254, message: 'Email address is too long.' },
            })}
          />
          {errors.email && (
            <p id="bf-email-error" role="alert" className="text-red-600 text-xs mt-1.5">{errors.email.message}</p>
          )}
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-5">
        <div>
          <label htmlFor="bf-phone" className="block text-sm font-medium text-forest-800 mb-2">
            Phone Number <span className="text-red-500" aria-hidden="true">*</span>
          </label>
          <input
            id="bf-phone"
            type="tel"
            autoComplete="tel"
            aria-invalid={!!errors.phone}
            aria-describedby={errors.phone ? 'bf-phone-error' : undefined}
            className={`${inputClass} ${fieldBorder(!!errors.phone)}`}
            placeholder="070 123 4567"
            {...register('phone', {
              required: 'Please enter your phone number.',
              pattern: { value: /^\+?[\d\s()-]{7,20}$/, message: 'Please enter a valid phone number.' },
            })}
          />
          {errors.phone && (
            <p id="bf-phone-error" role="alert" className="text-red-600 text-xs mt-1.5">{errors.phone.message}</p>
          )}
        </div>
        <div>
          <label htmlFor="bf-date" className="block text-sm font-medium text-forest-800 mb-2">Travel Date</label>
          <input
            id="bf-date"
            type="date"
            min={today}
            aria-invalid={!!errors.travel_date}
            aria-describedby={errors.travel_date ? 'bf-date-error' : undefined}
            className={`${inputClass} ${fieldBorder(!!errors.travel_date)}`}
            {...register('travel_date', {
              validate: (value) => !value || value >= today || 'Travel date cannot be in the past.',
            })}
          />
          {errors.travel_date && (
            <p id="bf-date-error" role="alert" className="text-red-600 text-xs mt-1.5">{errors.travel_date.message}</p>
          )}
        </div>
        <div>
          <label htmlFor="bf-travellers" className="block text-sm font-medium text-forest-800 mb-2">Travellers</label>
          <input
            id="bf-travellers"
            type="number"
            min="1"
            max="99"
            aria-invalid={!!errors.num_travellers}
            aria-describedby={errors.num_travellers ? 'bf-travellers-error' : undefined}
            className={`${inputClass} ${fieldBorder(!!errors.num_travellers)}`}
            placeholder="e.g. 2"
            {...register('num_travellers', {
              validate: (value) => {
                if (!value) return true;
                const n = parseInt(value, 10);
                return (n >= 1 && n <= 99) || 'Please enter between 1 and 99 travellers.';
              },
            })}
          />
          {errors.num_travellers && (
            <p id="bf-travellers-error" role="alert" className="text-red-600 text-xs mt-1.5">{errors.num_travellers.message}</p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="bf-message" className="block text-sm font-medium text-forest-800 mb-2">Message</label>
        <textarea
          id="bf-message"
          rows={4}
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? 'bf-message-error' : undefined}
          className={`${inputClass} ${fieldBorder(!!errors.message)} resize-none`}
          placeholder="Tell us about your ideal trip — interests, budget, special requests..."
          {...register('message', {
            maxLength: { value: 2000, message: 'Message must be at most 2000 characters.' },
          })}
        />
        {errors.message && (
          <p id="bf-message-error" role="alert" className="text-red-600 text-xs mt-1.5">{errors.message.message}</p>
        )}
      </div>

      {serverError && (
        <div role="alert" className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl p-4">
          <AlertCircle size={20} className="text-red-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
          <p className="text-red-700 text-sm">{serverError}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full flex items-center justify-center gap-2 bg-gold hover:bg-gold-dark disabled:opacity-60 disabled:cursor-not-allowed text-forest-900 font-semibold py-4 rounded-xl text-base transition-all hover:shadow-lg"
      >
        {isSubmitting ? (
          <>
            <Loader2 size={18} className="animate-spin" aria-hidden="true" />
            Submitting...
          </>
        ) : (
          <>
            <Send size={18} aria-hidden="true" />
            Request a Quote
          </>
        )}
      </button>
      <p className="text-xs text-forest-600/60 text-center leading-relaxed">
        By submitting this form you agree to our{' '}
        <a href="/privacy-policy" className="underline hover:text-gold-dark">Privacy Policy</a>. We only use
        your details to respond to your enquiry.
      </p>
    </form>
  );
}
