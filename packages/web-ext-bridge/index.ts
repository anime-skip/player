import Browser, { Runtime } from 'webextension-polyfill';

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

export function createWebExtBridge<TProtocolMap>() {
  let rootListener:
    | undefined
    | ((message: any, sender: Browser.Runtime.MessageSender) => void | Promise<any>);
  let keyListeners: { [key in keyof TProtocolMap]?: Function } = {};

  function onMessage<TKey extends keyof TProtocolMap>(
    key: TKey,
    onReceived: OnMessageReceived<TProtocolMap, TKey>
  ) {
    if (rootListener == null) {
      rootListener = async (message, sender) => {
        if (typeof message.key != 'string' || typeof message.timestamp !== 'number')
          throw Error(
            `Unknown message format, must include the 'key' field, received: ${JSON.stringify(
              message
            )}`
          );
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
      };
      Browser.runtime.onMessage.addListener(rootListener);
    }
    if (keyListeners[key] != null)
      throw Error(`You can only setup one listener for ${key as string} in this JS context`);
    keyListeners[key] = onReceived;
  }

  async function sendMessage<TKey extends keyof TProtocolMap>(
    key: TKey,
    data: GetData<TProtocolMap[TKey]>,
    tabId?: number
  ): Promise<GetResponse<TProtocolMap[TKey]>> {
    const message = { key, data, timestamp: Date.now() };

    let response;
    if (tabId == null) response = await Browser.runtime.sendMessage(message);
    else response = await Browser.tabs.sendMessage(tabId, message);

    const { res, err } = response ?? { err: 'No response' };
    if (err != null) throw Error(err);
    return res;
  }

  return { onMessage, sendMessage };
}
