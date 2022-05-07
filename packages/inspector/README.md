# Inspector

Lots of Anime Sites don't allow opening dev tools, which can make it impossible to add support for them to the web extension.

This is a web extension that injects itself onto every tab, and lets you copy the DOM for every frame in those tabs.

## Get Started

Run the extension in your browser of choice

```bash
# Firefox
pnpm start

# Chrome
pnpm start:chrome
```

1. Navigate to your page
2. Right click and choose "Anime Skip: Grab DOM"
3. Click the clear button
4. Wait a second, and the buttons for the page you're trying to debug will show up
5. Click a button to copy it's HTML content to your clipboard

> Open tabs report their HTML contents every second, so you can clear the list if it gets too big
