# Source Code Review

This is the document that contains all the necessary steps to building the submitted `.zip` file.

## Environment

- Linux: `ubuntu-20`
- Yarn: `v1.22.4`
- Node: `v14.15.3`

## Build Process

```bash
yarn install
yarn build --mode prod
```

> The `dist/` folder created during `build` is what gets zipped and submitted
