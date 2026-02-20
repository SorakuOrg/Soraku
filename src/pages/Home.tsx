import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ToastContainer } from '@/components/ui/toast';
import { 
  Hero, 
  Features, 
  Events, 
  Blog, 
  DiscordSection, 
  Testimonials, 
  CTA 
} from '@/sections';

export function Home() {
  return (
    <div className="min-h-screen bg-[#1C1E22]">
      <Navbar />
      
      <main>
        <Hero />
        <Features />
        <Events />
        <Blog />
        <DiscordSection />
        <Testimonials />
        <CTA />
      </main>
      
      <Footer />
      <ToastContainer />
    </div>
  );
}
