import { createProvideInject } from '~/common/utils/createProvideInject';

export interface PlayerVisibility {
  isAnimeSkipPlayerVisible: boolean;
  isOriginalPlayerVisible: boolean;
}

const HIDE_ORIGINAL_PLAYER_CLASS = 'hide-for-anime-skip';

const {
  provideValue: providePlayerVisibility,
  useValue: usePlayerVisibility,
  useUpdate,
} = createProvideInject<PlayerVisibility>('player-visibility', {
  isAnimeSkipPlayerVisible: true,
  isOriginalPlayerVisible: false,
});

export { providePlayerVisibility, usePlayerVisibility };

export function useIsAnimeSkipPlayerVisible() {
  const state = usePlayerVisibility();
  return computed(() => state.isAnimeSkipPlayerVisible);
}

export function useShowAnimeSkipPlayer() {
  const update = useUpdate();
  return () => {
    update({ isAnimeSkipPlayerVisible: false });
  };
}

export function useHideAnimeSkipPlayer() {
  const update = useUpdate();
  return () => {
    update({ isAnimeSkipPlayerVisible: true });
  };
}

export function useIsOriginalPlayerVisible() {
  const state = usePlayerVisibility();
  return computed(() => state.isOriginalPlayerVisible);
}

export function useShowOriginalPlayer() {
  const update = useUpdate();
  return () => {
    document.body.classList.remove(HIDE_ORIGINAL_PLAYER_CLASS);
    update({ isOriginalPlayerVisible: true, isAnimeSkipPlayerVisible: false });
  };
}

export function useHideOriginalPlayer() {
  const update = useUpdate();
  return () => {
    document.body.classList.add(HIDE_ORIGINAL_PLAYER_CLASS);
    update({ isOriginalPlayerVisible: false, isAnimeSkipPlayerVisible: true });
  };
}
