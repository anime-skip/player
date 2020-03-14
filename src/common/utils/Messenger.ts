export default class Messenger {
  public listeners?: MessageListeners;

  public constructor() {
    // @ts-ignore
    browser.runtime.onMessage.addListener(this.onReceiveMessage);
    // console.log('initialized messenger');
  }

  public send = async <T extends MessageType>(
    type: T,
    payload: MessagePayload[T]
  ): Promise<MessageResponse[T]> => {
    // @ts-ignore
    const response = await browser.runtime.sendMessage({
      type,
      payload,
    });
    return response;
  };

  public on = (listeners: MessageListeners): void => {
    this.listeners = listeners;
  };

  private onReceiveMessage = async <T extends MessageType>({
    type,
    payload,
  }: {
    type: MessageType;
    payload: MessagePayload[T];
  }): Promise<any> => {
    console.log('Received Message', { type, payload });
    if (!this.listeners) return;

    const callback = (this.listeners[type] as unknown) as MessageListener<T>;
    if (callback) {
      const response = await callback(payload as MessagePayload[T]);
      console.log('sendResponse', { response });
      return response;
    }
    return undefined;
  };
}
