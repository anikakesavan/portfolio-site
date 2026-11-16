import Desk from "@/components/Desk";
import Hero from "@/components/Hero";
import {
  About,
  Achievements,
  Contact,
  Experience,
  OffTheClock,
  Skills,
  Statement,
  Work,
} from "@/components/Sections";

// Reorder or remove sections here.
export default function Home() {
  return (
    <>
      <Hero />
      <Statement />
      <Work />
      <About />
      <Desk />
      <Experience />
      <Skills />
      <Achievements />
      <OffTheClock />
      <Contact />
    </>
  );
}
