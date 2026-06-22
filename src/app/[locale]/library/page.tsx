import { Nav } from "@/components/sections/Nav";
import { Library } from "@/components/sections/Library";
import { Footer } from "@/components/sections/Footer";
import { MouseProvider } from "@/components/anim";

export default function LibraryPage() {
  return (
    <MouseProvider>
      <div className="min-h-screen flex flex-col bg-background">
        <Nav />
        <main className="flex-1">
          <Library />
        </main>
        <Footer />
      </div>
    </MouseProvider>
  );
}
