declare module 'anime-skip' {
  interface Settings {
    autoSkipEnabled: boolean;
    autoSkip: {
      branding: boolean;
      intro: boolean;
      recap: boolean;
      filler: boolean;
      outro: boolean;
    };
  }
}
