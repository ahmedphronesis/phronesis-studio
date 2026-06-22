import { Nav } from "@/components/sections/Nav";
import { Hero } from "@/components/sections/Hero";
import { Thesis } from "@/components/sections/Thesis";
import { Audiences } from "@/components/sections/Audiences";
import { Work } from "@/components/sections/Work";
import { Method } from "@/components/sections/Method";
import { Closing } from "@/components/sections/Closing";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/sections/Footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Nav />
      <main className="flex-1">
        <Hero />
        <Thesis />
        <Audiences />
        <Work />
        <Method />
        <Closing />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
