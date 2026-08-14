const js = require('@eslint/js');
const globals = require('globals');
const switchAllman = require('./lib');

module.exports = [
    {
        ignores: ['coverage/', 'node_modules/'],
    },
    js.configs.recommended,
    {
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'commonjs',
            globals: {
                ...globals.node,
            },
        },
        plugins: {
            'switch-allman': switchAllman,
        },
        rules: {
            // The plugin lints itself with its own rule.
            'switch-allman/switch-allman': 'error',
        },
    },
    {
        files: ['tests/**/*.js'],
        languageOptions: {
            globals: {
                ...globals.mocha,
            },
        },
    },
];
