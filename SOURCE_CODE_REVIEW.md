# Source Code Review

This is the document that contains all the necessary steps to building the submitted `.zip` file.

## Environment

- Linux
- Yarn: `v1.22.4`
- Node: `v13.8.0`

## Build Process

One major hickup in this is that I will soon use private NPM modules. Since I'm not going to be giving out the API key to access them, they will be included as gzips inside the `local_modules` folder of the `sources.zip` file that is submitted for review.

1. Replace `package.json` versions with local versions of the private modules
   > This will happen soon in the future, but this can be skipped this time
2. Install modules
   ```bash
   yarn install
   ```
3. Create `dist/` folder - this is what gets zipped and submitted
   ```bash
   yarn build:prod
   ```
