import * as Api from '../api';

export default {
  seasonAndNumberFromEpisodeUrl(episodeUrl?: Api.EpisodeUrl): string {
    if (episodeUrl?.episode == null) return '';

    return this.seasonAndNumberDisplay(episodeUrl.episode);
  },

  seasonAndNumberFromEpisodeInfo(episodeInfo?: DisplayEpisodeInfo): string {
    if (episodeInfo == null) return '';

    return this.seasonAndNumberDisplay(episodeInfo);
  },

  seasonAndNumberDisplay({
    absoluteNumber,
    number,
    season,
  }: {
    absoluteNumber?: string;
    number?: string;
    season?: string;
  }): string {
    if (absoluteNumber != null && number != null && season != null) {
      return `Season ${season}, Episode ${number} (#${absoluteNumber})`;
    }
    if (absoluteNumber != null && season != null) {
      return `Season ${season} (#${absoluteNumber})`;
    }
    if (number != null && season != null) {
      return `Season ${season}, Episode ${number}`;
    }
    if (season != null) {
      return `Season ${season}`;
    }
    if (number != null) {
      return `Episode ${number}`;
    }
    if (absoluteNumber != null) {
      return `Episode #${absoluteNumber}`;
    }
    return '';
  },
};
