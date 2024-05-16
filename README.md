# eslint-plugin-switch-allman

This ESLint plugin provides a linting rule to enforce Allman-style braces for `switch` `case` statements, ensuring that the opening brace is placed on a new line.

## Installation

Install the plugin with npm:

```bash
npm install eslint-plugin-switch-allman --save-dev
```

Note: You need to have ESLint installed on your project (version 7.0.0 or higher is recommended).

## Usage

After installation, add the plugin to your ESLint configuration file:

```json
{
    "plugins": ["switch-allman"],
    "rules": {
        "switch-allman/case-allman": "error"
    }
}
```

This sets up the `case-allman` rule to throw an error whenever the Allman brace style is not followed in a switch case statements.

## Rules

### `case-allman`

Enforces that opening braces for switch case statements must be on a new line.

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
