export default class EpisodeUtils {
  public static seasonAndNumberFromEpisodeUrl(episodeUrl?: Api.EpisodeUrl): string {
    if (episodeUrl?.episode == null) return '';

    return EpisodeUtils.seasonAndNumberFromSearchResult(episodeUrl.episode);
  }

  public static seasonAndNumberFromSearchResult({
    absoluteNumber,
    number,
    season,
  }: Api.EpisodeSearchResult): string {
    if (absoluteNumber != null && number != null && season != null && number === absoluteNumber) {
      return `Season ${season}, Episode ${number}`;
    }
    if (absoluteNumber != null && number != null && season != null) {
      return `Season ${season}, Episode ${number} (#${absoluteNumber})`;
    }
    if (absoluteNumber != null && season != null) {
      return `Season ${season} (#${absoluteNumber})`;
    }
    if (number != null && season != null) {
      return `Season ${season}, Episode ${number}`;
    }
    if (absoluteNumber != null) {
      return `Episode #${absoluteNumber}`;
    }
    return '';
  }
}
