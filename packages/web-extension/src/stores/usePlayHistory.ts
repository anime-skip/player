import { createProvideInject } from '~utils/createProvideInject';

export interface PlayHistory {
  /**
   * Has the player automatically skipped to the next timestamp from 0 seconds.
   *
   * Used to prevent auto-skipping again if the user manually seeked back to the beginning
   */
  hasSkippedFromZero: boolean;
  /**
   * Whether or not the video source is loading for the first time, or it's its just buffering
   * somewhere in the middle.
   *
   * Used to hide the episode details while the video is still loading. This way they can't connect
   * the URL until it's loaded. **Is this a good thing?** Maybe we don't have to wait, and
   * connecting immediately is fine...
   */
  isInitialBuffer: boolean;
  playTicks: number;
}

const {
  provideValue: providePlayHistory,
  useValue: usePlayHistory,
  useUpdate: useUpdatePlayHistory,
} = createProvideInject<PlayHistory>('play-history', {
  hasSkippedFromZero: false,
  isInitialBuffer: true,
  playTicks: 0,
});

export { providePlayHistory, usePlayHistory, useUpdatePlayHistory };

export function useResetSkippedFromZero() {
  const update = useUpdatePlayHistory();
  return () => update({ hasSkippedFromZero: false });
}

export function useResetInitialBuffer() {
  const update = useUpdatePlayHistory();
  return () => update({ isInitialBuffer: true });
}

export function useResetPlayTicks() {
  const update = useUpdatePlayHistory();
  return () => update({ playTicks: 0 });
}

export function useIncrementPlayTicks() {
  const update = useUpdatePlayHistory();
  const value = usePlayHistory();
  return () => update({ playTicks: value.playTicks + 1 });
}
