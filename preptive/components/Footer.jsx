import React from 'react';
import { RiGovernmentLine, RiShieldCheckLine, RiTeamLine, RiGlobalLine, RiMailLine, RiPhoneLine, RiMapPinLine, RiFacebookCircleLine, RiTwitterLine, RiLinkedinLine, RiInstagramLine, RiYoutubeLine } from 'react-icons/ri';
import { BiBookReader, BiMedal, BiTime, BiChevronRight } from 'react-icons/bi';
import { TiDocument, TiLightbulb, TiNews } from 'react-icons/ti';
import { SiGooglescholar, SiCoursera } from 'react-icons/si';
import Link from 'next/link'; // If using Next.js, otherwise use react-router Link

const Footer = () => {
  const postCategories = [
    { name: 'Admit Card', slug: 'admit-card' },
    { name: 'Latest Job', slug: 'latest-job' },
    { name: 'Results', slug: 'results' },
    { name: 'Syllabus', slug: 'syllabus' },
    { name: 'Important Dates', slug: 'important-dates' },
    { name: 'Exam Pattern', slug: 'exam-pattern' },
    { name: 'Notifications', slug: 'notifications' },
  ];

  return (
    <footer className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-emerald-50 to-sky-50 pt-16 pb-8">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400"></div>
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-emerald-200 rounded-full opacity-10 blur-3xl"></div>
      <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-cyan-200 rounded-full opacity-10 blur-3xl"></div>

      <div className="container mx-auto px-4 relative z-10">
       
        {/* Post Categories */}
        <div className="mb-12">
          <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">Popular Categories</h3>
          <div className="flex flex-wrap justify-center gap-3">
            {postCategories.map((category, index) => (
              <Link 
                key={index}
                href={`/category/${category.slug}`}
                // If using react-router: to={`/category/${category.slug}`}
                // If using standard HTML: href={`/category/${category.slug}`}
              >
                <span className="px-4 py-2 bg-white/70 backdrop-blur-sm rounded-full text-sm font-medium text-gray-700 hover:bg-white hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer border border-emerald-100 block">
                  {category.name}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Social & Bottom Bar */}
        <div className="border-t border-gray-200 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
            {/* Social Links */}
            <div className="flex items-center space-x-4">
              <span className="text-gray-600 font-medium">Follow Us:</span>
              <div className="flex space-x-3">
                {[
                  { 
                    icon: <RiTwitterLine />, 
                    color: 'text-sky-500',
                    url: 'https://twitter.com/yourusername' 
                  },
                  { 
                    icon: <RiInstagramLine />, 
                    color: 'text-pink-600',
                    url: 'https://instagram.com/yourusername' 
                  },
                  { 
                    icon: <RiYoutubeLine />, 
                    color: 'text-red-600',
                    url: 'https://youtube.com/c/yourchannel' 
                  },
                ].map((social, index) => (
                  <a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-md hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 ${social.color}`}
                  >
                    <span className="text-xl">{social.icon}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Copyright */}
            <div className="text-center md:text-right">
              <p className="text-gray-600">
                © {new Date().getFullYear()} Preptive. All rights reserved.
              </p>
              <div className="flex flex-wrap justify-center md:justify-end gap-4 mt-2 text-sm text-gray-500">
                <Link href="/privacy-policy" className="hover:text-emerald-600 transition-colors">
                  Privacy Policy
                </Link>
                <Link href="/terms-and-conditions" className="hover:text-emerald-600 transition-colors">
                  Terms of Service
                </Link>
                <Link href="/contact" className="hover:text-emerald-600 transition-colors">
                  Contact
                </Link>
                <Link href="/disclaimer" className="hover:text-emerald-600 transition-colors">
                  Disclaimer
                </Link>
              </div>
            </div>
          </div>

     
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-gray-500 text-sm">
            <div className="flex items-center space-x-2">
              <RiShieldCheckLine className="text-emerald-500" />
              <span>SSL Secure</span>
            </div>
            <div className="h-4 w-px bg-gray-300"></div>
            <div className="flex items-center space-x-2">
              <BiMedal className="text-emerald-500" />
              <Link href="/about" className="hover:text-emerald-600 transition-colors">
                <span>About Us</span>
              </Link>
            </div>
            <div className="h-4 w-px bg-gray-300"></div>
            <div className="flex items-center space-x-2">
              <RiTeamLine className="text-emerald-500" />
              <span>24/7 Support</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;