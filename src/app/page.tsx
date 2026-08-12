import { About } from "@/components/sections/About";
import { Community } from "@/components/sections/Community";
import { Contact } from "@/components/sections/Contact";
import { Hero } from "@/components/sections/Hero";
import { Intro } from "@/components/sections/Intro";
import { Services } from "@/components/sections/Services";
import { Work } from "@/components/sections/Work";

/**
 * PAGE D'ACCUEIL — les six séquences, complètes.
 *
 * La page reste un Server Component : seules les sections animées sont des
 * îlots clients. Le HTML utile est donc rendu au serveur, le JS de motion
 * n'hydrate que ce qui bouge.
 */
export default function Page() {
  return (
    <>
      <Hero />
      <Intro />
      <Services />
      <Work />
      <About />
      <Community />
      <Contact />
    </>
  );
}
