import createAnimeSkipClient, { GqlEpisodeUrl, GqlInputEpisodeUrl } from '@anime-skip/axios-api';
import * as Api from '~/common/api';

export function createCustomAnimeSkipClient(baseUrl: string, clientId: string) {
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
        .deleteEpisodeUrl(Api.DELETE_EPISODE_URL_MUTATION, { episodeUrl: args.episodeUrlInput.url })
        .then(() => console.log('Deleted existing episode url'))
        .catch(err => console.log('Did not delete existing episode url:', err));
      return await methods.createEpisodeUrl(query, args);
    },
  };

  return {
    axios,
    ...methods,
    ...customMethods,
  };
}
