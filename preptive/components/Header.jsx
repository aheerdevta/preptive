'use client';
import { RiTelegramLine } from "react-icons/ri";
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { RiSearchLine, RiNotification3Line, RiUserLine, RiMenuLine, RiCloseLine, RiArrowLeftLine } from "react-icons/ri";
import { TiHome, TiCalendar, TiDocumentText, TiDownload } from "react-icons/ti";
import { BiBriefcase, BiBookContent, BiChevronDown, BiChevronRight } from "react-icons/bi";

const Header = () => {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const searchRef = useRef(null);
  const menuRef = useRef(null);
  const dropdownRef = useRef(null);

  // Check if mobile/tablet
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) && isDropdownOpen) {
        setIsDropdownOpen(false);
      }
      if (menuRef.current && !menuRef.current.contains(event.target) && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isDropdownOpen, isMenuOpen]);

  // Close search when clicking outside (desktop only)
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target) && searchOpen) {
        setSearchOpen(false);
      }
    };
    if (searchOpen && !isMobile) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [searchOpen, isMobile]);

  // Handle search submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchInput.trim())}`);
      setSearchOpen(false);
      setSearchInput('');
      if (isMobile) {
        setIsMenuOpen(false);
      }
    }
  };

  // Handle search key press
  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearchSubmit(e);
    } else if (e.key === 'Escape') {
      setSearchOpen(false);
    }
  };

  // Clear search input
  const clearSearchInput = () => {
    setSearchInput('');
  };

  const allNavItems = [
    { name: 'Home', icon: <TiHome className="w-6 h-6 md:w-5 md:h-5" />, href: '/' },
    { name: 'Latest Jobs', icon: <BiBriefcase className="w-6 h-6 md:w-5 md:h-5" />, href: '/category/latest-jobs' },
    { name: 'Results', icon: <TiDocumentText className="w-6 h-6 md:w-5 md:h-5" />, href: '/category/results' },
    { name: 'Updates', icon: <TiCalendar className="w-6 h-6 md:w-5 md:h-5" />, href: '/posts' },
    { name: 'Admit Card', icon: <TiDownload className="w-6 h-6 md:w-5 md:h-5" />, href: '/category/admit-card' },
    { name: 'Syllabus', icon: <BiBookContent className="w-6 h-6 md:w-5 md:h-5" />, href: '/category/syllabus' },
  ];

  // Main items always visible on desktop (first 3 items)
  const mainNavItems = allNavItems.slice(0, 3);
  
  // Items that go into dropdown (remaining items)
  const dropdownNavItems = allNavItems.slice(3);

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-xl' : 'bg-gradient-to-br from-slate-50 via-emerald-50 to-sky-50 shadow-lg'}`}>
      {/* Top Bar */}
      <div className="hidden md:block bg-gradient-to-r from-emerald-500 to-cyan-600 text-white py-2 px-4">
        <div className="container mx-auto flex justify-between items-center text-sm">
          <div className="flex items-center space-x-4">
            <span className="flex items-center gap-1">
              <RiNotification3Line className="animate-pulse" />
              <span className="font-semibold">Live Updates:</span> UP Police Constable 32,689 Vacancy Out
            </span>
          </div>
          <div className="flex items-center space-x-6">
            <a
              href="https://t.me/preptive"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-emerald-600 px-3 py-1 rounded-full text-sm font-semibold hover:bg-emerald-50 transition-all duration-300 flex items-center gap-1"
            >
              <RiTelegramLine className="text-lg" />
              Join Telegram
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo - Always visible on desktop, only hides on mobile when search is open */}
          <div className={`${searchOpen && isMobile ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100 w-auto'} transition-all duration-300`}>
            <a href="/" className="flex items-center no-underline">
              <div className="relative">
                <img
                  src="/logo.png"
                  alt="Preptive Logo"
                  width={155}
                  height={86}
                  className="object-contain h-10 w-auto md:h-12 lg:h-14"
                />
              </div>
            </a>
          </div>

          {/* Desktop Navigation - Show only 3 main items + dropdown for the rest */}
          <nav className="hidden md:flex items-center space-x-1 flex-1 justify-center">
            {/* First 3 main items */}
            {mainNavItems.map((item, index) => (
              <a
                key={index}
                href={item.href}
                className="group flex flex-col items-center px-4 py-2 rounded-xl transition-all duration-300 hover:bg-white/50 hover:shadow-lg"
              >
                <div className="flex items-center gap-2">
                  <span className="text-emerald-600 group-hover:text-cyan-600 transition-colors">
                    {item.icon}
                  </span>
                  <span className="font-semibold text-gray-800 group-hover:text-emerald-700">
                    {item.name}
                  </span>
                </div>
                <div className="h-0.5 w-0 group-hover:w-full bg-gradient-to-r from-emerald-400 to-cyan-400 transition-all duration-300 mt-1"></div>
              </a>
            ))}

            {/* Dropdown for remaining items */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="group flex flex-col items-center px-4 py-2 rounded-xl transition-all duration-300 hover:bg-white/50 hover:shadow-lg"
              >
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 flex items-center justify-center">
                    <div className="flex flex-col gap-0.5">
                      <div className="w-1 h-1 rounded-full bg-emerald-600 group-hover:bg-cyan-600 transition-colors"></div>
                      <div className="w-1 h-1 rounded-full bg-emerald-600 group-hover:bg-cyan-600 transition-colors"></div>
                      <div className="w-1 h-1 rounded-full bg-emerald-600 group-hover:bg-cyan-600 transition-colors"></div>
                    </div>
                  </div>
                  <span className="font-semibold text-gray-800 group-hover:text-emerald-700">
                    More
                  </span>
                  <BiChevronDown className={`w-4 h-4 text-emerald-600 group-hover:text-cyan-600 transition-all duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </div>
                <div className="h-0.5 w-0 group-hover:w-full bg-gradient-to-r from-emerald-400 to-cyan-400 transition-all duration-300 mt-1"></div>
              </button>

              {/* Dropdown Menu - Glass Morphism Design */}
              {isDropdownOpen && (
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-72">
                  <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 overflow-hidden animate-fadeIn">
                    {/* Dropdown header */}
                    <div className="bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 p-4 border-b border-emerald-100">
                      <h3 className="font-bold text-lg bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent">
                        More Sections
                      </h3>
                      <p className="text-xs text-gray-600 mt-1">Explore all exam resources</p>
                    </div>
                    
                    {/* Dropdown items */}
                    <div className="p-2">
                      {dropdownNavItems.map((item, index) => (
                        <a
                          key={index}
                          href={item.href}
                          className="group flex items-center gap-3 p-3 rounded-xl hover:bg-gradient-to-r hover:from-emerald-50 hover:to-cyan-50 transition-all duration-300 hover:scale-[1.02]"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-emerald-100 to-cyan-100 flex items-center justify-center group-hover:from-emerald-200 group-hover:to-cyan-200 transition-all duration-300">
                            <span className="text-emerald-600 group-hover:text-cyan-600 transition-colors">
                              {item.icon}
                            </span>
                          </div>
                          <div className="flex-1">
                            <span className="font-semibold text-gray-800 group-hover:text-emerald-700">
                              {item.name}
                            </span>
                            <div className="h-0.5 w-0 group-hover:w-full bg-gradient-to-r from-emerald-400 to-cyan-400 transition-all duration-300 mt-1"></div>
                          </div>
                          <BiChevronRight className="text-gray-400 group-hover:text-emerald-500 transition-colors" />
                        </a>
                      ))}
                    </div>

                    {/* Dropdown footer */}
                    <div className="p-3 bg-gradient-to-r from-emerald-50/50 to-cyan-50/50 border-t border-emerald-100">
                      <a
                        href="/posts"
                        className="flex items-center justify-center gap-2 text-sm font-semibold text-emerald-700 hover:text-cyan-700 transition-colors"
                      >
                        All Posts
                        <BiChevronRight className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* Search and User Section */}
          <div className="flex items-center space-x-4 ml-auto">
            {/* Desktop Search - Only on desktop/tablet */}
            <div className="hidden md:block relative" ref={searchRef}>
              <div className={`relative transition-all duration-500 ${searchOpen ? 'w-64 lg:w-80' : 'w-10'}`}>
                {searchOpen ? (
                  <form onSubmit={handleSearchSubmit} className="flex items-center">
                    <input
                      type="text"
                      value={searchInput}
                      onChange={(e) => setSearchInput(e.target.value)}
                      onKeyDown={handleSearchKeyDown}
                      placeholder="Search exams, notifications, updates..."
                      className="w-full pl-12 pr-10 py-3 bg-white/80 text-gray-800 backdrop-blur-sm rounded-full border-2 border-emerald-200 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-200/50 shadow-lg transition-all duration-300"
                      autoFocus
                    />
                    <RiSearchLine className="absolute left-4 text-emerald-600 w-5 h-5" />
                    {searchInput && (
                      <button
                        type="button"
                        onClick={clearSearchInput}
                        className="absolute right-10 text-gray-400 hover:text-gray-600 transition-colors"
                        aria-label="Clear search"
                      >
                        <RiCloseLine className="w-5 h-5" />
                      </button>
                    )}
                    <button
                      type="submit"
                      className="absolute right-3 text-emerald-600 hover:text-emerald-700 transition-colors"
                      aria-label="Search"
                    >
                      <RiArrowLeftLine className="w-5 h-5" />
                    </button>
                  </form>
                ) : (
                  <button
                    onClick={() => setSearchOpen(true)}
                    className="w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 group"
                    aria-label="Open search"
                  >
                    <RiSearchLine className="w-5 h-5 text-emerald-600 group-hover:text-cyan-600 transition-colors" />
                  </button>
                )}
              </div>
            </div>

            {/* Mobile Search Icon - Always visible on mobile */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="md:hidden w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
              aria-label={searchOpen ? "Close search" : "Open search"}
            >
              {searchOpen ? (
                <RiCloseLine className="w-5 h-5 text-emerald-600" />
              ) : (
                <RiSearchLine className="w-5 h-5 text-emerald-600" />
              )}
            </button>

            {/* Mobile Menu Button - Only visible when search is closed on mobile */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`md:hidden w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 ${searchOpen ? 'hidden' : 'flex'}`}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMenuOpen ? (
                <RiCloseLine className="w-5 h-5 text-emerald-600" />
              ) : (
                <RiMenuLine className="w-5 h-5 text-emerald-600" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar - Appears as overlay on mobile */}
        {searchOpen && isMobile && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-2xl rounded-b-2xl border-t border-emerald-100 animate-slideDown">
            <div className="p-4">
              <div className="relative mb-4">
                <form onSubmit={handleSearchSubmit}>
                  <input
                    type="text"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    onKeyDown={handleSearchKeyDown}
                    placeholder="Search exams, notifications, updates..."
                    className="w-full pl-12 pr-10 py-3 bg-emerald-50 text-gray-800 rounded-xl border-2 border-emerald-200 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-200/50 transition-all duration-300"
                    autoFocus
                  />
                  <RiSearchLine className="absolute left-4 top-1/2 transform -translate-y-1/2 text-emerald-600 w-5 h-5" />
                  {searchInput && (
                    <button
                      type="button"
                      onClick={clearSearchInput}
                      className="absolute right-12 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      aria-label="Clear search"
                    >
                      <RiCloseLine className="w-5 h-5" />
                    </button>
                  )}
                  <button
                    type="submit"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-emerald-600 hover:text-emerald-700 transition-colors"
                    aria-label="Search"
                  >
                    <RiArrowLeftLine className="w-5 h-5" />
                  </button>
                </form>
              </div>
              
              {/* Quick Search Tips */}
              <div className="mt-2">
                <p className="text-sm text-gray-600 px-2">Press Enter to search</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Menu Overlay - Full Screen (Shows all items) */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 top-0">
          {/* Backdrop with blur */}
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsMenuOpen(false)}
          />
          
          {/* Menu Panel - Slide in from right */}
          <div 
            ref={menuRef}
            className="fixed right-0 top-0 h-full w-[85vw] max-w-md bg-gradient-to-b from-white via-emerald-50/50 to-white shadow-2xl animate-slideInRight"
          >
            {/* Menu Header with Logo */}
            <div className="p-6 border-b border-emerald-100 bg-gradient-to-r from-emerald-50 to-white">
              <div className="flex items-center justify-between mb-6">
                <a href="/" onClick={() => setIsMenuOpen(false)} className="flex items-center no-underline">
                  <img
                    src="/logo.png"
                    alt="Preptive Logo"
                    width={155}
                    height={80}
                    className="object-contain h-8"
                  />
                </a>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-white hover:bg-emerald-50 shadow-md transition-all duration-300 active:scale-95"
                  aria-label="Close menu"
                >
                  <RiCloseLine className="w-5 h-5 text-emerald-600" />
                </button>
              </div>
              
              {/* Welcome Message */}
              <div className="p-3 rounded-xl bg-gradient-to-r from-emerald-100/50 to-cyan-100/50">
                <p className="font-semibold text-gray-800 text-sm">Welcome to Preptive!</p>
                <p className="text-xs text-gray-600 mt-1">Your one-stop destination for all exam updates</p>
              </div>
            </div>

            {/* Navigation Items - Shows all items on mobile */}
            <div className="p-4 overflow-y-auto h-[calc(100%-140px)]">
              <div className="space-y-1 mb-8">
                {allNavItems.map((item, index) => (
                  <a
                    key={index}
                    href={item.href}
                    className="flex items-center space-x-3 p-3 rounded-xl hover:bg-white hover:shadow-md transition-all duration-200 active:scale-[0.98] active:bg-emerald-50"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <div className="w-9 h-9 rounded-lg bg-emerald-100 flex items-center justify-center">
                      <span className="text-emerald-600">
                        {item.icon}
                      </span>
                    </div>
                    <span className="font-medium text-gray-800 text-base flex-1">{item.name}</span>
                    <BiChevronRight className="text-gray-400" />
                  </a>
                ))}
              </div>

              {/* Additional Links */}
              <div className="space-y-3 mb-6">
                <a
                  href="https://t.me/preptive"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full text-center bg-gradient-to-r from-emerald-500 to-cyan-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 active:scale-95"
                >
                  <RiTelegramLine className="w-5 h-5" />
                  Join Telegram Channel
                </a>
                
                <div className="grid grid-cols-2 gap-2">
                  <a
                    href="/about"
                    className="text-center bg-white text-emerald-600 py-2 rounded-lg font-medium hover:bg-emerald-50 transition-colors text-sm"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    About Us
                  </a>
                  <a
                    href="/contact"
                    className="text-center bg-white text-emerald-600 py-2 rounded-lg font-medium hover:bg-emerald-50 transition-colors text-sm"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Contact
                  </a>
                </div>
              </div>

              {/* Footer */}
              <div className="pt-4 border-t border-gray-100 mt-4">
                <p className="text-xs text-gray-500 text-center">
                  © 2024 Preptive. All rights reserved.
                </p>
                <div className="flex justify-center gap-4 mt-2">
                  <a href="/privacy-policy" className="text-xs text-gray-500 hover:text-emerald-600">Privacy</a>
                  <a href="/terms-and-conditions" className="text-xs text-gray-500 hover:text-emerald-600">Terms</a>
                  <a href="/faq" className="text-xs text-gray-500 hover:text-emerald-600">FAQ</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add custom animations to global CSS or in your Tailwind config */}
      <style jsx global>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
        
        .animate-slideInRight {
          animation: slideInRight 0.3s ease-out;
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </header>
  );
};

export default Header;