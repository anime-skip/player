import readline from 'readline';
import { zipSources } from './package/zipSources';
import { rootPath } from './utils';

async function zip() {
  zipSources(rootPath('artifacts')).catch(console.error);
}

if (!process.env.NODE_AUTH_TOKEN) {
  const reader = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false,
  });
  process.stdout.write('From ~/.npmrc, enter your auth token:\nnpm.pkg.github.com/:_authToken=');
  reader.on('line', line => {
    process.env.NODE_AUTH_TOKEN = line;
    zip();
    reader.close();
  });
} else {
  zip();
}
