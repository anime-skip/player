export enum PlayerVisibility {
  /**
   * The video player and controls are visible
   */
  Visible,
  /**
   * The video player and controls are hidden, but a button to show them again appears. Used for
   * service settings.
   */
  ServiceSettings,
  /**
   * The player is hidden completely without a button to show it again. Used for screenshots
   */
  Hidden,
}
