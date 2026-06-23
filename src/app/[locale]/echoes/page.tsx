import { Nav } from "@/components/sections/Nav";
import { Echoes } from "@/components/sections/Echoes";
import { Footer } from "@/components/sections/Footer";
import { MouseProvider } from "@/components/anim";

export default function EchoesPage() {
  return (
    <MouseProvider>
      <div className="min-h-screen flex flex-col bg-background">
        <Nav />
        <main className="flex-1">
          <Echoes />
        </main>
        <Footer />
      </div>
    </MouseProvider>
  );
}
