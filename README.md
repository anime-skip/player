# Anime Skip Player

Monorepo for the Anime Skip Player, the web extension and embedded player.

## V2 Checklist

- [x] Basic player controls (play/pause, volume controls, fullscreen, etc)
- [x] Fetch and display existing timestamps
- [x] Local settings
  - [ ] Autoskip
  - [ ] Skipped sections
  - [ ] Playback rate
  - [ ] Service settings
  - [ ] Watched timestamps
  - [x] Theme
  - [ ] Hide timeline when minimized
  - [ ] Minimize while editing
  - [ ] Snap to nearest 0.5s when creating timestamp
- [ ] Keyboard shortcuts
- [x] Sync remote settings
- [ ] Screenshots
- [ ] Timeline hover (show hovered time and timestamp type)
- [ ] Templates
- [ ] Edit timestamps
- [ ] Save timestamps

## Setup

1. Install NodeJS LTS
2. Install PNPM: `corepack enable`

> Info: This project uses `unplugin-auto-import`, so you may not see import for common fucntions. See each package/apps's vite.config.ts for a list of packages and directories that are auto-imported.
