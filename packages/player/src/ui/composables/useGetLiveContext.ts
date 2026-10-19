import { EpisodeUrlFragment, TimestampFragment } from '../../utils/api';
import { AmbiguousTimestamp } from '../../utils/timestamp-utils';

/**
 * Everything needed to save changes for an episode. Captured as a plain object
 * so changes can still be saved after the player moves to another episode.
 */
export interface SaveContext {
  url: string | undefined;
  duration: number | undefined;
  showName: string;
  episodeName: string;
  season: string;
  number: string;
  absoluteNumber: string;
  episodeUrl: EpisodeUrlFragment | undefined;
  existingTimestamps: TimestampFragment[];
  currentTimestamps: AmbiguousTimestamp[];
}

/** Returns a function that reads the live state needed to save changes. */
export default function () {
  const { data: currentUrl } = useCurrentUrlQuery();
  const episodeUrl = useApiEpisodeUrl();
  const episodeForm = useEditEpisodeForm();
  const { duration } = useVideoControls();
  const existingTimestamps = useApiTimestamps();
  const currentTimestamps = useCurrentTimestamps();

  return (): SaveContext => ({
    url: currentUrl.value ?? undefined,
    duration: duration.value ?? undefined,
    showName: episodeForm.showName.value,
    episodeName: episodeForm.episodeName.value,
    season: episodeForm.season.value,
    number: episodeForm.number.value,
    absoluteNumber: episodeForm.absoluteNumber.value,
    episodeUrl: episodeUrl.value ?? undefined,
    existingTimestamps: (existingTimestamps.value ?? []).map((t) => toRaw(t)),
    currentTimestamps: currentTimestamps.value.map((t) => toRaw(t)),
  });
}
