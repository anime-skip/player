export enum PlayerVisibility {
  /**
   * The Anime Skip Player is showing.
   */
  Visible,
  /**
   * The Anime Skip Player is hidden, the builtin player is visible, and a button to show Anime Skip
   * again appears. Used for the extension's service settings.
   */
  ServiceSettings,
  /**
   * Everything is hidden but the video.
   */
  Hidden,
}
