import { site } from "./site";

/**
 * The hero: the name, the role line and one intro that covers every kind of
 * role (developer relations and education, AI agents, partner integrations
 * and solution architecture, backend), then the call and the CV. The proof
 * starts right below, in Projects. No employer names, no em-dashes. In the
 * intro, ==text== marks the one highlighted clause and [label](url) renders
 * as a link.
 */
export const hero: { headline: string; intro: string } = {
  headline: site.role,
  intro: site.bio[0],
};

/**
 * The game behind the highlighted clause (SlowStep.tsx): the steps of a
 * developer's path, in order, each with the project that fixed it. Hero.tsx
 * adds each project's name and tagline, so they stay equal to its card, and
 * `key` is the id of that card.
 */
export const slowSteps: { key: string; step: string }[] = [
  { key: "learn-compact", step: "Learning the idea" },
  { key: "create-mn-app", step: "Setting up" },
  { key: "compact-playground", step: "Running the code" },
  { key: "foundry-axelar-gmp-example", step: "Integrating" },
  { key: "midnight-mcp", step: "Asking for help" },
];
