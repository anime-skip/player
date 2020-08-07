export default class Messenger {
  public listeners?: MessageListeners;
  public source: string;

  public constructor(source: string, listeners?: MessageListeners) {
    this.listeners = listeners;
    this.source = source;
    // @ts-ignore
    browser.runtime.onMessage.addListener(this.onReceiveMessage);
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
    if (response.errorMessage != null) {
      throw Error(response.errorMessage);
    }
    return response;
  };

  private onReceiveMessage = async <T extends MessageType>({
    type,
    payload,
  }: {
    type: MessageType;
    payload: MessagePayload[T];
  }): Promise<any> => {
    console.log(
      'Received Message on ' + this.source,
      { type, payload },
      { listeners: this.listeners }
    );
    if (!this.listeners) return;

    const callback = (this.listeners[type] as unknown) as MessageListener<T>;
    if (callback) {
      let response;
      try {
        response = await callback(payload);
      } catch (error) {
        response = { errorMessage: error.message };
      }
      console.log('sendResponse', { response });
      return response;
    }
    return undefined;
  };
}
