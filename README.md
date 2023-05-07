# Anime Skip Player

Monorepo for the Anime Skip Player, the web extension and embedded player.

## V2 Checklist

- [x] Basic player controls (play/pause, volume controls, fullscreen, etc)
- [x] Fetch and display existing timestamps
- [x] Local settings
- [x] Edit keyboard shortcuts
- [x] Implement keyboard shortcut actions
- [x] Sync remote settings
- [x] Timeline hover (show hovered time and timestamp type)
- [x] Edit timestamps
- [x] Raise timestamp ticks when editing and hovering
- [x] Timestamp colors
- [x] Auto-connect exact matches
- [x] Save timestamps
- [x] Timestamp offsets
- [x] In-place timestamp type editing
- [ ] Templates

## Setup

1. Install NodeJS LTS
2. Install PNPM: `corepack enable`

> Info: This project uses `unplugin-auto-import`, so you may not see import for common fucntions. See each package/apps's vite.config.ts for a list of packages and directories that are auto-imported.

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
