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
