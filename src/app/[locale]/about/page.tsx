import { Nav } from "@/components/sections/Nav";
import { About } from "@/components/sections/About";
import { Footer } from "@/components/sections/Footer";
import { MouseProvider } from "@/components/anim";

export default function AboutPage() {
  return (
    <MouseProvider>
      <div className="min-h-screen flex flex-col bg-background">
        <Nav />
        <main className="flex-1">
          <About />
        </main>
        <Footer />
      </div>
    </MouseProvider>
  );
}
