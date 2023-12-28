# Anime Skip Player Chrome Extension

This is the app containing all the code for the Anime Skip Player Chrome Extension.

```sh
# Run extension against test.api.anime-skip.com
pnpm dev

# Run extension against api.anime-skip.com
pnpm dev:prod
```

## Adding a Service

To add support for another website, follow these steps:

1. Identify all the "helper" URLs
   - These are the URLs in the search box that you visit when watching a video
   - Ex: For Crunchyroll, it's `*://www.crunchyroll.com/*`
2. Identify all the "player" URLs
   - These are the URLs of the frame containing the video element used to play the episode. It might be in an iframe, or it might be the same as the helper domains.
   - Ex: For Crunchyroll, it's `*://static.crunchyroll.com/vilos-v2/web/vilos/player.html`
3. Use the helper and player URLs to create two new content scripts: `src/entrypoints/<service-name>-helper.ts` and `src/entrypoints/<service-name>-player.ts`
   - See other content scripts for help filling these out.
4. If either of the webpages (helper or player URLs) include keyboard shortcuts to interact with their built-in player, they need to be disabled. Add the URLs with shortcuts to the `src/entrypoints/keydown-blocker.content.ts` `matches` array.

And... you're done! Step 3 is very big, and filling out the player options correctly is difficult.
