import { DBSchema, IDBPDatabase } from 'idb';

export interface IdbDatabaseSchema extends DBSchema {
  logs: {
    key: string;
    value: unknown;
  };
  network: {
    key: string;
    value: NetworkRequest;
    indexes: {
      source: 'source';
      tabId: 'tabId';
      tabAndFrameId: ['tabId', 'frameId'];
    };
  };
}

export type ExtensionIdb = IDBPDatabase<IdbDatabaseSchema>;
