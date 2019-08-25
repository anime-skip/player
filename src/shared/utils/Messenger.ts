export default class Messenger {
  public listeners: { [type: string]: (payload: any) => any } = {};

  public constructor() {
    // @ts-ignore
    browser.runtime.onMessage.addListener(this.onReceiveMessage);
    // console.log('initialized messenger');
  }

  public async send<T extends MessageType>(
    type: T,
    payload: MessagePayload[T]
  ): Promise<MessageResponse[T]> {
    // console.log('sending', { type, payload });
    // @ts-ignore
    const response = await browser.runtime.sendMessage({
      type,
      payload,
    });
    return JSON.parse(response);
  }

  private onReceiveMessage<T extends MessageType>(
    { payload }: { type: MessageType; payload: MessagePayload[T] },
    _sender: any,
    sendResponse: (response: any) => void
  ): void {
    // console.log('Received Message', { type, payload });
    sendResponse(payload);
  }
}
