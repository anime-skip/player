import { openDB } from 'idb';
import { ExtensionIdb } from './schema';

export function openIdb(): Promise<ExtensionIdb> {
  return openDB('inspector', undefined, {
    upgrade(database) {
      const logs = database.createObjectStore('logs', { keyPath: 'id' });

      const network = database.createObjectStore('network', { keyPath: 'id' });
      network.createIndex('source', 'source');
      network.createIndex('tabId', 'tabId');
      network.createIndex('tabAndFrameId', ['tabId', 'frameId']);
    },
  });
}
