export const windowPosition = storage.defineItem<{
  width: number;
  height: number;
  left: number;
  top: number;
}>('local:windowPosition');
