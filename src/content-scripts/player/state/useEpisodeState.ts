import { createProvideInject } from '~/common/utils/createProvideInject';

export interface EpisodeState {
  savedTimestamps: Api.AmbiguousTimestamp[];
}

const {
  provideValue: provideEpisodeState,
  useValue: useEpisodeState,
  useUpdate: useUpdateEpisodeState,
} = createProvideInject<EpisodeState>('episode-state', {
  savedTimestamps: [],
});

export { provideEpisodeState, useEpisodeState, useUpdateEpisodeState };
