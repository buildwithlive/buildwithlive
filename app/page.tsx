import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import BookPreview from '@/components/BookPreview';
import Pricing from '@/components/Pricing';
import ContactForm from '@/components/ContactForm'; // අලුත් Form එක Import කළා
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className="bg-black min-h-screen selection:bg-blue-500 selection:text-white">
      <Navbar />
      <Hero />
      <Features />
      <BookPreview />
      <Pricing />
      <ContactForm /> {/* මෙන්න මෙතනට දැම්මා */}
      <Footer />
    </main>
  );
}