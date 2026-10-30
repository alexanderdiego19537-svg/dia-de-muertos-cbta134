import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';
import TraditionsSection from '@/components/TraditionsSection';
import GallerySection from '@/components/GallerySection';
import LocationSection from '@/components/LocationSection';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main>
      <HeroSection />
      <AboutSection />
      <TraditionsSection />
      <GallerySection showViewAll />
      <LocationSection />
      <Footer />
    </main>
  );
}
