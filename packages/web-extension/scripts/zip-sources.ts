import { zipSources } from './package/zipSources';
import { rootPath } from './utils';

async function zip() {
  zipSources(rootPath('artifacts')).catch(console.error);
}

zip();
