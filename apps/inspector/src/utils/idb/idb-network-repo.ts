import { NetworkRepo } from '../network-repo';
import { ExtensionIdb } from './schema';

export function createIdbNetworkRepo(idb: Promise<ExtensionIdb>): NetworkRepo {
  return {
    async get(id) {
      try {
        return await (await idb).get('network', id);
      } catch {
        return undefined;
      }
    },
    async list() {
      return await (await idb).getAll('network');
    },
    async upsert(request) {
      await (await idb).put('network', request);
    },
  };
}
