import Features from "@/components/Features";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import RecentPosts from "@/components/RecentPosts";

export default function Home() {
  return (
    <div>
      <div className="p-8">
        <Navbar />
        <Hero />
        <Features />
        <RecentPosts />
        <Footer />
      </div>
    </div>
  );
}
