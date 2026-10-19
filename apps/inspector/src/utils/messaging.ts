import { defineExtensionMessaging } from '@webext-core/messaging';

import type { LocalNetworkRequest } from './network-repo';

export interface ProtocolMap {
  saveNetworkRequest(request: LocalNetworkRequest): Promise<void>;
  listNetworkRequests(): Promise<NetworkRequest[]>;
  getNetworkRequest(
    id: NetworkRequest['id'],
  ): Promise<NetworkRequest | undefined>;
  getTabs(): Array<{
    tab: Browser.tabs.Tab;
    frames: Browser.webNavigation.GetAllFrameResultDetails[];
  }>;
  getFrameHtml(options: {
    tabId: number | undefined;
    targetUrl: string | undefined;
  }): string;
  getFrameBodyInnerHtml(options: {
    tabId: number | undefined;
    targetUrl: string | undefined;
  }): string;
}

export const messaging = defineExtensionMessaging<ProtocolMap>();
