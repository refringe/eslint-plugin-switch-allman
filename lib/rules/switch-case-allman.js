const { getTokensBetween } = require("eslint-utils");

module.exports = {
    meta: {
        type: "layout",
        docs: {
            description:
                "Enforce Allman-style braces for switch case statements.",
            category: "Stylistic Issues",
            recommended: false,
        },
        fixable: "code",
        schema: [],
    },
    create: function (context) {
        return {
            SwitchCase: function (node) {
                let sourceCode = context.getSourceCode();
                let caseKeyword = sourceCode.getFirstToken(node);
                let openingBrace = sourceCode.getTokenAfter(
                    caseKeyword,
                    (token) => token.value === "{"
                );

                if (
                    openingBrace &&
                    caseKeyword.loc.end.line === openingBrace.loc.start.line
                ) {
                    const lineText =
                        sourceCode.lines[caseKeyword.loc.start.line - 1];
                    const indentation = lineText.substring(
                        0,
                        lineText.indexOf("case")
                    );

                    context.report({
                        node: openingBrace,
                        message:
                            "Opening brace for case clause must be on a new line.",
                        fix: function (fixer) {
                            // Find the index of the last non-space character before the opening brace
                            let indexBeforeBrace = openingBrace.range[0] - 1;
                            while (sourceCode.text[indexBeforeBrace] === " ") {
                                indexBeforeBrace--;
                            }

                            return fixer.replaceTextRange(
                                [indexBeforeBrace + 1, openingBrace.range[0]], // This will remove any spaces after the last non-space character up to the brace
                                `\n${indentation}`
                            );
                        },
                    });
                }
            },
        };
    },
};
