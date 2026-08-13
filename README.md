# eslint-plugin-switch-allman

This ESLint plugin provides a linting rule to enforce Allman-style braces for `switch` `case` statements, ensuring that the opening brace is placed on a new line.

## Installation

Install the plugin with npm:

```bash
npm install eslint-plugin-switch-allman --save-dev
```

Note: You need to have ESLint installed on your project (version 7.0.0 or higher is recommended).

## Usage

After installation, add the plugin to your ESLint configuration file.

Flat config (`eslint.config.js`, ESLint 9 and later):

```javascript
const switchAllman = require("eslint-plugin-switch-allman");

module.exports = [
    {
        plugins: { "switch-allman": switchAllman },
        rules: {
            "switch-allman/switch-allman": "error",
        },
    },
];
```

Legacy config (`.eslintrc.json`):

```json
{
    "plugins": ["switch-allman"],
    "rules": {
        "switch-allman/switch-allman": "error"
    }
}
```

This sets up the `switch-allman` rule to throw an error whenever the Allman brace style is not followed in a switch case statements.

## Rules

### `switch-allman`

Enforces that opening braces for switch case statements must be on a new line. Applies to
`default` clauses as well as `case` clauses, and is autofixable.

Valid Example

```javascript
switch (x) {
    case 1:
    {
        break;
    }
}
```

Invalid Example

```javascript
switch (x) {
    case 1: {
        break;
    }
}
```

## Contributing

Contributions to enhance the rules or add new ones are welcome. Please ensure you update tests as appropriate.

## License

Distributed under the MIT License.
