import { forwardKeydownEvent } from '@anime-skip/player';
import { ContentScriptContext } from 'wxt/client';

const MESSAGE_TYPE = 'anime-skip-player:keydown';

/**
 * Inside a helper, intercept keydown events and forward them to the player. Also prevent their
 * default behavior if the event would scroll the screen or have some other kind of detrimental
 * side-effect.
 */
export function initKeyboardShortcutForwarder(ctx: ContentScriptContext) {
  ctx.addEventListener(
    document,
    'keydown',
    (event) => {
      // Ignore keydown events inside inputs
      const activeTag = document.activeElement?.tagName;
      if (activeTag === 'INPUT' || activeTag === 'TEXTAREA') return;

      // Send message to player content scripts that a keypress occurred
      queueMicrotask(() => {
        if (ctx.isInvalid) return;

        const forwardedEvent: ForwardedKeyboardEvent = {
          altKey: event.altKey,
          ctrlKey: event.ctrlKey,
          shiftKey: event.shiftKey,
          metaKey: event.metaKey,
          key: event.key,
        };
        const message = {
          type: MESSAGE_TYPE,
          event: forwardedEvent,
        };
        window.postMessage(message, '*');
        document.querySelectorAll('iframe').forEach((iframe) => {
          try {
            iframe.contentWindow?.postMessage(message, '*');
          } catch (err) {
            logger.warn('Cannot forward message to iframe:', iframe.src, err);
          }
        });
        logger.debug('Forwarded keyboard event:', forwardedEvent);
      });

      event.stopImmediatePropagation();
      event.stopPropagation();
      event.cancelBubble = true;

      const preventDefaultForKeys = [
        // Prevent scrolling when pressing space
        ' ',
        // Stop scrolling
        'ArrowDown',
        'ArrowLeft',
        'ArrowRight',
        'ArrowUp',
      ];
      if (preventDefaultForKeys.includes(event.key)) {
        event.preventDefault();
      }
    },
    {
      capture: true,
    },
  );
}

/**
 * Inside a player content script, listen for forwarded keydown events, and publish them on this
 * document instead.
 */
export function initKeyboardShortcutReciever(ctx: ContentScriptContext) {
  ctx.addEventListener(window, 'message', (event: MessageEvent) => {
    const data: { type: string; event: ForwardedKeyboardEvent } = event.data;
    logger.debug('Recieved event:', data);
    if (data.type !== MESSAGE_TYPE) return;

    logger.debug('Recieved forwarded keyboard event:', data);
    forwardKeydownEvent(data.event as KeyboardEvent);
  });
}

type ForwardedKeyboardEvent = Pick<
  KeyboardEvent,
  'key' | 'altKey' | 'metaKey' | 'shiftKey' | 'ctrlKey'
>;
