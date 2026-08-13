const RuleTester = require("eslint").RuleTester;
const rule = require("../lib/rules/switch-allman");

// The peer range is eslint >=7, where `context.sourceCode` does not exist and
// the rule has to fall back to `context.getSourceCode()`. The installed ESLint
// always provides `context.sourceCode`, so that branch is only reachable via a
// context shim. This runs the real rule, against real nodes, on the old path.
const legacyRule = {
    meta: rule.meta,
    create: function (context) {
        const sourceCode = context.sourceCode;

        return rule.create({
            getSourceCode: function () {
                return sourceCode;
            },
            options: context.options,
            report: function (descriptor) {
                context.report(descriptor);
            },
        });
    },
};

const ruleTester = new RuleTester();
ruleTester.run("switch-allman (eslint 7 context)", legacyRule, {
    valid: [
        `
        switch (x)
        {
            case 1:
            {
                break;
            }
        }
        `,
    ],
    invalid: [
        {
            code: `
            switch (x)
            {
                case 1: {
                    break;
                }
            }
            `,
            errors: [
                { message: "Opening brace for case clause must be on a new line." },
            ],
            output: `
            switch (x)
            {
                case 1:
                {
                    break;
                }
            }
            `,
        },
    ],
});
