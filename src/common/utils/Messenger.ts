export default class Messenger {
  public listeners: MessageTypeMap<(payload: any) => Promise<any>> = {};

  public constructor() {
    // @ts-ignore
    browser.runtime.onMessage.addListener(this.onReceiveMessage);
    // console.log('initialized messenger');
  }

  public send = async <T extends MessageType>(
    type: T,
    payload: MessagePayload[T]
  ): Promise<MessageResponse[T]> => {
    // console.log('sending', { type, payload });
    // @ts-ignore
    const response = await browser.runtime.sendMessage({
      type,
      payload,
    });
    return response;
  };

  public on = <T extends MessageType>(
    type: T,
    callback: (payload: MessagePayload[T]) => Promise<MessageResponse[T]>
  ): void => {
    this.listeners[type] = callback;
  };

  private onReceiveMessage = async <T extends MessageType>(
    { type, payload }: { type: MessageType; payload: MessagePayload[T] },
    _sender: any,
    sendResponse: (response: any) => void
  ): Promise<any> => {
    const callback = this.listeners[type];
    console.log('Received Message', { type, payload, callback });
    if (callback) {
      const response = await callback(payload);
      console.log('sendResponse', { response });
      return response;
    }
    return undefined;
  };
}
