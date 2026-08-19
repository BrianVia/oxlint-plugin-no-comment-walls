# no-comment-walls

An Oxlint rule that rejects blocks of consecutive `//` line comments ("comment walls"). A comment should state the one non-obvious constraint the code can't show — essays belong in docs, commit messages, or PR descriptions.

```
guidesStore.ts:42:3: error no-comment-walls(no-comment-walls):
  Comment wall: 4 consecutive line comments (max 2). Tighten it or move the essay to a doc.
```

This project is meant to be vendored, not treated as a fixed npm dependency. Copy the rule into your repository, read it, and change it to match your team's standards. The bundled agent skill handles the initial copy and configuration; after that, the vendored files are yours to maintain.

## Install with an agent skill

```bash
npx skills add BrianVia/oxlint-plugin-no-comment-walls --skill install-no-comment-walls
```

Then ask your coding agent to install or configure no-comment-walls in the current repository. The skill copies the plugin, installs current Oxlint dependencies, merges the plugin into the existing lint configuration, and validates the result.

## Manual local installation

Copy `src/` into the target repository, for example at `tools/oxlint/no-comment-walls/`, and install matching current versions of `oxlint` and `@oxlint/plugins`.

Register the copied entry point in `oxlint.config.ts`:

```ts
import { defineConfig } from "oxlint";

export default defineConfig({
  ignorePatterns: ["tools/oxlint/no-comment-walls/**"],
  jsPlugins: [
    { name: "no-comment-walls", specifier: "./tools/oxlint/no-comment-walls/index.ts" },
  ],
  rules: {
    "no-comment-walls/no-comment-walls": "error",
  },
});
```

Or in `.oxlintrc.json`:

```json
{
  "ignorePatterns": ["tools/oxlint/no-comment-walls/**"],
  "jsPlugins": ["./tools/oxlint/no-comment-walls/index.ts"],
  "rules": {
    "no-comment-walls/no-comment-walls": "error"
  }
}
```

## Options

```json
{
  "rules": {
    "no-comment-walls/no-comment-walls": ["error", { "max": 3 }]
  }
}
```

- `max` (default `2`) — the longest allowed run of consecutive `//` lines.

## What counts as a wall

- Consecutive `//` lines on adjacent lines with nothing between them.
- Code between comments splits the run — those are independent comments.
- Block comments (`/* ... */`, `/** ... */`) are ignored; JSDoc stays legal.

## Development

```bash
pnpm install
pnpm check   # lint + test + typecheck + skill-asset sync check
```

Run `pnpm sync:skill-assets` after changing `src/` so the bundled skill assets stay identical.
