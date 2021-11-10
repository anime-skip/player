# Source Code Review

This is the document that contains all the necessary steps to building the submitted `.zip` file.

## Environment

- Linux: `ubuntu-20`
- pnpm: `npm i -g pnpm@6`
- Node: `v14.17.4`

## Build Process

`dist/` is what gets zipped and submitted.

```bash
# Prevent crash from husky
git init

# Install dependencies
pnpm i

# build dist/ directory
pnpm build
```
