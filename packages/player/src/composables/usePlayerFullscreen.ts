import { SECOND } from '../utils/time';

export default function () {
  const options = usePlayerOptions();
  const fullscreenElement = ref(options.fullscreenElement());

  useIntervalFn(() => {
    fullscreenElement.value = options.fullscreenElement();
  }, 1 * SECOND);

  return useFullscreen(fullscreenElement);
}
