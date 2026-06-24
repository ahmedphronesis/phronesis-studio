import { Nav } from "@/components/sections/Nav";
import { Echoes } from "@/components/sections/Echoes";
import { Footer } from "@/components/sections/Footer";
import { MouseProvider } from "@/components/anim";
import { getEpisodes } from "@/lib/episodes";

export default async function EchoesPage() {
  const episodes = await getEpisodes();
  return (
    <MouseProvider>
      <div className="min-h-screen flex flex-col bg-background">
        <Nav />
        <main className="flex-1">
          <Echoes episodes={episodes} />
        </main>
        <Footer />
      </div>
    </MouseProvider>
  );
}
