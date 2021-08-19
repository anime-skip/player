# Anime Skip Player Web Extension

Inject a custom player over the top of the certain web players (`VRV`, `Funimation`, more to come).

- [Chrome Web Store](https://chrome.google.com/webstore/devconsole/331629b9-cf31-4391-ad30-77dd0a36958d?hl=en)
- [Firefox Add-On Developer Hub](https://addons.mozilla.org/en-US/developers/addons)
- ~~Edge~~ - [TODO](https://docs.microsoft.com/en-us/microsoft-edge/extensions-chromium/publish/publish-extension)
- ~~Opera~~ - [TODO](https://dev.opera.com/extensions/publishing-guidelines/)

## System Requirements

- `firefox` binary in path (ie: `which firefox` finds the Firefox executable)
- `chrome` binary in path (ie: `which chrome` finds the Chrome/Chromium executable)
- `docker` to run supporting services (backend, fake streaming service, DB, etc)
- `node` &ge; 14
- `pnpm` for the package manager

## Package Structure

Hover over filenames to see description

- [`extension/`](# 'The build directory that all the extension is output to. This is the directory that gets zipped up and published')
  - [`assets/`](# 'Any static assets, like images, that the extension consumes')
  - [**`manifest.json`**](# 'This is the final manifest file that is generated during the build process')
  - [`*`](# 'All other outputs by vite are output here')
- [`scripts/`](# "Any useful files needed to develop the extension, but aren't apart of the packaged extension")
- [`src/`](# 'Directory containing all code that will end up in the packaged extension')
  - [`@types/`](# 'Global types for the extension')
  - [`background/`](# 'All the different background scripts')
  - [`common/`](# 'Any shared or common utilities')
  - [`content-scripts/`](# 'Any JS that is injected into webpages')
  - [`views/`](# 'Regular, front-end styled webpages that are entrypoints, like the popup and options pages')
  - [**`manifest.template.json`**](# 'Template for the extension/manifest.json. This file includes all the browser specific flags that will be stripped out by manifest.ts')
  - [**`manifest.ts`**](# 'Parse the manifest.template.ts, strip out browser specific code for other browsers, and append all the content scripts, background, and views to the template')
- [`vite/`](# 'Any custom vite plugins or tools')
  - [**`plugin-assets-rewrite.ts`**](# 'Rewires all the asset paths in the output files to match the path changes when they are in the extension/ folder compared to the src/ folder')
  - [**`plugin-web-ext.ts`**](# 'Hook up the web-ext tool to reload the extension when a file changes')
- [**`vite.build.ts`**](# 'CLI application that performs the builds for views, background scripts, and content scripts')

## Development

This project uses `pnpm` as the package manager

```bash
pnpm install

# Run in dev mode against local services
pnpm start

# Run against staging environment with real data
BUILD_MODE=staging pnpm start

# Run in chrome
pnpm start-chrome
BUILD_MODE=staging pnpm start-chrome
```

Other useful commands

```bash
pnpm lint
pnpm format
pnpm test
pnpm test:watch
```

# Deployments

All deployments are done automatically via a github action.
