import Hero from '@/components/Hero';
import Navbar from '@/components/Navbar';

export default function Home() {
  return (
    <div>
      <Navbar />
      <Hero />
      <div className="p-8">
        {/* Content akan di sini */}
      </div>
    </div>
  );
}