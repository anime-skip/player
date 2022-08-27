# Anime Skip Player Web Extension

- [Chrome Web Store](https://chrome.google.com/webstore/devconsole/331629b9-cf31-4391-ad30-77dd0a36958d?hl=en)
- [Firefox Add-On Developer Hub](https://addons.mozilla.org/en-US/developers/addons)

> When developing or contributing to the extension, it's recommended to run the extension on Firefox, the experience is much better than Chrome.

<br/>

## Development

You will need to install:

- `node` (any version >= 16)
  - [Manual install](https://nodejs.org)
  - Via [`nvm`](https://github.com/nvm-sh/nvm): `nvm install 14`
- `pnpm` v7
  - [Manual install](https://pnpm.io/)
  - Via `npm`: `npm i -g pnpm`

Then install the dependencies:

```bash
pnpm i
```

### Running Locally

This extension is firefox first because I (Aaron) use Firefox. Just add the `:chrome` suffix to any command to run it for Google Chrome.

They're similar enough that you can develop for either once you understand the differences.

```bash
# Start in Firefox
pnpm dev
# Start in Chrome
pnpm dev:chrome
```

> **WSL2 users**, you won't be able to run the dev commands, I would recommend either using the CMD/Powershell or [configure Vite to not open the browser and install the extension manually](https://github.com/aklinker1/vite-plugin-web-extension/pull/12).
>
> https://github.com/mozilla/web-ext/issues/2108

If the dev commands don't work, you can also build and install it the old fasion way:

1. Build the extension
   ```bash
   pnpm build
   # or
   pnpm build:chrome
   ```
2. Install the `dist/` directory manually from the browser's extensions page ([Firefox](https://extensionworkshop.com/documentation/develop/temporary-installation-in-firefox/), [Chrome](https://developer.chrome.com/docs/extensions/mv3/getstarted/#unpacked))

#### Configuration

You can create a `.env` file in the `packages/web-extension` directory to configure how the extension runs.

Below is a list of all the options and what they do:

```bash
# Configure which API to use (default: "test")
#  - prod: https://api.anime-skip.com/graphql
#  - test: http://test.api.anime-skip.com/graphql
#  - local: http://localhost:8081/graphql
VITE_API_ENV="prod|test|local"
```

#### Build Modes

You can use [Vite's build modes](https://vitejs.dev/guide/env-and-mode.html) to build the project for different targets with different behaviors:

```bash
vite build --mode development # Print logs, NOT minimized
vite build --mode production  # Don't print logs, minimized
```
