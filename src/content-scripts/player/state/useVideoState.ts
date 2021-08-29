import { createProvideInject } from '~/common/utils/createProvideInject';

export interface VideoState {
  /**
   * Whether or not the user's mouse is hovering over the player and the user is looking at the
   * controls
   */
  isActive: boolean;

  /**
   * If the video is loading the next frame of the video
   */
  isBuffering: boolean;

  /**
   * Whether or not the video is playing
   */
  isPaused: boolean;

  /**
   * The time that the video is at in seconds
   */
  currentTime: number;

  /**
   * The length of the video in seconds. It can be `undefined` or `0` before the video has loaded,
   * or after a new video starts loading
   */
  duration?: number;

  /**
   * The percentage (0-100) that the volume is set at.
   */
  volumePercent: number;

  /**
   * Whether or not the video is muted. Muting is separate from volume percent because after
   * un-muting, the volume is restored, so they have to be tracked separately.
   */
  isMuted: boolean;

  /**
   * The multiplier that the video is playing the video at
   */
  playbackRate: number;
}

const initialVideo = window.getVideo?.();

const {
  provideValue: provideVideoState,
  useValue: useVideoState,
  useUpdate: useUpdateVideoState,
} = createProvideInject<VideoState>('video-state', {
  isActive: false,
  isBuffering: initialVideo?.seeking ?? false,
  isPaused: initialVideo?.paused ?? false,
  isMuted: initialVideo?.muted ?? false,
  volumePercent: initialVideo?.volume ?? 0,
  currentTime: 0,
  duration: undefined as number | undefined,
  playbackRate: 1,
});

export { provideVideoState, useVideoState, useUpdateVideoState };

export function useVideoController() {
  const state = useVideoState();
  const update = useUpdateVideoState();

  return {
    // Play/Pause
    play(): void {
      update({ isPaused: false });
    },
    pause(): void {
      update({ isPaused: true });
    },
    togglePlayPause(): void {
      update({ isPaused: !state.isPaused });
    },
    setPlaybackRate(newPlaybackRate: number): void {
      update({ playbackRate: newPlaybackRate });
    },

    // Activity
    setActive(): void {
      update({ isActive: true });
    },
    setInactive(): void {
      update({ isActive: false });
    },
    toggleActive(): void {
      update({ isActive: !state.isActive });
    },
    buffering(): void {
      update({ isBuffering: true });
    },
    clearBuffering(): void {
      update({ isBuffering: false });
    },
    toggleBuffering(): void {
      update({ isBuffering: !state.isBuffering });
    },

    // Volume
    setVolumePercent(newPercent: number) {
      update({ volumePercent: newPercent });
    },
    mute(): void {
      update({ isMuted: true });
    },
    clearMute(): void {
      update({ isMuted: false });
    },
    toggleMute(): void {
      update({ isMuted: !state.isMuted });
    },

    // Time
    setCurrentTime(newTime: number): void {
      update({ currentTime: newTime });
    },
    setDuration(newDuration: number | undefined): void {
      update({ duration: newDuration });
    },
  };
}

/**
 * Get the duration. Since the duration can sometimes be 0, return `undefined` instead for
 * consistency. 0 durations just mean the video is still loading
 */
export function useDuration(videoState = useVideoState()) {
  return computed(() => videoState.duration || 0);
}
