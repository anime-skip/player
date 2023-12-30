import { defineExtensionMessaging } from '@webext-core/messaging';
import { LocalNetworkRequest } from './network-repo';
import { Tabs, WebNavigation } from 'wxt/browser';

export interface ProtocolMap {
  saveNetworkRequest(request: LocalNetworkRequest): Promise<void>;
  listNetworkRequests(): Promise<NetworkRequest[]>;
  getNetworkRequest(
    id: NetworkRequest['id'],
  ): Promise<NetworkRequest | undefined>;
  getTabs(): Array<{
    tab: Tabs.Tab;
    frames: WebNavigation.GetAllFramesCallbackDetailsItemType[];
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
