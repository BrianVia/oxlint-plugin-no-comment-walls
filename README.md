# oxlint-plugin-no-comment-walls

Bans blocks of consecutive `//` line comments ("comment walls"). Comments
should state a non-obvious constraint in a line or two — essays belong in
docs, commit messages, or PR descriptions.

```
bad.ts:1:1: error no-comment-walls(no-comment-walls):
  Comment wall: 4 consecutive // lines (max 2). Tighten it or move the essay to a doc.
```

## Usage (oxlint)

Requires oxlint with JS plugin support (alpha since March 2026).

`.oxlintrc.json`:

```json
{
  "jsPlugins": ["oxlint-plugin-no-comment-walls"],
  "rules": {
    "no-comment-walls/no-comment-walls": "error"
  }
}
```

Or point at a local file: `"jsPlugins": ["./lint/no-comment-walls/index.mjs"]`.

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

- Consecutive `//` lines with nothing between them, on adjacent lines.
- Code between comments splits the run — those are independent comments.
- Block comments (`/* ... */`, `/** ... */`) are ignored; JSDoc stays legal.
- Trailing comments after code count toward a run only if the next line is
  another comment on the following line.

## ESLint

The rule uses the standard ESLint rule API (`context.sourceCode.getAllComments()`),
so it also works as a plain ESLint v9 plugin:

```js
import noCommentWalls from "oxlint-plugin-no-comment-walls";

export default [
  {
    plugins: { "no-comment-walls": noCommentWalls },
    rules: { "no-comment-walls/no-comment-walls": "error" },
  },
];
```

## Test

```
npm install
npm test
```
