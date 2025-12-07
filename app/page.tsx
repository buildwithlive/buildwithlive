import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import BookPreview from '@/components/BookPreview';
import Pricing from '@/components/Pricing';
import ContactForm from '@/components/ContactForm';
import Footer from '@/components/Footer';
import Script from 'next/script'; // Script Import කළා

export default function Home() {
  
  // Google Structured Data (Product & Book Schema)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: 'Build With Live',
    image: 'https://www.buildwithvideos.com/sample.jpg',
    description: 'The world\'s first live video bodybuilding book with 250+ exercises.',
    brand: {
      '@type': 'Brand',
      name: 'Build With Live',
    },
    offers: {
      '@type': 'Offer',
      url: 'https://www.buildwithvideos.com',
      priceCurrency: 'USD',
      price: '20.00',
      priceValidUntil: '2026-12-31',
      availability: 'https://schema.org/InStock',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      ratingCount: '150',
    },
  };

  return (
    <main className="bg-black min-h-screen selection:bg-blue-500 selection:text-white">
      {/* Add SEO Schema Script */}
      <Script
        id="json-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Navbar />
      <Hero />
      <Features />
      <BookPreview />
      <Pricing />
      <ContactForm />
      <Footer />
    </main>
  );
}