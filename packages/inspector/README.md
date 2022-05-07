# Inspector

Lots of Anime Sites don't allow opening dev tools, which can make it impossible to add support for them to the web extension.

This is a web extension that injects itself onto every tab, and lets you view the current state of the DOM for every frame on the tab.

## Get Started

Build the extension and load the `dist/` directory into your browser.

```bash
pnpm build
```

Go to the page you'd like to look at the DOM for, and right click. There should be an option "Anime Skip: Grab Dom"
