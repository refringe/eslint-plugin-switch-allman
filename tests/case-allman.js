const RuleTester = require("eslint").RuleTester;
const rule = require("../lib/rules/switch-case-allman");

const ruleTester = new RuleTester();
ruleTester.run("switch-case-allman", rule, {
    valid: [
        `
        switch (x)
        {
            case 1:
            {
                break;
            }
        }
        `,`
        switch (x)
        {
            case 1:
                break;
        }
        `,`
        switch (x)
        {
            case 1:
        }
        `,`
        switch (x)
        {
            case 1: // comment
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
            errors: [{ message: "Opening brace for case clause must be on a new line." }],
            output: `
            switch (x)
            {
                case 1:
                {
                    break;
                }
            }
            `
        },
        {
            code: `
            switch (x)
            {
                case 1: /* comment */ {
                    break;
                }
            }
            `,
            errors: [{ message: "Opening brace for case clause must be on a new line." }],
            output: `
            switch (x)
            {
                case 1: /* comment */
                {
                    break;
                }
            }
            `
        },
    ],
});
