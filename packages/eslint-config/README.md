# `@tome/eslint-config`

Shared ESLint configurations for the Tome workspace, ensuring consistent code quality across all packages and apps.

## Available Modules

- `@tome/eslint-config/base`: Standard linting rules for TypeScript projects.
- `@tome/eslint-config/react-internal`: Rules for internal React component packages.

## Integration Example

Add the configuration to your `eslint.config.mjs` or `.eslintrc.json`:

```mjs
import { nextJsConfig } from "@tome/eslint-config/next-js"

/** @type {import("eslint").Linter.Config[]} */
export default [
  ...nextJsConfig,
  // Your custom rules
]
```
