export default function <T extends CustomEvent>(
  key: string,
  cb: (event: T) => void,
) {
  useEventListener(window, key, cb);
}
