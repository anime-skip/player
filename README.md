# Anime Skip Player

Monorepo for the Anime Skip Player, includes the player UI, web extension, and (maybe in the future) an embedded player other websites can use.

## Setup

1. Install NodeJS LTS
2. Install PNPM: `corepack enable`

```sh
pnpm i
```

To develop the player's UI:

```sh
cd packages/player
pnpm dev
```

To develop the web extension:

```sh
cd apps/extension
pnpm dev
```
