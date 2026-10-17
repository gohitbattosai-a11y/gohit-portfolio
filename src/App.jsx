import { useEffect } from "react";
import { Toaster } from "sonner";
import { initLenis } from "@/lib/scroll";
import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { Marquee } from "@/components/Marquee";
import { Showcase } from "@/components/Showcase";
import { Skills } from "@/components/Skills";
import { Contact, Footer } from "@/components/Contact";
import { gradients, currentTheme } from "@/data/gradients";

function App() {
  useEffect(() => {
    const destroy = initLenis();
    return () => destroy();
  }, []);

  const t = gradients[currentTheme];
  if (typeof document !== 'undefined') {
    document.documentElement.style.setProperty('--primary', t.primary);
    document.documentElement.style.setProperty('--secondary', t.secondary);
  }

  return (
    <div className="relative min-h-screen bg-[#080C14] text-slate-50">
      <div className="grain" />
      <Nav />
      <main>
        <Hero />
        <Marquee />
        <Showcase />
        <Skills />
        <Contact />
      </main>
      <Footer />
      <Toaster theme="dark" position="bottom-center" richColors />
    </div>
  );
}

export default App;