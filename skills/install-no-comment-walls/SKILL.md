---
name: install-no-comment-walls
description: Install and configure the no-comment-walls Oxlint plugin in a local TypeScript or JavaScript repository. Use whenever a user asks to ban comment walls, block multi-line // comment blocks, add the no-comment-walls rule, or migrate an existing local copy.
---

# Install no-comment-walls

Install the bundled Oxlint plugin into the current repository and integrate it with the repository's existing lint setup. Preserve unrelated work and adapt to the project's package manager and configuration style.

## Procedure

1. Inspect the repository before changing it:
   - Read its agent instructions.
   - Check `git status` and preserve unrelated changes.
   - Identify the package manager from `packageManager` and lockfiles.
   - Find Oxlint configuration (`oxlint.config.*`, `.oxlintrc*`, or a Vite+ config).
   - Check whether no-comment-walls files or rules already exist. Do not overwrite them without reviewing the diff.

2. Copy the bundled plugin from this skill. Run from the target repository:

   ```bash
   node <skill-directory>/scripts/install.mjs
   ```

   This creates `tools/oxlint/no-comment-walls/`. Pass another relative destination as the first argument when the repository has an established tooling layout. The script refuses to replace an existing destination; only use `--force` after backing up and reviewing existing files.

3. Install current compatible dependencies rather than trusting versions remembered by the agent:
   - Query `npm view oxlint version` and `npm view @oxlint/plugins version`.
   - Install the same current version of both packages with the repository's package manager.
   - `oxlint` is a development dependency. The copied source imports `@oxlint/plugins`, so install it as a development dependency for a local-only plugin.
   - Do not replace the package manager or rewrite unrelated dependency ranges.

4. Register the plugin and enable the rule. For `oxlint.config.ts` or `.oxlintrc.json`, merge these fields with the existing configuration:

   ```ts
   ignorePatterns: ["tools/oxlint/no-comment-walls/**"],
   jsPlugins: [
     { name: "no-comment-walls", specifier: "./tools/oxlint/no-comment-walls/index.ts" },
   ],
   rules: {
     "no-comment-walls/no-comment-walls": "error",
   },
   ```

   Keep every existing ignore, and adjust the pattern when the plugin was copied elsewhere. The rule defaults to a maximum of 2 consecutive line comments; pass `["error", { "max": 3 }]` when the user wants a looser limit.

5. Run the repository's lint command and typecheck. If findings appear in owned project source, report them and fix them only when the user asked for migration/cleanup. Do not suppress the rule or weaken its severity to make lint pass.

6. Review the final diff and clearly report:
   - copied path,
   - dependency versions installed,
   - configuration changed,
   - checks run and any remaining findings.

## Migration guidance

When replacing an older local copy, compare its configuration before overwriting. When resolving findings, compress the comment to the one non-obvious constraint it protects, or move the explanation to a doc, commit message, or PR description — do not restate what the code already says.
