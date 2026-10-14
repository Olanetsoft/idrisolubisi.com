import { Contact } from "@/components/Contact";
import { Experience } from "@/components/Experience";
import { Hero } from "@/components/Hero";
import { Projects } from "@/components/Projects";
import { Spotlight } from "@/components/Spotlight";
import { Recognition } from "@/components/Recognition";
import { Talks } from "@/components/Talks";
import { Writing } from "@/components/Writing";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Projects />
      <Talks />
      <Experience />
      <Writing />
      <Recognition />
      <Contact />
      <Spotlight />
    </>
  );
}
