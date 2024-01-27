import { PlayerVisibility } from './PlayerVisibility';

type PlayerEventDetail =
  | {
      type: 'setPlayerVisibility';
      visibility: PlayerVisibility;
    }
  | {
      type: 'showScreenshot';
      url: string;
    };

/**
 * Event used to send data from outside the player into the Vue app.
 */
export class PlayerEvent extends CustomEvent<PlayerEventDetail> {
  static TYPE = '@anime-skip/player-event';

  static dispatch(detail: PlayerEventDetail) {
    window.dispatchEvent(new PlayerEvent(detail));
  }

  constructor(detail: PlayerEventDetail) {
    super(PlayerEvent.TYPE, { detail });
  }
}
