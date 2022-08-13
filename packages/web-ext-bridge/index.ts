import Browser, { Runtime } from 'webextension-polyfill';

interface Config {
  logger?: {
    debug(...args: any[]): void;
    log(...args: any[]): void;
    warn(...args: any[]): void;
    error(...args: any[]): void;
  };
}

// Use randomized keys so they don't conflict with payload-only types
export type ProtocolWithReturn<TData, TResponse> = { BtVgCTPYZu: TData; RrhVseLgZW: TResponse };

type GetData<T> = T extends ProtocolWithReturn<any, any> ? T['BtVgCTPYZu'] : T;
type GetResponse<T> = T extends ProtocolWithReturn<any, any> ? T['RrhVseLgZW'] : void;

interface Message<TProtocolMap, TKey extends keyof TProtocolMap> {
  data: GetData<TProtocolMap[TKey]>;
  sender: Runtime.MessageSender;
  timestamp: number;
}

type MaybePromise<T> = Promise<T> | T;

type OnMessageReceived<TProtocolMap, TKey extends keyof TProtocolMap> = (
  message: Message<TProtocolMap, TKey>
) => MaybePromise<GetResponse<TProtocolMap[TKey]>>;

export function createWebExtBridge<TProtocolMap>(config?: Config) {
  let rootListener:
    | undefined
    | ((message: any, sender: Browser.Runtime.MessageSender) => void | Promise<any>);
  let keyListeners: { [key in keyof TProtocolMap]?: Function } = {};

  function onMessage<TKey extends keyof TProtocolMap>(
    key: TKey,
    onReceived: OnMessageReceived<TProtocolMap, TKey>
  ) {
    if (rootListener == null) {
      config?.logger?.debug(
        `[web-ext-bridge] ${key as string} initialized message listener for this context`
      );
      rootListener = async (message, sender) => {
        if (typeof message.key != 'string' || typeof message.timestamp !== 'number') {
          const err = Error(
            `[web-ext-bridge] Unknown message format, must include the 'key' & 'timestamp' fields, received: ${JSON.stringify(
              message
            )}`
          );
          config?.logger?.error(err);
          throw err;
        }

        config?.logger?.debug('[web-ext-bridge] Received message', { key, message, sender });
        const entires = Object.entries(keyListeners) as Array<[keyof TProtocolMap, Function]>;
        for (const [key, listener] of entires) {
          if (message.key !== key) continue;
          try {
            const res = await listener({
              data: message.data,
              sender: sender,
              timestamp: message.timestamp,
            });
            return { res };
          } catch (err) {
            let message: string;
            if (err instanceof Error) message = err.message;
            else message = String(err);
            return { err: message };
          }
        }

        const err = Error(`[web-ext-bridge] No listener setup for ${key as string}`);
        config?.logger?.warn(err);
        throw err;
      };
      Browser.runtime.onMessage.addListener(rootListener);
    }

    if (keyListeners[key] != null) {
      const err = Error(
        `[web-ext-bridge] In this JS context, only one listener can be setup for ${key as string}`
      );
      config?.logger?.error(err);
      throw err;
    }
    keyListeners[key] = onReceived;
  }

  async function sendMessage<TKey extends keyof TProtocolMap>(
    key: TKey,
    data: GetData<TProtocolMap[TKey]>,
    tabId?: number
  ): Promise<GetResponse<TProtocolMap[TKey]>> {
    const message = { key, data, timestamp: Date.now() };
    config?.logger?.debug('[web-ext-bridge] Sending -->', message);

    let response;
    if (tabId == null) response = await Browser.runtime.sendMessage(message);
    else response = await Browser.tabs.sendMessage(tabId, message);

    const { res, err } = response ?? { err: 'No response' };
    config?.logger?.debug('[web-ext-bridge] Received <--', { res, err });
    if (err != null) throw Error(err);
    return res;
  }

  return { onMessage, sendMessage };
}
