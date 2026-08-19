const DEFAULT_MAX = 2;

const plugin = {
  meta: { name: "no-comment-walls" },
  rules: {
    "no-comment-walls": {
      meta: {
        type: "suggestion",
        docs: {
          description:
            "Disallow blocks of consecutive line comments (comment walls)",
        },
        schema: [
          {
            type: "object",
            properties: {
              max: { type: "integer", minimum: 1 },
            },
            additionalProperties: false,
          },
        ],
      },
      create(context) {
        const max = context.options?.[0]?.max ?? DEFAULT_MAX;
        return {
          Program() {
            const comments = context.sourceCode.getAllComments();
            let run = [];
            const flush = () => {
              if (run.length > max) {
                context.report({
                  loc: run[0].loc,
                  message: `Comment wall: ${run.length} consecutive // lines (max ${max}). Tighten it or move the essay to a doc.`,
                });
              }
              run = [];
            };
            for (const c of comments) {
              if (c.type !== "Line") {
                flush();
                continue;
              }
              const prev = run[run.length - 1];
              if (prev && c.loc.start.line === prev.loc.end.line + 1) {
                run.push(c);
              } else {
                flush();
                run.push(c);
              }
            }
            flush();
          },
        };
      },
    },
  },
};

export default plugin;
