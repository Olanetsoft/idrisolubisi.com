import { site } from "./site";

/**
 * The hero: the name, the role line, one intro, the call and the CV, then the
 * four kinds of role as one compact row (a hiring manager's keyword, then the
 * work in a line). The proof starts right below, in Projects. No employer
 * names, no em-dashes. In the intro, ==text== marks the one highlighted
 * clause and [label](url) renders as a link.
 */
export type Role = {
  /** The role a hiring manager scans for. */
  title: string;
  /** What that work is, in one line of plain words. */
  text: string;
};

export const hero: { headline: string; intro: string; roles: Role[] } = {
  headline: site.role,
  intro: site.bio[0],
  roles: [
    {
      title: "Developer relations and education",
      text: "Courses, docs, tutorials, talks and workshops that take developers from first look to shipping.",
    },
    {
      title: "AI agent engineering",
      text: "Production agents and the harness around them: MCP tools, verification and safety limits.",
    },
    {
      title: "Forward deployed engineering",
      text: "Inside partner engineering teams from discovery to launch, then reference code and tooling.",
    },
    {
      title: "Backend engineering",
      text: "Production services and APIs: payments, multi-tenant systems and data pipelines.",
    },
  ],
};
