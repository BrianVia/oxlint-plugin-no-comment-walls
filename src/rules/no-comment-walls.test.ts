import { RuleTester } from "oxlint/plugins-dev";

import { noCommentWallsRule } from "./no-comment-walls.ts";

const tester = new RuleTester({ languageOptions: { parserOptions: { lang: "ts" } } });
const error = { messageId: "commentWall" };

tester.run("no-comment-walls/no-comment-walls", noCommentWallsRule, {
	valid: [
		"// one short line\nconst x = 1;",
		"// two lines is fine\n// when the constraint needs both\nconst x = 1;",
		"const x = 1; // trailing comment",
		"// runs split by code\nconst x = 1;\n// are independent\nconst y = 2;\n// not a wall\nconst z = 3;",
		"/**\n * JSDoc blocks are ignored\n * no matter how long\n * they get\n */\nconst x = 1;",
		"/* block */\n/* comments */\n/* are ignored */\nconst x = 1;",
		{
			name: "custom max allows longer runs",
			code: "// one\n// two\n// three\nconst x = 1;",
			options: [{ max: 3 }],
		},
	],
	invalid: [
		{
			name: "three consecutive line comments",
			code: "// one\n// two\n// three\nconst x = 1;",
			errors: [error],
		},
		{
			name: "prose wall above a function",
			code: "// Expired guides are locked — the backend 409s any PUT. This is the frontend\n// chokepoint for single-guide writes (updateGuideOrders owns the batch case),\n// so every surface is covered without per-caller guards; surfaces only hide\n// or disable their affordances.\nconst existing = 1;",
			errors: [error],
		},
		{
			name: "two separate walls report twice",
			code: "// a\n// b\n// c\nconst x = 1;\n// d\n// e\n// f\nconst y = 2;",
			errors: [error, error],
		},
		{
			name: "custom max still enforced",
			code: "// one\n// two\nconst x = 1;",
			options: [{ max: 1 }],
			errors: [error],
		},
	],
});
