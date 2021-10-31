# Anime Skip Player Web Extension

Inject a custom player over the top of the certain web players (`VRV`, `Funimation`, more to come).

- [Chrome Web Store](https://chrome.google.com/webstore/devconsole/331629b9-cf31-4391-ad30-77dd0a36958d?hl=en)
- [Firefox Add-On Developer Hub](https://addons.mozilla.org/en-US/developers/addons)
- ~~Edge~~ - [TODO](https://docs.microsoft.com/en-us/microsoft-edge/extensions-chromium/publish/publish-extension)
- ~~Opera~~ - [TODO](https://dev.opera.com/extensions/publishing-guidelines/)

<br/>

## Contributing

See the [contributing guidelines](https://github.com/anime-skip/docs/wiki) for all of Anime Skip

**It's recommended develop the extension on Firefox**, the experience is much better than Chrome. Chrome doesn't reload the player when saving a file, firefox does

<br/>

## Additional System Requirements

- `firefox` binary in path (ie: `which firefox` finds the Firefox executable/alias)
- `chrome` binary in path (ie: `which chrome` finds the Chrome/Chromium executable/alias)

> Windows users, sorry I have no idea... If something is wrong it will fail when starting the extension in watch mode

### Backend Devs Only

- `docker` to run supporting services (backend, fake streaming service, DB, etc)
- `docker-compose` installed or aliased to `docker compose`

<br/>

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

<br/>

## Development

This project uses `pnpm` as the package manager

```bash
pnpm install

# Start Firefox and watch for changes
pnpm start

# Start Chrome and watch for changes
pnpm start:chrome
```

Other useful commands

```bash
pnpm lint
pnpm format
pnpm test
pnpm test:watch
```

### Using Browser Profiles

By default, the browser creates a new "profile" to run the extension in when you use `pnpm start`/`pnpm start:chrome`.

If you want to use your own profile with passwords, history, sessions, etc, you'll need to create a `.env` file at the project root and make it include the paths to your default profile:

```env
BUILD_FIREFOX_PROFILE=/path/to/.mozilla/firefox/<profile>.default

BUILD_CHROMIUM_PROFILE=/path/to/.config/google-chrome/Default
BUILD_CHROMIUM_EXECUTABLE=/opt/google/chrome/chrome
```

> See the [`web-ext` command reference](https://extensionworkshop.com/documentation/develop/web-ext-command-reference/) and search for "profile" for more details

### Backend Devs Only

You can use the following commands to spin up the extension along with a local version of the backend at the same time:

```bash
pnpm dev
pnpm dev:chrome
```

Make sure to copy `docker/backend.env.template` &rarr; `docker/backend.env` before running these commands.
