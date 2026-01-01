// app/layout.jsx
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });


export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.className}>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#f8f9f9ff" />
        
        {/* Structured Data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "EducationalOrganization",
              "name": "Preptive",
              "description": "Government Job Updates Portal",
              "url": "https://preptive.in",
              "logo": "https://preptive.in/logo.png",
              "sameAs": [
                "https://facebook.com/preptive",
                "https://twitter.com/preptive",
                "https://linkedin.com/company/preptive"
              ]
            })
          }}
          suppressHydrationWarning
        />
      </head>
      <body 
        className="antialiased min-h-screen flex flex-col bg-gradient-to-br from-slate-500 via-emerald-50 to-sky-50"
        suppressHydrationWarning
      >
        {/* Header */}
        <Header />

        {/* Main Content */}
        <main className="flex-grow">{children}</main>

        {/* Footer */}
        <Footer />
      </body>
    </html>
  );
}