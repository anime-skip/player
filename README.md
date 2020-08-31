# Anime Skip - Web Extension

Inject a custom player over the top of the certain web players (`VRV`, `Funimation`, more to come).

## Development

```bash
yarn install

# Run in dev mode (local backend)
yarn start
# Run against production
yarn start:prod

# Linting
yarn lint
yarn prettier
yarn prettier:write
```

This will install and open Firefox. To open another browser, more changes will have to be made.

## Deployment

To package the application, run `yarn package`.

> Make sure you have the .env file present with the signing config, it should look something like this:
>
> ```bash
> export FIREFOX_SIGNING_ISSUER="..."
> export FIREFOX_SIGNING_SECRET="..."
> export FIREFOX_SIGNING_ID="..."
>
> export CHROME_CLIENT_ID="..."
> export CHROME_CLIENT_SECRET="..."
> export CHROME_REFRESH_TOKEN="..."
> export CHROME_APP_ID="..."
> ```

To moniter deployments, go to the consoles:

- [Chrome Web Store](https://chrome.google.com/webstore/devconsole/331629b9-cf31-4391-ad30-77dd0a36958d?hl=en)
- [Firefox Add-On Developer Hub](https://addons.mozilla.org/en-US/developers/addons)
- ~~Edge~~ - [TODO](https://docs.microsoft.com/en-us/microsoft-edge/extensions-chromium/publish/publish-extension)
- ~~Opera~~ - [TODO](https://dev.opera.com/extensions/publishing-guidelines/)

> Chrome is fully automated when running the `yarn deploy` command. Firefox does not support full automation yet, but the command will upload the `xpi` file so that you just need to fill out the release info then manually release it.
>
> In the future, `yarn deploy` will be ran when pushing a tag to github

### Developing with a Firefox Profile

When running `yarn start` and `yarn start:prod`, it will normally open in a "private" firefox window. If you want all your user preferences, addons, history, etc, you need to setup the command to run on a Firefox Profile.

Add a `.env.firefox` file to the project root, next to the `.env` file. It should contain the path to your profile (found at <about:profile>):

```
BROWSER_PROFILE_PATH=/home/aklinker1/.mozilla/firefox/lrgdkj3i.default-release
```
