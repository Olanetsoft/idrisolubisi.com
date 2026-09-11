/**
 * Real artefacts shown on the page. Every entry carries the date it was
 * captured and the source it can be checked against. Nothing here is typed
 * from memory: re-capture and update `capturedAt` when the source changes.
 */

type IsoDate = `${number}-${number}-${number}`;

export type ToolCategory = { name: string; description: string; toolCount: number };

/** `tools/call midnight-list-tool-categories` against midnight-mcp v0.3.0 over stdio. */
export const toolCategories: {
  capturedAt: IsoDate;
  server: string;
  request: string;
  source: string;
  categories: ToolCategory[];
} = {
  capturedAt: "2026-09-11",
  server: "midnight-mcp v0.3.0",
  request: "tools/call midnight-list-tool-categories",
  source: "https://github.com/Olanetsoft/midnight-mcp",
  categories: [
    { name: "search", description: "Semantic search across the Midnight codebase", toolCount: 4 },
    { name: "analyze", description: "Static analysis of Compact contracts", toolCount: 4 },
    { name: "repository", description: "Repository files, examples and recent updates", toolCount: 3 },
    { name: "versioning", description: "Breaking changes and migration assistance", toolCount: 6 },
    { name: "generation", description: "AI-powered generation, review and docs", toolCount: 3 },
    { name: "health", description: "Server health and status monitoring", toolCount: 8 },
    { name: "compound", description: "Multi-step operations in a single call", toolCount: 2 },
  ],
};

export const toolTotal = toolCategories.categories.reduce((n, c) => n + c.toolCount, 0);

/** A selection of the tool names an agent is offered by `tools/list` (31 tools on 2026-09-11). */
export const toolNames: { capturedAt: IsoDate; source: string; names: string[] } = {
  capturedAt: "2026-09-11",
  source: "https://github.com/Olanetsoft/midnight-mcp",
  names: [
    "midnight-search-docs",
    "midnight-search-compact",
    "midnight-compile-contract",
    "midnight-explain-circuit",
    "midnight-analyze-contract",
    "midnight-check-breaking-changes",
    "midnight-get-migration-guide",
    "midnight-review-contract",
  ],
};

export const installLine = "npx -y midnight-mcp@latest";

/** The first command block of the foundry-axelar-gmp-example README. */
export const axelarCommands: { capturedAt: IsoDate; source: string; lines: string[] } = {
  capturedAt: "2026-09-11",
  source: "https://github.com/axelarnetwork/foundry-axelar-gmp-example",
  lines: [
    "git clone https://github.com/axelarnetwork/foundry-axelar-gmp-example.git",
    "cd foundry-axelar-gmp-example",
    "make all",
    "make local-chain-start",
    "make local-chain-deploy",
  ],
};
