import Browser from '../utils/Browser';
import { persistedKeys } from '../utils/Constants';
import { State } from './state';

export async function persistAccount(state: State): Promise<void> {
  for (const key of persistedKeys) {
    await Browser.storage.setItem(key, state[key]);
  }
}
export function loginRequestState(state: State, loginRequestState: RequestState): void {
  state.loginRequestState = loginRequestState;
  Browser.storage.setItem('loginRequestState', loginRequestState);
}

export function changePlaybackRate(state: State, playbackRate: RequestState): void {
  state.playbackRate = playbackRate;
  Browser.storage.getItem('playbackRate').then(storedRate => {
    if (storedRate !== playbackRate) {
      Browser.storage.setItem('playbackRate', playbackRate);
    }
  });

  const video = global.getVideo?.();
  if (video) {
    video.playbackRate = playbackRate || 1;
  }
}
