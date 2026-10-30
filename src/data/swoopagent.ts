/**
 * The SwoopAgent case study (/work/swoopagent), the one case study on the
 * site. Every fact is from the private repo (checked on 30 Oct 2026) or the
 * owner. Past tense: it was built in February 2026 and is not running.
 * Owner's rules for this page: name Claude and OpenClaw (no model version),
 * no user count, no trading figures, the V4 lesson without amounts. Never
 * publish wallet, key, auth or endpoint details. No em-dashes.
 */

export const swoopagent = {
  path: "/work/swoopagent",
  title: "SwoopAgent",
  description:
    "Case study: a Claude trading agent on Base, built solo in February 2026, where the agent could only propose and backend code checked, signed and executed every trade.",
  published: "2026-10-30",
  lede: "A Claude agent that traded newly launched tokens on Base with real money. I built it alone in under three weeks, around one rule: the agent decides, and plain backend code checks, signs and executes every trade.",
  facts: [
    { label: "Role", value: "Sole engineer: backend, agent, dashboard" },
    { label: "Built", value: "February 2026" },
    { label: "Agent", value: "Claude on OpenClaw" },
    { label: "Stack", value: "TypeScript, Next.js, PostgreSQL, Redis, Docker, 0x on Base" },
  ],
  what: "The agent watched new token launches, scored each one against a checklist and traded the few that passed, within limits set from a web dashboard where you could also chat with it.",
  how: "The agent could only propose. A buy went to the backend, which ran its own checks again at execution time, signed the trade, swapped through 0x and waited for the on-chain receipt before it recorded anything. The agent never held a key.",
  hard: [
    {
      title: "Safety could not depend on the model",
      body: "A loop in the backend repriced every open position every 30 seconds, enforced stop-losses and staged take-profits, and sold anything whose price had gone stale for 30 minutes, even with the agent down. A daily circuit breaker stopped new buys after a bad day.",
    },
    {
      title: "Exits could not fail quietly",
      body: "Sells skipped the limits so an exit was never blocked, retried with more slippage when a swap reverted, and counted only once the receipt confirmed. A sale closed a position only if it was still open, in the same database transaction as its trade, so two exits could not both be booked.",
    },
    {
      title: "Lessons became code",
      body: "Early live buys of tokens whose only pool was on Uniswap V4 went through, but every sale reverted: the swap routers could not reach V4. Instead of trusting the agent to remember, I blocked V4-only pools in the backend, filtered them out of the token feed and added the rule to the agent.",
    },
  ],
};

/** One step of a scenario in the trade diagram, lighting one part of the system. */
export type FlowNode = "agent" | "checks" | "swap" | "record" | "loop";
export type FlowStep = { node: FlowNode; text: string; tone?: "pass" | "block" | "retry" };

/** The parts of the system, in the order the diagram draws them. */
export const flowNodes: { id: FlowNode; kicker: string; name: string }[] = [
  { id: "agent", kicker: "Agent", name: "Claude proposes" },
  { id: "checks", kicker: "Backend", name: "Checks every buy" },
  { id: "swap", kicker: "Backend", name: "Signs and swaps" },
  { id: "record", kicker: "Database", name: "Records on receipt" },
  { id: "loop", kicker: "Every 30 seconds", name: "Safety loop" },
];

/** What the diagram can play. The first one is shown, finished, before any script runs. */
export const flowScenarios: { id: string; label: string; steps: FlowStep[] }[] = [
  {
    id: "buy",
    label: "A buy that passes",
    steps: [
      { node: "agent", text: "The agent proposes a buy of a new token that passed its checklist." },
      {
        node: "checks",
        text: "The backend checks it again: position size, open positions, daily spend, duplicates, contract security, the pool and the circuit breaker.",
        tone: "pass",
      },
      { node: "swap", text: "It signs the trade and swaps USDC for the token through 0x." },
      {
        node: "record",
        text: "The receipt confirms on-chain. The position and the trade are written in one transaction.",
        tone: "pass",
      },
    ],
  },
  {
    id: "v4",
    label: "A token that can't be sold",
    steps: [
      { node: "agent", text: "The agent proposes a buy. The token's only pool is on Uniswap V4." },
      {
        node: "checks",
        text: "Blocked: a V4-only token can be bought but not sold through the swap routers. No money moves.",
        tone: "block",
      },
    ],
  },
  {
    id: "drop",
    label: "The price falls",
    steps: [
      {
        node: "loop",
        text: "The safety loop reprices every open position. This one is past its stop-loss. The agent is not involved.",
      },
      { node: "checks", text: "Sells skip the limits, so an exit is never blocked.", tone: "pass" },
      { node: "swap", text: "The swap reverts. It retries with more slippage.", tone: "retry" },
      { node: "swap", text: "The second attempt goes through." },
      {
        node: "record",
        text: "The receipt confirms. The position closes only if it is still open, so it cannot be sold twice.",
        tone: "pass",
      },
    ],
  },
  {
    id: "day",
    label: "A bad day",
    steps: [
      { node: "agent", text: "The agent proposes another buy." },
      {
        node: "checks",
        text: "Blocked: today's trades are down by 15% of the daily spend limit, so the circuit breaker stops new buys until tomorrow. Sells still go through.",
        tone: "block",
      },
    ],
  },
];
