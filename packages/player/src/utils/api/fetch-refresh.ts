import pSingleton from 'p-singleton';

type Fetch = typeof fetch;

export function fetchRefresh(options: {
  fetch: Fetch;
  shouldRefresh(response: any): boolean;
  refresh(): Promise<void>;
  headers(): Promise<Record<string, string>> | Record<string, string>;
}): Fetch {
  const getRequest = async (
    input: RequestInfo | URL,
    init: RequestInit | undefined,
  ) => {
    const headers = await options.headers();
    const request = new Request(input, init);
    Object.entries(headers).forEach(([key, value]) => {
      request.headers.append(key, value);
    });
    return request;
  };
  const fetch = options.fetch.bind(window);

  // Make sure only a single call to options.refresh is executed at a time. Multiple concurrent
  // calls result in a single execution and a single shared promise.
  const refresh = pSingleton(options.refresh);

  return async (input, init) => {
    const initialRequest = await getRequest(input, init);
    const initialResponse = await fetch(initialRequest);
    const json = await initialResponse.clone().json();

    const needsRefreshed = options.shouldRefresh(json);
    if (!needsRefreshed) return initialResponse;
    await refresh();

    const refreshedRequest = await getRequest(input, init);
    return fetch(refreshedRequest);
  };
}
