import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import { AuthProvider } from './admin/AuthContext';
import { ToastProvider } from './admin/components/Toast';
import ProtectedRoute from './admin/ProtectedRoute';

const About = lazy(() => import('./pages/About'));
const Services = lazy(() => import('./pages/Services'));
const Maps = lazy(() => import('./pages/Maps'));
const Gallery = lazy(() => import('./pages/Gallery'));
const Contact = lazy(() => import('./pages/Contact'));
const BookingSuccess = lazy(() => import('./pages/BookingSuccess'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const Terms = lazy(() => import('./pages/Terms'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Admin dashboard — its own lazy chunk, entirely separate from the public bundle.
const AdminLayout = lazy(() => import('./admin/AdminLayout'));
const Login = lazy(() => import('./admin/pages/Login'));
const ForgotPassword = lazy(() => import('./admin/pages/ForgotPassword'));
const ResetPassword = lazy(() => import('./admin/pages/ResetPassword'));
const Dashboard = lazy(() => import('./admin/pages/Dashboard'));
const EnquiriesList = lazy(() => import('./admin/pages/enquiries/EnquiriesList'));
const EnquiryDetail = lazy(() => import('./admin/pages/enquiries/EnquiryDetail'));
const Settings = lazy(() => import('./admin/pages/Settings'));
const SeoManager = lazy(() => import('./admin/pages/seo/SeoManager'));
const ToursList = lazy(() => import('./admin/pages/tours/ToursList'));
const TourForm = lazy(() => import('./admin/pages/tours/TourForm'));
const TransfersList = lazy(() => import('./admin/pages/transfers/TransfersList'));
const TransferForm = lazy(() => import('./admin/pages/transfers/TransferForm'));
const DestinationsList = lazy(() => import('./admin/pages/destinations/DestinationsList'));
const DestinationForm = lazy(() => import('./admin/pages/destinations/DestinationForm'));
const FaqsList = lazy(() => import('./admin/pages/faqs/FaqsList'));
const FaqForm = lazy(() => import('./admin/pages/faqs/FaqForm'));
const TestimonialsList = lazy(() => import('./admin/pages/testimonials/TestimonialsList'));
const TestimonialForm = lazy(() => import('./admin/pages/testimonials/TestimonialForm'));
const Admins = lazy(() => import('./admin/pages/Admins'));

function PageLoader() {
  return (
    <div className="min-h-screen bg-forest-900 flex items-center justify-center" role="status" aria-label="Loading page">
      <div className="flex flex-col items-center gap-4">
        <img src="/logo.jpeg" alt="" className="w-16 h-16 rounded-full object-cover animate-pulse" />
        <span className="text-gold text-xs tracking-[0.3em] uppercase font-medium">Loading</span>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="services" element={<Services />} />
            <Route path="maps" element={<Maps />} />
            <Route path="gallery" element={<Gallery />} />
            <Route path="contact" element={<Contact />} />
            <Route path="booking-success" element={<BookingSuccess />} />
            <Route path="privacy-policy" element={<PrivacyPolicy />} />
            <Route path="terms" element={<Terms />} />
            {/* Legacy redirect — packages page replaced by maps */}
            <Route path="packages" element={<Navigate to="/maps" replace />} />
            <Route path="*" element={<NotFound />} />
          </Route>

          {/* Admin dashboard — no public Navbar/Footer, own auth-gated shell. */}
          <Route
            path="admin/*"
            element={
              <AuthProvider>
                <ToastProvider>
                  <Routes>
                    <Route path="login" element={<Login />} />
                    <Route path="forgot-password" element={<ForgotPassword />} />
                    <Route path="reset-password" element={<ResetPassword />} />
                    <Route
                      element={
                        <ProtectedRoute>
                          <AdminLayout />
                        </ProtectedRoute>
                      }
                    >
                      <Route index element={<Dashboard />} />
                      <Route path="homepage" element={
                          <ProtectedRoute allowedRoles={['super_admin', 'admin']}>
                            <SeoManager />
                          </ProtectedRoute>
                        }
                      />
                      <Route path="seo" element={<Navigate to="/admin/homepage" replace />} />
                      <Route path="enquiries" element={<EnquiriesList />} />
                      <Route path="enquiries/:id" element={<EnquiryDetail />} />
                      <Route
                        path="settings"
                        element={
                          <ProtectedRoute allowedRoles={['super_admin', 'admin']}>
                            <Settings />
                          </ProtectedRoute>
                        }
                      />
                      <Route path="media" element={<Navigate to="/admin" replace />} />
                      <Route path="tours" element={<ToursList />} />
                      <Route path="tours/new" element={<TourForm />} />
                      <Route path="tours/:id/edit" element={<TourForm />} />
                      <Route path="transfers" element={<TransfersList />} />
                      <Route path="transfers/new" element={<TransferForm />} />
                      <Route path="transfers/:id/edit" element={<TransferForm />} />
                      <Route path="destinations" element={<DestinationsList />} />
                      <Route path="destinations/new" element={<DestinationForm />} />
                      <Route path="destinations/:id/edit" element={<DestinationForm />} />
                      <Route path="faqs" element={<FaqsList />} />
                      <Route path="faqs/new" element={<FaqForm />} />
                      <Route path="faqs/:id/edit" element={<FaqForm />} />
                      <Route path="testimonials" element={<TestimonialsList />} />
                      <Route path="testimonials/new" element={<TestimonialForm />} />
                      <Route path="testimonials/:id/edit" element={<TestimonialForm />} />
                      <Route
                        path="admins"
                        element={
                          <ProtectedRoute allowedRoles={['super_admin']}>
                            <Admins />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="audit-log"
                        element={<Navigate to="/admin" replace />}
                      />
                      <Route path="*" element={<Navigate to="/admin" replace />} />
                    </Route>
                  </Routes>
                </ToastProvider>
              </AuthProvider>
            }
          />
        </Routes>
      </Suspense>
    </>
  );
}
