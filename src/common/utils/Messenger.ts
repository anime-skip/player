export default class Messenger<
  K extends MessageTypes = MessageTypes,
  L extends MessageListenerMap<K> = MessageListenerMap<K>,
  P extends MessagePayloadMap<K> = MessagePayloadMap<K>,
  R extends MessageResponseMap<K> = MessageResponseMap<K>
> {
  public listeners?: L;
  public forwardTypes?: string[];
  public source: string;

  public constructor(source: string, listeners?: L, forwardTypes?: string[]) {
    this.listeners = listeners;
    this.source = source;
    this.forwardTypes = forwardTypes;

    if (listeners != null || forwardTypes != null) {
      // @ts-ignore
      browser.runtime.onMessage.addListener(this.onReceiveMessage);
      console.log(`Started ${source} messenger`);
    }
  }

  public send = async <T extends AllMessageTypes>(
    type: T,
    payload: AllMessagePayloads[T],
    tabId?: number
  ): Promise<AllMessageResponses[T]> => {
    let response;
    if (tabId != null) {
      response = await browser.tabs.sendMessage(tabId, {
        type,
        payload,
      });
    } else {
      response = await browser.runtime.sendMessage({
        type,
        payload,
      });
    }
    if (response?.errorMessage != null) {
      throw Error(response.errorMessage);
    }
    console.log(this.source + ' got response', { type, payload, response });
    return response;
  };

  private onReceiveMessage = async (
    { type, payload }: { type: K; payload: P[K] },
    sender: browser.runtime.MessageSender
  ): Promise<R[K] | void> => {
    console.log(
      'Received Message on ' + this.source,
      { type, payload },
      { listeners: this.listeners }
    );
    if (!this.listeners) return;

    const callback = (this.listeners[type] as unknown) as MessageListener<K>;
    if (callback) {
      let response;
      try {
        response = await callback(payload);
      } catch (error) {
        response = { errorMessage: error.message };
      }
      console.log('sendResponse', { response });
      return response;
    } else if (sender.tab?.id != null && this.forwardTypes?.includes(type)) {
      return this.send(type, payload, sender.tab.id);
    }
    return;
  };
}
