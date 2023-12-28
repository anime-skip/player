export interface NetworkRepo {
  upsert(request: NetworkRequest): Promise<void>;
  list(): Promise<NetworkRequest[]>;
  get(id: NetworkRequest['id']): Promise<NetworkRequest | undefined>;
}

export interface NetworkRequest {
  id: string;
  tabId: number;
  frameId: number;
  source: 'fetch' | 'xhr';
  from: string;
  request: {
    date: number;
    url: string;
    method: string;
    body: string;
    headers: Record<string, string[]>;
  };
  response?: {
    date: number;
    duration: number;
    status: number;
    statusText: string;
    headers: Record<string, string[]>;
    body: string;
  };
}

export type LocalNetworkRequest = Omit<NetworkRequest, 'tabId' | 'frameId'>;
