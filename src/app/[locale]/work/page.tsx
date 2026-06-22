import { Nav } from "@/components/sections/Nav";
import { Work } from "@/components/sections/Work";
import { Footer } from "@/components/sections/Footer";
import { MouseProvider } from "@/components/anim";

export default function WorkPage() {
  return (
    <MouseProvider>
      <div className="min-h-screen flex flex-col bg-background">
        <Nav />
        <main className="flex-1">
          <Work />
        </main>
        <Footer />
      </div>
    </MouseProvider>
  );
}
