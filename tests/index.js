const assert = require("assert");
const { Linter } = require("eslint");
const plugin = require("../lib/index");

describe("plugin export", function () {
    it("exposes the switch-allman rule", function () {
        assert.deepStrictEqual(Object.keys(plugin.rules), ["switch-allman"]);
        assert.strictEqual(
            plugin.rules["switch-allman"],
            require("../lib/rules/switch-allman")
        );
    });

    it("resolves as switch-allman/switch-allman and autofixes", function () {
        const linter = new Linter();
        const config = [
            {
                plugins: { "switch-allman": plugin },
                rules: { "switch-allman/switch-allman": "error" },
            },
        ];

        const result = linter.verifyAndFix(
            "switch (x)\n{\n    case 1: {\n        break;\n    }\n}\n",
            config
        );

        assert.strictEqual(
            result.output,
            "switch (x)\n{\n    case 1:\n    {\n        break;\n    }\n}\n"
        );
    });
});
