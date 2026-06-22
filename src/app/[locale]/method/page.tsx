import { Nav } from "@/components/sections/Nav";
import { Method } from "@/components/sections/Method";
import { Footer } from "@/components/sections/Footer";
import { MouseProvider } from "@/components/anim";

export default function MethodPage() {
  return (
    <MouseProvider>
      <div className="min-h-screen flex flex-col bg-background">
        <Nav />
        <main className="flex-1">
          <Method />
        </main>
        <Footer />
      </div>
    </MouseProvider>
  );
}
