const RuleTester = require("eslint").RuleTester;
const rule = require("../lib/rules/switch-allman");

const ERROR = "Opening brace for case clause must be on a new line.";

const ruleTester = new RuleTester();
ruleTester.run("switch-allman", rule, {
    valid: [
        // Brace already on its own line.
        `
        switch (x)
        {
            case 1:
            {
                break;
            }
        }
        `,
        // No block at all.
        `
        switch (x)
        {
            case 1:
                break;
        }
        `,
        // Empty clause: consequent[0] is undefined.
        `
        switch (x)
        {
            case 1:
        }
        `,
        // Comment between the colon and a correctly placed brace.
        `
        switch (x)
        {
            case 1: // comment
            {
                break;
            }
        }
        `,
        // default with the brace on its own line.
        `
        switch (x)
        {
            default:
            {
                break;
            }
        }
        `,
        // Fallthrough: the empty clause must not be blamed for the next
        // clause's brace, and the next clause's brace is correctly placed.
        `
        switch (x)
        {
            case 1:
            case 2:
            {
                break;
            }
        }
        `,
        // A non-block consequent is ignored even when it contains a brace on
        // the clause line. Reading forward for the next "{" token reported here.
        `
        switch (x)
        {
            case 1:
                foo({ a: 1 });
        }
        `,
        // Same, with the call on the clause line itself.
        `
        switch (x)
        {
            case 1: foo({ a: 1 });
        }
        `,
        // Object literal in a clause whose block is already correct: the
        // literal's brace must not be mistaken for the clause's brace.
        `
        switch (x)
        {
            case 1:
            {
                foo({ a: 1 });
                break;
            }
        }
        `,
        // No switch statement at all.
        `
        const x = { a: 1 };
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
            errors: [{ message: ERROR }],
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
        {
            // Comment before the brace is preserved in place.
            code: `
            switch (x)
            {
                case 1: /* comment */ {
                    break;
                }
            }
            `,
            errors: [{ message: ERROR }],
            output: `
            switch (x)
            {
                case 1: /* comment */
                {
                    break;
                }
            }
            `,
        },
        {
            // default: previously fixed to a brace at column 0, because the
            // indentation was sliced with indexOf("case").
            code: `
            switch (x)
            {
                default: {
                    break;
                }
            }
            `,
            errors: [{ message: ERROR }],
            output: `
            switch (x)
            {
                default:
                {
                    break;
                }
            }
            `,
        },
        {
            // Brace directly against the colon: no whitespace to swallow.
            code: `
            switch (x)
            {
                case 1:{
                    break;
                }
            }
            `,
            errors: [{ message: ERROR }],
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
        {
            // Empty block still reports.
            code: `
            switch (x)
            {
                case 1: {}
            }
            `,
            errors: [{ message: ERROR }],
            output: `
            switch (x)
            {
                case 1:
                {}
            }
            `,
        },
        {
            // Every offending clause in one switch reports independently.
            code: `
            switch (x)
            {
                case 1: {
                    break;
                }
                case 2: {
                    break;
                }
                default: {
                    break;
                }
            }
            `,
            errors: [
                { message: ERROR },
                { message: ERROR },
                { message: ERROR },
            ],
            output: `
            switch (x)
            {
                case 1:
                {
                    break;
                }
                case 2:
                {
                    break;
                }
                default:
                {
                    break;
                }
            }
            `,
        },
        {
            // Nested switch: the inner clause is fixed at its own indentation.
            code: `
            switch (x)
            {
                case 1:
                {
                    switch (y)
                    {
                        case 2: {
                            break;
                        }
                    }
                }
            }
            `,
            errors: [{ message: ERROR }],
            output: `
            switch (x)
            {
                case 1:
                {
                    switch (y)
                    {
                        case 2:
                        {
                            break;
                        }
                    }
                }
            }
            `,
        },
        {
            // Tab indentation is reproduced rather than normalised to spaces.
            code: "switch (x)\n{\n\tcase 1: {\n\t\tbreak;\n\t}\n}\n",
            errors: [{ message: ERROR }],
            output: "switch (x)\n{\n\tcase 1:\n\t{\n\t\tbreak;\n\t}\n}\n",
        },
        {
            // Clause at column 0 gets an empty indent, not a stray one.
            code: "switch (x)\n{\ncase 1: {\nbreak;\n}\n}\n",
            errors: [{ message: ERROR }],
            output: "switch (x)\n{\ncase 1:\n{\nbreak;\n}\n}\n",
        },
        {
            // A block followed by further statements is still the clause body.
            code: `
            switch (x)
            {
                case 1: {
                    foo();
                }
                break;
            }
            `,
            errors: [{ message: ERROR }],
            output: `
            switch (x)
            {
                case 1:
                {
                    foo();
                }
                break;
            }
            `,
        },
    ],
});
