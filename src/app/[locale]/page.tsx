import { useTranslations } from "next-intl";
import { Nav } from "@/components/sections/Nav";
import { Hero } from "@/components/sections/Hero";
import { Thesis } from "@/components/sections/Thesis";
import { Footer } from "@/components/sections/Footer";
import { MouseProvider } from "@/components/anim";

export default function HomePage() {
  return (
    <MouseProvider>
      <div className="min-h-screen flex flex-col bg-background">
        <Nav />
        <main className="flex-1">
          <Hero />
          <Thesis />
        </main>
        <Footer />
      </div>
    </MouseProvider>
  );
}
