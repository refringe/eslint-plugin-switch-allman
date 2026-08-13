module.exports = {
    meta: {
        type: "layout",
        docs: {
            description:
                "Enforce Allman-style braces for switch case statements.",
            category: "Stylistic Issues",
            recommended: false,
        },
        fixable: "whitespace",
        schema: [],
    },
    create: function (context) {
        // `context.sourceCode` is ESLint 8.40+; fall back for the >=7 peer range.
        const sourceCode = context.sourceCode || context.getSourceCode();

        return {
            SwitchCase: function (node) {
                // Only a block that *is* the clause body counts. Reading forward
                // for the next "{" token would also match an object literal or a
                // brace belonging to a later clause.
                const body = node.consequent[0];
                if (!body || body.type !== "BlockStatement") {
                    return;
                }

                const caseKeyword = sourceCode.getFirstToken(node);
                const openingBrace = sourceCode.getFirstToken(body);

                if (caseKeyword.loc.end.line !== openingBrace.loc.start.line) {
                    return;
                }

                // Indentation is copied from the clause's own line rather than
                // computed, so tabs and existing width are preserved. Matching
                // leading whitespace also keeps `default:` working, which slicing
                // to `indexOf("case")` did not.
                const lineText =
                    sourceCode.lines[caseKeyword.loc.start.line - 1];
                const indentation = lineText.match(/^[\t ]*/)[0];

                context.report({
                    node: openingBrace,
                    message:
                        "Opening brace for case clause must be on a new line.",
                    fix: function (fixer) {
                        // Swallow the run of spaces/tabs before the brace so the
                        // trailing whitespace does not survive the line break.
                        let indexBeforeBrace = openingBrace.range[0];
                        while (
                            indexBeforeBrace > 0 &&
                            /[\t ]/.test(sourceCode.text[indexBeforeBrace - 1])
                        ) {
                            indexBeforeBrace--;
                        }

                        return fixer.replaceTextRange(
                            [indexBeforeBrace, openingBrace.range[0]],
                            `\n${indentation}`
                        );
                    },
                });
            },
        };
    },
};
