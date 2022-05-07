# Source Code Review

This is the document that contains all the necessary steps to building the submitted `.zip` file.

## Environment

- Linux: `ubuntu-20`
- pnpm: `npm i -g pnpm@6`
- Node: `v16.15.0`

## Build Process

`packages/web-extension/dist/` is what gets zipped and submitted.

```bash
# Prevent crash from husky
git init

# Install dependencies
pnpm i

# build dist/ directory
cd packages/web-extension
pnpm build
```
