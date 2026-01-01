// app/contact/page.jsx
'use client';

import { useState, useCallback } from 'react';
import Head from 'next/head';
import { createClient } from '@/utils/supabase/client';

// Import all icons directly (better performance than lazy loading for contact page)
import { Mail, Phone, MapPin, Clock, Shield, CheckCircle, AlertCircle, Send } from 'lucide-react';

// Static data outside component to prevent re-renders
const GRADE_OPTIONS = [
  { value: '', label: 'Select your current level' },
  { value: 'school_10th', label: 'Class 10th (Secondary)' },
  { value: 'school_12th', label: 'Class 12th (Higher Secondary)' },
  { value: 'undergraduate', label: 'Undergraduate (College)' },
  { value: 'graduate', label: 'Graduate (Degree Holder)' },
  { value: 'post_graduate', label: 'Post Graduate' },
  { value: 'working_professional', label: 'Working Professional' },
  { value: 'other', label: 'Other' }
];

const EXAM_OPTIONS = [
  { value: '', label: 'Select your target exam' },
  { value: 'upsc', label: 'UPSC Civil Services' },
  { value: 'ssc_cgl', label: 'SSC CGL' },
  { value: 'ssc_chsl', label: 'SSC CHSL' },
  { value: 'banking_ibps', label: 'Banking (IBPS)' },
  { value: 'sbi_po', label: 'SBI PO' },
  { value: 'railways', label: 'Railway Recruitment' },
  { value: 'nda', label: 'NDA' },
  { value: 'cds', label: 'CDS' },
  { value: 'jeeneet', label: 'JEE/NEET' },
  { value: 'gate', label: 'GATE' },
  { value: 'cat', label: 'CAT/MBA' },
  { value: 'state_psc', label: 'State PSC' },
  { value: 'teaching', label: 'Teaching Exams' },
  { value: 'other', label: 'Other Exam' }
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    grade: '',
    exam: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [errors, setErrors] = useState({});

  // Memoized validation function
  const validateForm = useCallback(() => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.grade) {
      newErrors.grade = 'Please select your current level';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Please enter your message';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  // Optimized submit handler
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const supabase = createClient();
      
      const { data, error } = await supabase
        .from('contact_submissions')
        .insert([
          {
            name: formData.name.trim(),
            email: formData.email.trim(),
            grade: formData.grade,
            exam: formData.exam || null,
            message: formData.message.trim(),
            status: 'pending',
            submitted_at: new Date().toISOString()
          }
        ])
        .select()
        .single();

      if (error) {
        if (error.code === '42501') {
          throw new Error('Database permissions issue. Please contact administrator.');
        }
        throw error;
      }

      setSubmitStatus({
        type: 'success',
        message: 'Thank you! Your message has been sent successfully. We\'ll respond within 24-48 hours.'
      });

      // Reset form
      setFormData({
        name: '',
        email: '',
        grade: '',
        exam: '',
        message: ''
      });
      setErrors({});

    } catch (error) {
      console.error('Error submitting form:', error);
      
      let errorMessage = 'Something went wrong. Please try again or contact us directly at mail@preptive.in';
      
      if (error.message.includes('permissions') || error.code === '42501') {
        errorMessage = 'Database configuration issue. Please contact support.';
      } else if (error.message.includes('network')) {
        errorMessage = 'Network error. Please check your connection.';
      }
      
      setSubmitStatus({
        type: 'error',
        message: errorMessage
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, validateForm]);

  // Memoized input change handler
  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  }, [errors]);

  return (
    <>
      {/* SEO Head Section */}
      <Head>
        <title>Contact PrepTive | Exam Updates & Support | 24/7 Assistance</title>
        <meta name="description" content="Contact PrepTive for exam updates, corrections, feedback, or support. Report updates for UPSC, SSC, Banking, Railways, JEE, NEET & more. Quick response guaranteed." />
        <meta property="og:title" content="Contact PrepTive | Exam Updates & Support" />
        <meta property="og:url" content="https://preptive.in/contact" />
        <meta property="og:type" content="website" />
        <meta name="twitter:title" content="Contact PrepTive | Exam Updates & Support" />
        <meta name="twitter:description" content="Contact us for exam updates, corrections, or support. Quick response for all competitive exam queries." />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://preptive.in/contact" />
      </Head>

      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ContactPage",
            "name": "Contact PrepTive",
            "description": "Contact page for PrepTive educational platform - submit exam updates, corrections, feedback, or get support",
            "url": "https://preptive.in/contact",
            "mainEntity": {
              "@type": "Organization",
              "name": "PrepTive",
              "description": "Educational platform providing latest updates on competitive exams across India",
              "url": "https://preptive.in",
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+91-8381873457",
                "contactType": "customer service",
                "email": "mail@preptive.in",
                "areaServed": "IN",
                "availableLanguage": ["English", "Hindi"],
                "hoursAvailable": {
                  "@type": "OpeningHoursSpecification",
                  "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
                  "opens": "09:00",
                  "closes": "18:00"
                }
              },
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Prayagraj",
                "addressRegion": "Uttar Pradesh",
                "postalCode": "212503",
                "addressCountry": "IN"
              }
            }
          })
        }}
      />

      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Contact PrepTive
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto px-4">
              Report exam updates, submit corrections, provide feedback, or get support for our informational content.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            {/* Contact Form */}
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 md:p-8">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center gap-2">
                <Send className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                Send us a Message
              </h2>

              {submitStatus && (
                <div className={`mb-4 sm:mb-6 p-3 sm:p-4 rounded-lg ${submitStatus.type === 'success' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                  <div className="flex items-start">
                    {submitStatus.type === 'success' ? (
                      <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 mr-3 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 mr-3 mt-0.5" />
                    )}
                    <p className={`text-xs sm:text-sm ${submitStatus.type === 'success' ? 'text-green-800' : 'text-red-800'}`}>
                      {submitStatus.message}
                    </p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                {/* Full Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    className={`w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      errors.name ? 'border-red-300' : 'border-gray-300'
                    }`}
                    aria-required="true"
                  />
                  {errors.name && (
                    <p className="mt-1 text-xs sm:text-sm text-red-600">{errors.name}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="your.email@example.com"
                    className={`w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      errors.email ? 'border-red-300' : 'border-gray-300'
                    }`}
                    aria-required="true"
                  />
                  {errors.email && (
                    <p className="mt-1 text-xs sm:text-sm text-red-600">{errors.email}</p>
                  )}
                </div>

                {/* Current Grade/Level */}
                <div>
                  <label htmlFor="grade" className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    Current Grade / Level *
                  </label>
                  <select
                    id="grade"
                    name="grade"
                    value={formData.grade}
                    onChange={handleInputChange}
                    className={`w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      errors.grade ? 'border-red-300' : 'border-gray-300'
                    }`}
                    aria-required="true"
                  >
                    {GRADE_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  {errors.grade && (
                    <p className="mt-1 text-xs sm:text-sm text-red-600">{errors.grade}</p>
                  )}
                </div>

                {/* Target Exam */}
                <div>
                  <label htmlFor="exam" className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    Target Exam (Optional)
                  </label>
                  <select
                    id="exam"
                    name="exam"
                    value={formData.exam}
                    onChange={handleInputChange}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  >
                    {EXAM_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    Your Message / Query *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={4}
                    placeholder="Please describe your query or feedback in detail..."
                    className={`w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      errors.message ? 'border-red-300' : 'border-gray-300'
                    }`}
                    aria-required="true"
                  />
                  {errors.message && (
                    <p className="mt-1 text-xs sm:text-sm text-red-600">{errors.message}</p>
                  )}
                </div>

                {/* Submit Button */}
                <div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full flex items-center justify-center gap-2 px-4 sm:px-6 py-3 sm:py-4 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200 ${
                      isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                    aria-label={isSubmitting ? 'Sending your message' : 'Send message'}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span className="text-sm sm:text-base">Sending...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span className="text-sm sm:text-base">Send Message</span>
                      </>
                    )}
                  </button>
                  <p className="mt-2 text-xs text-gray-500 text-center">
                    By submitting this form, you agree to our Privacy Policy. We'll respond within 24-48 hours.
                  </p>
                </div>
              </form>
            </div>

            {/* Contact Information & Details */}
            <div className="space-y-4 sm:space-y-6 lg:space-y-8">
              {/* Contact Information Card */}
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 md:p-8">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center gap-2">
                  <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                  Contact Information
                </h2>
                
                <div className="space-y-4 sm:space-y-6">
                  {/* Email Addresses */}
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2 sm:mb-3">Email Addresses</h3>
                    <div className="space-y-2 sm:space-y-3">
                      <div className="flex items-start">
                        <div className="bg-blue-50 p-1.5 sm:p-2 rounded-lg mr-2 sm:mr-3">
                          <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-700 text-sm sm:text-base">General Inquiries & Updates</p>
                          <a href="mailto:mail@preptive.in" className="text-blue-600 hover:text-blue-800 hover:underline text-sm sm:text-base break-all">
                            mail@preptive.in
                          </a>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="bg-green-50 p-1.5 sm:p-2 rounded-lg mr-2 sm:mr-3">
                          <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-700 text-sm sm:text-base">Content Corrections</p>
                          <a href="mailto:corrections@preptive.in" className="text-blue-600 hover:text-blue-800 hover:underline text-sm sm:text-base break-all">
                            corrections@preptive.in
                          </a>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="bg-purple-50 p-1.5 sm:p-2 rounded-lg mr-2 sm:mr-3">
                          <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-700 text-sm sm:text-base">Technical Support</p>
                          <a href="mailto:help@preptive.in" className="text-blue-600 hover:text-blue-800 hover:underline text-sm sm:text-base break-all">
                            help@preptive.in
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Phone & WhatsApp */}
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2 sm:mb-3">Phone & WhatsApp</h3>
                    <div className="flex items-start">
                      <div className="bg-green-50 p-1.5 sm:p-2 rounded-lg mr-2 sm:mr-3">
                        <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-700 text-sm sm:text-base">Call or WhatsApp</p>
                        <a href="tel:+918381873457" className="text-blue-600 hover:text-blue-800 hover:underline text-sm sm:text-base">
                          +91 8381873457
                        </a>
                        <p className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1">(Mon-Sat, 9 AM - 6 PM IST)</p>
                      </div>
                    </div>
                  </div>

                  {/* Registered Office */}
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2 sm:mb-3">Registered Office</h3>
                    <div className="flex items-start">
                      <div className="bg-orange-50 p-1.5 sm:p-2 rounded-lg mr-2 sm:mr-3">
                        <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-700 text-sm sm:text-base">Prayagraj, Uttar Pradesh</p>
                        <p className="text-gray-600 text-sm sm:text-base">India - 212503</p>
                        <p className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1">(Information Hub for Exam Updates)</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* What to Expect Card */}
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 md:p-8">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">What to Expect</h2>
                
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-start">
                    <div className="bg-blue-50 p-1.5 sm:p-2 rounded-lg mr-2 sm:mr-3">
                      <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-1 text-sm sm:text-base">Quick Response Time</h3>
                      <p className="text-gray-600 text-xs sm:text-sm">
                        We respond to all queries within 24-48 hours.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="bg-green-50 p-1.5 sm:p-2 rounded-lg mr-2 sm:mr-3">
                      <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-1 text-sm sm:text-base">Information Accuracy</h3>
                      <p className="text-gray-600 text-xs sm:text-sm">
                        All updates verified with official sources.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="bg-purple-50 p-1.5 sm:p-2 rounded-lg mr-2 sm:mr-3">
                      <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-1 text-sm sm:text-base">Privacy & Security</h3>
                      <p className="text-gray-600 text-xs sm:text-sm">
                        Your information is protected with strict privacy.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats & Location */}
          <div className="mt-8 sm:mt-12 grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg sm:rounded-xl p-4 sm:p-6 text-white text-center">
              <div className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2">24/7</div>
              <div className="text-xs sm:text-sm opacity-90">Email & WhatsApp Support</div>
            </div>
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg sm:rounded-xl p-4 sm:p-6 text-white text-center">
              <div className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2">24h</div>
              <div className="text-xs sm:text-sm opacity-90">Average Response Time</div>
            </div>
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg sm:rounded-xl p-4 sm:p-6 text-white text-center">
              <div className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2">100%</div>
              <div className="text-xs sm:text-sm opacity-90">Secure & Confidential</div>
            </div>
          </div>

          {/* Location Section */}
          <div className="mt-8 sm:mt-12 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8">
            <div className="flex flex-col md:flex-row items-center gap-4 sm:gap-6 md:gap-8">
              <div className="flex-1">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">Our Location - Information Hub</h2>
                <p className="text-gray-700 mb-3 sm:mb-4 text-sm sm:text-base">
                  Based in Prayagraj, Uttar Pradesh - strategically located to stay updated with India's competitive exam ecosystem.
                </p>
                <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-white rounded-lg shadow-sm">
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                  <span className="font-medium text-gray-800 text-sm sm:text-base">Prayagraj, Uttar Pradesh</span>
                </div>
                <p className="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-2">Information Hub for Exam Updates</p>
              </div>
              <div className="flex-1 w-full">
                <div className="bg-white p-3 sm:p-4 md:p-6 rounded-lg sm:rounded-xl shadow-lg">
                  <div className="aspect-video bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center">
                    <div className="text-center p-3 sm:p-4 md:p-6">
                      <MapPin className="w-8 h-8 sm:w-12 sm:h-12 text-blue-600 mx-auto mb-2 sm:mb-4" />
                      <h3 className="font-bold text-gray-900 text-base sm:text-lg mb-1 sm:mb-2">Prayagraj, Uttar Pradesh</h3>
                      <p className="text-gray-600 text-xs sm:text-sm">Information Hub for Exam Updates</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* About PrepTive Section */}
          <div className="mt-8 sm:mt-12 bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 md:p-8">
            <p className="text-gray-700 mb-4 sm:mb-6 text-sm sm:text-base">
              PrepTive is an informational platform dedicated to providing the latest updates on competitive exams across India.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
              {/* Latest Updates */}
              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">Latest Updates We Cover:</h3>
                <ul className="space-y-2 sm:space-y-3">
                  <li className="flex items-start">
                    <span className="inline-block w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-500 rounded-full mt-1.5 sm:mt-2 mr-2 sm:mr-3 flex-shrink-0"></span>
                    <span className="text-gray-700 text-sm sm:text-base">Admit Card Releases & Download Links</span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-block w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-500 rounded-full mt-1.5 sm:mt-2 mr-2 sm:mr-3 flex-shrink-0"></span>
                    <span className="text-gray-700 text-sm sm:text-base">Result Announcements & Direct Links</span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-block w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-500 rounded-full mt-1.5 sm:mt-2 mr-2 sm:mr-3 flex-shrink-0"></span>
                    <span className="text-gray-700 text-sm sm:text-base">Latest Job Notifications & Vacancies</span>
                  </li>
                </ul>
              </div>

              {/* Exam Categories */}
              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">Exam Categories:</h3>
                <ul className="space-y-2 sm:space-y-3">
                  <li className="flex items-start">
                    <span className="inline-block w-1.5 h-1.5 sm:w-2 sm:h-2 bg-purple-500 rounded-full mt-1.5 sm:mt-2 mr-2 sm:mr-3 flex-shrink-0"></span>
                    <span className="text-gray-700 text-sm sm:text-base">UPSC Civil Services & State PSC</span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-block w-1.5 h-1.5 sm:w-2 sm:h-2 bg-purple-500 rounded-full mt-1.5 sm:mt-2 mr-2 sm:mr-3 flex-shrink-0"></span>
                    <span className="text-gray-700 text-sm sm:text-base">SSC (CGL, CHSL, MTS, GD)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-block w-1.5 h-1.5 sm:w-2 sm:h-2 bg-purple-500 rounded-full mt-1.5 sm:mt-2 mr-2 sm:mr-3 flex-shrink-0"></span>
                    <span className="text-gray-700 text-sm sm:text-base">Banking (IBPS, SBI, RBI)</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* How You Can Help */}
            <div className="mt-6 sm:mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
              <div className="bg-blue-50 rounded-lg sm:rounded-xl p-4 sm:p-6">
                <div className="flex items-center gap-2 mb-3 sm:mb-4">
                  <span className="text-xl sm:text-2xl" aria-hidden="true">📝</span>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900">How You Can Help Improve PrepTive:</h3>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium text-gray-800 mb-1 sm:mb-2 text-sm sm:text-base">Report Issues:</h4>
                    <ul className="space-y-1 sm:space-y-2">
                      <li className="flex items-center">
                        <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-600 rounded-full mr-1.5 sm:mr-2"></span>
                        <span className="text-gray-700 text-xs sm:text-sm">Outdated information</span>
                      </li>
                      <li className="flex items-center">
                        <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-600 rounded-full mr-1.5 sm:mr-2"></span>
                        <span className="text-gray-700 text-xs sm:text-sm">Broken official links</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-800 mb-1 sm:mb-2 text-sm sm:text-base">Submit Updates:</h4>
                    <ul className="space-y-1 sm:space-y-2">
                      <li className="flex items-center">
                        <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-600 rounded-full mr-1.5 sm:mr-2"></span>
                        <span className="text-gray-700 text-xs sm:text-sm">New exam notifications</span>
                      </li>
                      <li className="flex items-center">
                        <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-600 rounded-full mr-1.5 sm:mr-2"></span>
                        <span className="text-gray-700 text-xs sm:text-sm">Result announcements</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Verification Process */}
              <div className="bg-green-50 rounded-lg sm:rounded-xl p-4 sm:p-6">
                <div className="flex items-center gap-2 mb-3 sm:mb-4">
                  <span className="text-xl sm:text-2xl" aria-hidden="true">🔍</span>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900">Our Information Verification:</h3>
                </div>
                
                <ol className="space-y-3 sm:space-y-4">
                  <li className="flex items-start">
                    <span className="inline-flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 bg-green-600 text-white text-xs sm:text-sm font-bold rounded-full mr-2 sm:mr-3 mt-0.5 flex-shrink-0">1</span>
                    <div>
                      <h4 className="font-medium text-gray-800 text-sm sm:text-base">Source Verification</h4>
                      <p className="text-gray-700 text-xs sm:text-sm">Cross-checked with official websites</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 bg-green-600 text-white text-xs sm:text-sm font-bold rounded-full mr-2 sm:mr-3 mt-0.5 flex-shrink-0">2</span>
                    <div>
                      <h4 className="font-medium text-gray-800 text-sm sm:text-base">Timeliness</h4>
                      <p className="text-gray-700 text-xs sm:text-sm">Published when official notifications release</p>
                    </div>
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}