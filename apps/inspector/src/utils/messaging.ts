import { defineExtensionMessaging } from '@webext-core/messaging';
import { LocalNetworkRequest } from './network-repo';

export interface ProtocolMap {
  saveNetworkRequest(request: LocalNetworkRequest): Promise<void>;
  listNetworkRequests(): Promise<NetworkRequest[]>;
  getNetworkRequest(
    id: NetworkRequest['id'],
  ): Promise<NetworkRequest | undefined>;
}

export const messaging = defineExtensionMessaging<ProtocolMap>();
