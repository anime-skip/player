import createAnimeSkipClient, { GqlEpisodeUrl, GqlInputEpisodeUrl } from '@anime-skip/api-client';
import * as Api from '../api';

export function createCustomAnimeSkipClient(
  baseUrl: string,
  clientId: string,
  log: (...args: unknown[]) => void
) {
  const { axios, ...methods } = createAnimeSkipClient(baseUrl, clientId);

  const customMethods = {
    async findEpisodesByEpisodeAndShowName(
      query: string,
      args: { episodeName: string; showName: string }
    ): Promise<Api.ThirdPartyEpisode[]> {
      const results = (await methods.findEpisodeByName(query, {
        name: args.episodeName,
      })) as Api.ThirdPartyEpisode[];
      return results.filter(
        episode => episode.show.name.toLowerCase() === args.showName.toLowerCase()
      );
    },
    /**
     * Attempt to delete the existing entry for the url, then
     */
    async createOrUpdateEpisodeUrl(
      query: string,
      args: { episodeId: string; episodeUrlInput: GqlInputEpisodeUrl }
    ): Promise<GqlEpisodeUrl> {
      await methods
        .deleteEpisodeUrl(Api.EPISODE_URL_NO_EPISODE_DATA, { episodeUrl: args.episodeUrlInput.url })
        .then(() => log('Deleted existing episode url'))
        .catch(err => log('Did not delete existing episode url:', err));
      return await methods.createEpisodeUrl(query, args);
    },
  };

  return {
    axios,
    ...methods,
    ...customMethods,
  };
}

export type CustomAnimeSkipClient = ReturnType<typeof createCustomAnimeSkipClient>;
