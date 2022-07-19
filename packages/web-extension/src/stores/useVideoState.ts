import { Utils as UiUtils } from '@anime-skip/ui';
import { PLAYER_ACTIVITY_TIMEOUT } from '~/utils/constants';
import UsageStats from '~/utils/UsageStats';
import { createProvideInject } from '~utils/createProvideInject';
import { usePlayerConfig } from '../composition/player-config';

export interface VideoState {
  /**
   * Whether or not the user's mouse is hovering over the player and the user is looking at the
   * controls
   */
  isActive: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  isActiveTimeout?: any;

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
   * The next volume it's ok to change the video to
   */
  allowVolumeChangeTo?: number;

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

const {
  provideValue: provideVideoState,
  useValue: useVideoState,
  useUpdate: useUpdateVideoState,
} = createProvideInject<VideoState>(
  'video-state',
  () => {
    const initialVideo = usePlayerConfig().getVideo?.();
    return {
      isActive: false,
      isBuffering: true,
      isPaused: initialVideo?.paused ?? false,
      isMuted: initialVideo?.muted ?? false,
      volumePercent: 100,
      allowVolumeChangeTo: undefined,
      currentTime: initialVideo?.currentTime ?? 0,
      duration: initialVideo?.duration || (undefined as number | undefined),
      playbackRate: initialVideo?.playbackRate ?? 1,
    };
  },
  true
);

export { provideVideoState, useVideoState, useUpdateVideoState };

export function useVideoController() {
  const state = useVideoState();
  const update = useUpdateVideoState();
  const { getVideo } = usePlayerConfig();

  return {
    // Play/Pause
    play(): void {
      update({ isPaused: false });
    },
    pause(): void {
      update({ isPaused: true });
    },
    togglePlayPause(): void {
      if (state.isPaused) void UsageStats.saveEvent('play', { atTime: state.currentTime });
      else void UsageStats.saveEvent('pause', { atTime: state.currentTime });
      update({ isPaused: !state.isPaused });
    },
    setPlaybackRate(newPlaybackRate: number): void {
      update({ playbackRate: newPlaybackRate });
    },

    // Activity
    setActive(): void {
      clearTimeout(state.isActiveTimeout);
      update({
        isActive: true,
        isActiveTimeout: setTimeout(() => {
          update({ isActive: false, isActiveTimeout: undefined });
        }, PLAYER_ACTIVITY_TIMEOUT),
      });
    },
    setInactive(): void {
      clearTimeout(state.isActiveTimeout);
      update({
        isActive: false,
        isActiveTimeout: undefined,
      });
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
      const newValue = UiUtils.boundedNumber(newPercent, [0, 100]);
      update({ volumePercent: newValue, allowVolumeChangeTo: newValue });
    },
    clearVolumeChange(): void {
      update({ allowVolumeChangeTo: undefined });
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
    setCurrentTime(newTime: number, updateVideo = true): void {
      const newBoundedTime = UiUtils.boundedNumber(newTime, [0, state.duration ?? 0]);
      update({ currentTime: newBoundedTime });

      if (!updateVideo) return;

      // always update the video unless the update is coming from the video element itself
      const video = getVideo?.();
      if (video) {
        video.currentTime = newBoundedTime;
      }
    },
    rewindToNearest(second: number) {
      const video = getVideo?.();
      if (!video) return;

      const currentTime = video.currentTime;
      const newTime = currentTime - (currentTime % second);
      video.currentTime = UiUtils.boundedNumber(newTime, [0, state.duration ?? 0]);
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
