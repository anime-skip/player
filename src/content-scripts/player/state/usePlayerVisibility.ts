import { createProvideInject } from '~/common/utils/createProvideInject';

export interface PlayerVisibility {
  playerHidden: boolean;
  originalPlayerHidden: boolean;
}

const {
  provideValue: providePlayerVisibility,
  useValue: usePlayerVisibility,
  useUpdate,
} = createProvideInject<PlayerVisibility>('player-visibility', {
  playerHidden: false,
  originalPlayerHidden: true,
});

export { providePlayerVisibility, usePlayerVisibility };

export function useIsPlayerHidden() {
  const state = usePlayerVisibility();
  return computed(() => state.playerHidden);
}

export function useShowPlayer() {
  const update = useUpdate();
  return () => {
    update({ playerHidden: false });
  };
}

export function useHidePlayer() {
  const update = useUpdate();
  return () => {
    update({ playerHidden: true });
  };
}

export function useShowOriginalPlayer() {
  const update = useUpdate();
  return () => {
    document.body.classList.remove('hide-for-anime-skip');
    update({ originalPlayerHidden: false });
  };
}

export function useHideOriginalPlayer() {
  const update = useUpdate();
  return () => {
    document.body.classList.add('hide-for-anime-skip');
    update({ originalPlayerHidden: true });
  };
}
