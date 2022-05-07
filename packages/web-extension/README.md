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

```bash
cd packages/web-extension

# Start in Firefox
pnpm start
# Start in Chrome
pnpm start:chrome
```

> **WSL2 users**, you won't be able to run the start commands, I would recommend either using the CMD/Powershell or [configuring Vite to not open the browser and install the extension manually](https://github.com/aklinker1/vite-plugin-web-extension/pull/12).
>
> https://github.com/mozilla/web-ext/issues/2108

### Backend Devs Only

To run the extension against a local version of the backend, use `pnpm dev` instead of `pnpm start`. You'll also need to install:

- `docker` to run the backend
- `docker-compose` installed (or aliased to `docker compose` on versions of docker that ship with compose)
