import { Nav } from "@/components/sections/Nav";
import { Hero } from "@/components/sections/Hero";
import { Marquee } from "@/components/sections/Marquee";
import { Thesis } from "@/components/sections/Thesis";
import { Practice } from "@/components/sections/Practice";
import { Library } from "@/components/sections/Library";
import { Services } from "@/components/sections/Services";
import { Work } from "@/components/sections/Work";
import { Method } from "@/components/sections/Method";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/sections/Footer";
import { MouseProvider } from "@/components/anim";

export default function Home() {
  return (
    <MouseProvider>
      <div className="min-h-screen flex flex-col bg-background">
        <Nav />
        <main className="flex-1">
          <Hero />
          <Marquee />
          <Thesis />
          <Practice />
          <Library />
          <Services />
          <Work />
          <Method />
          <Contact />
        </main>
        <Footer />
      </div>
    </MouseProvider>
  );
}
