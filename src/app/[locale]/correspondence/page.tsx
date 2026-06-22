import { Nav } from "@/components/sections/Nav";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/sections/Footer";
import { MouseProvider } from "@/components/anim";

export default function CorrespondencePage() {
  return (
    <MouseProvider>
      <div className="min-h-screen flex flex-col bg-background">
        <Nav />
        <main className="flex-1">
          <Contact />
        </main>
        <Footer />
      </div>
    </MouseProvider>
  );
}
