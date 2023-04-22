import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import webExtension, { readJsonFile } from 'vite-plugin-web-extension';

function generateManifest() {
  const manifest = readJsonFile('src/manifest.json');
  const { version, name, description } = readJsonFile('package.json');
  const shortVersion = version.match('^(.+)-')?.[1] ?? version;
  return {
    name,
    description,
    version: shortVersion,
    version_long: version,
    ...manifest,
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    webExtension({
      manifest: generateManifest,
      watchFilePaths: ['package.json', 'src/manifest.json'],
    }),
  ],
});
