import { site } from "./site";

/**
 * The three roles the site is pitched for. Each lens swaps the headline, the
 * pitch, the at-a-glance numbers and the activity log in the hero, and has its
 * own prerendered URL so a tailored link can be sent with an application.
 * Every figure comes from the owner's verified brief or public data
 * (npm, GitHub). No em-dashes. In a pitch, ==text== marks the one highlighted
 * clause and [label](url) renders as a link.
 */
export type LensKey = "devrel" | "ai" | "fde";

export type Metric = {
  /** Where the number comes from, shown in mono above it. */
  source: string;
  value: string;
  caption: string;
  /** Section or project anchor the tile links to. */
  href?: string;
};

/** One line of the activity log: a project and a true fact about it that the number tiles do not already show. */
export type LogLine = { tag: string; fact: string };

export type Lens = {
  key: LensKey;
  /** Label on the switcher. */
  label: string;
  /** Path for the tailored link; the default lens lives at "/". */
  path: string;
  /** Headline under the name. */
  title: string;
  pitch: string;
  metrics: Metric[];
  log: LogLine[];
  /** Page title and description when this lens has its own URL. */
  metaTitle: string;
  metaDescription: string;
};

export const lenses: Record<LensKey, Lens> = {
  devrel: {
    key: "devrel",
    label: "Developer Relations",
    path: "/",
    title: site.role,
    pitch:
      "I help developers and builders succeed on technical products. I build the tools, guides, and programs that ==take an engineer from first look to production==, and I’ve done it for developer platforms in AI and blockchain since 2019. Most recently at Midnight and Axelar. Founder of [Web3 Afrika](https://web3afrika.com/), a developer community.",
    metrics: [
      {
        source: "Tutorials",
        value: "10M+",
        caption: "reads across 40+ tutorials",
        href: "#writing",
      },
      {
        source: "Axelar",
        value: "100,000+",
        caption: "developers supported, rated 4.8/5",
        href: "#experience",
      },
      {
        source: "Axelar",
        value: "55%",
        caption: "cut in integration setup time",
        href: "#foundry-axelar-gmp-example",
      },
      {
        source: "Mara",
        value: "19,000+",
        caption: "developers on the education platform",
        href: "#experience",
      },
    ],
    log: [
      { tag: "midnight", fact: "docs rebuilt for AI retrieval" },
      { tag: "midnight", fact: "12-part video series" },
      { tag: "blockfest-africa", fact: "keynote, 2025" },
      { tag: "mara", fact: "campus programme, 0 to 18+ universities" },
      { tag: "x.com/olanetsoft", fact: "27,000+ followers" },
    ],
    metaTitle: site.title,
    metaDescription: site.metaDescription,
  },
  ai: {
    key: "ai",
    label: "AI Engineer",
    path: "/ai-engineer",
    title: "Applied AI Engineer · Agent Harness",
    pitch:
      "I build agents and the harness around them: tools, context, verification, safety layers and observability. Backend engineer first, so in my systems ==the agent proposes and the backend validates, signs and executes==. SwoopAgent runs that way today for around 100 users trading real funds.",
    metrics: [
      {
        source: "Midnight MCP",
        value: "10,000+",
        caption: "server downloads",
        href: "#midnight-mcp",
      },
      {
        source: "Midnight MCP",
        value: "11,900+",
        caption: "agent tool calls served",
        href: "#midnight-mcp",
      },
      {
        source: "SwoopAgent",
        value: "~100",
        caption: "users trading real funds through their agents",
        href: "#swoopagent",
      },
      {
        source: "Agent Lookout",
        value: "1,100+",
        caption: "npm downloads in its first week",
        href: "#agent-lookout",
      },
    ],
    log: [
      { tag: "midnight-mcp", fact: "hosted compiler as a verification gate" },
      { tag: "swoopagent", fact: "every position checked every 30s" },
      { tag: "swoopagent", fact: "circuit breaker at -15%" },
      { tag: "swoopagent", fact: "double-sell race closed with a lock" },
      { tag: "agent-lookout", fact: "flags sessions waiting for you" },
    ],
    metaTitle: "Idris Olubisi, Applied AI Engineer",
    metaDescription:
      "Idris Olubisi builds agents and the harness around them: tools, verification, safety layers and observability. SwoopAgent, the Midnight MCP server and Agent Lookout.",
  },
  fde: {
    key: "fde",
    label: "Forward Deployed",
    path: "/forward-deployed",
    title: "Forward Deployed Engineer · Agent Systems",
    pitch:
      "I embed with a partner’s engineering team, agree what success looks like, and ==ship the integration with them through launch==. Then I turn the pattern I keep seeing into tooling: at Axelar, a reference implementation that cut integration setup time 55%; at Midnight, an MCP server built over a weekend from a support problem.",
    metrics: [
      {
        source: "Axelar",
        value: "55%",
        caption: "cut in partner integration setup time",
        href: "#foundry-axelar-gmp-example",
      },
      {
        source: "Axelar",
        value: "100,000+",
        caption: "developers supported, rated 4.8/5",
        href: "#experience",
      },
      {
        source: "Midnight",
        value: "48h",
        caption: "triage, fix, test, ship runbook",
        href: "#experience",
      },
      {
        source: "Mara",
        value: "65%",
        caption: "cut in developer onboarding time",
        href: "#experience",
      },
    ],
    log: [
      { tag: "axelar", fact: "partner teams, discovery to launch" },
      { tag: "axelar", fact: "reference implementation, 500+ adoptions" },
      { tag: "midnight", fact: "example repos kept production-current" },
      { tag: "midnight", fact: "reproducible findings to Product" },
      { tag: "create-mn-app", fact: "9,000+ npm downloads" },
    ],
    metaTitle: "Idris Olubisi, Forward Deployed Engineer",
    metaDescription:
      "Idris Olubisi embeds with engineering teams, finds the step that costs them time and ships the fix as production software. Seven years across backend and developer relations.",
  },
};

export const lensOrder: LensKey[] = ["devrel", "ai", "fde"];
