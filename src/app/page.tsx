import { Career } from "@/components/Career";
import { Code } from "@/components/Code";
import { Contact } from "@/components/Contact";
import { Hero } from "@/components/Hero";
import { Talks } from "@/components/Talks";
import { Work } from "@/components/Work";
import { Writing } from "@/components/Writing";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Work />
      <Talks />
      <Writing />
      <Career />
      <Code />
      <Contact />
    </>
  );
}
