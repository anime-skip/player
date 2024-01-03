import { LocalNetworkRequest, NetworkRequest } from '@/utils/network-repo';
import { nanoid } from 'nanoid';

export default defineContentScript({
  matches: ['*://*/*'],
  runAt: 'document_start',
  allFrames: true,
  world: 'MAIN',

  main() {
    const requests: Record<string, LocalNetworkRequest> = {};
    monkeyPatchFetch({
      async onRequest(id, request) {
        const now = Date.now();
        const model: LocalNetworkRequest = {
          id: id,
          source: 'fetch',
          from: location.href,
          request: {
            url: resolveUrl(request.url),
            body: await request.text(),
            method: request.method,
            date: now,
            headers: serializeHeaders(request.headers),
          },
        };
        requests[id] = model;
        sendToIsolatedContentScript(model);
      },
      async onResponse(id, response) {
        const now = Date.now();
        const model: LocalNetworkRequest = {
          ...requests[id],
          response: {
            status: response.status,
            body: await response.text(),
            date: now,
            duration: now - requests[id].request.date,
            headers: serializeHeaders(response.headers),
            statusText: response.statusText,
          },
        };
        delete requests[id];
        sendToIsolatedContentScript(model);
      },
    });

    monkeyPatchXhr({
      onRequest(id, request) {
        const model: LocalNetworkRequest = {
          id,
          request,
          source: 'xhr',
          from: location.href,
        };
        requests[id] = model;
        sendToIsolatedContentScript(model);
      },
      onResponse(id, response) {
        const model = {
          ...requests[id],
          response,
        };
        delete requests[id];
        sendToIsolatedContentScript(model);
      },
    });
  },
});

function monkeyPatchFetch(options: {
  onRequest?: (id: string, request: Request) => void;
  onResponse?: (id: string, response: Response) => void;
}): void {
  const ogFetch = window.fetch;

  window.fetch = async (...args) => {
    const id = nanoid();
    const request = new Request(...args);
    options.onRequest?.(id, request);
    const response = await ogFetch(...args);
    options.onResponse?.(id, response.clone());
    return response;
  };
}

function monkeyPatchXhr(options: {
  onRequest?(id: string, request: NetworkRequest['request']): void;
  onResponse?(id: string, response: NetworkRequest['response']): void;
}) {
  const OgXMLHttpRequest = window.XMLHttpRequest;

  window.XMLHttpRequest = class extends OgXMLHttpRequest {
    id?: string;
    method?: string;
    url?: string;
    sendDate?: number;
    requestBody?: string;
    requestHeaders = new Headers();
    responseBody?: string;
    responseHeaders = new Headers();

    open(method: string, url: string | URL): void;
    open(
      method: string,
      url: string | URL,
      isAsync: boolean,
      username?: string | null | undefined,
      password?: string | null | undefined,
    ): void;
    open(
      method: string,
      url: string | URL,
      isAsync?: unknown,
      username?: unknown,
      password?: unknown,
    ): void {
      super.open(method, url, isAsync as any, username as any, password as any);
      this.method = method;
      this.url = typeof url === 'string' ? url : url.href;
    }
    setRequestHeader(name: string, value: string): void {
      super.setRequestHeader(name, value);
      this.requestHeaders.append(name, value);
    }
    send(body?: Document | XMLHttpRequestBodyInit | null | undefined): void {
      super.addEventListener('readystatechange', async () => {
        if (this.readyState === this.DONE) {
          if (this.responseType === 'blob') {
            this.responseBody = await (this.response as Blob).text();
          } else {
            this.responseBody = this.responseText;
          }
          this.getAllResponseHeaders()
            .split(/\r?\n/)
            .map((line) => {
              const [name, ...value] = line.split(': ');
              if (name && value.length > 0) {
                this.responseHeaders.append(name, value.join(', '));
              }
            });
          options.onResponse?.(this.id!, {
            date: Date.now(),
            body: this.responseBody ?? '',
            duration: Date.now() - this.sendDate!,
            headers: serializeHeaders(this.responseHeaders),
            status: this.status,
            statusText: this.statusText,
          });
        }
      });

      super.send(body);
      this.requestBody = body?.toString() ?? '';
      this.sendDate = Date.now();
      this.id = nanoid();
      options.onRequest?.(this.id, {
        body: this.requestBody!,
        date: this.sendDate!,
        headers: serializeHeaders(this.requestHeaders),
        method: this.method!,
        url: resolveUrl(this.url!),
      });
    }
  };
}

function serializeHeaders(headers: Headers) {
  return Array.from(headers.entries()).reduce<Record<string, string[]>>(
    (map, [key, value]) => {
      map[key] ??= [];
      map[key].push(value);
      return map;
    },
    {},
  );
}

function sendToIsolatedContentScript(request: LocalNetworkRequest) {
  window.dispatchEvent(
    new CustomEvent('inspector:networkrequest', { detail: request }),
  );
}

function resolveUrl(input: string) {
  try {
    return new URL(input, location.origin).href;
  } catch {
    return 'https://unknown/' + input;
  }
}
