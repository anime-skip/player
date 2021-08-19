import Axios, { AxiosError } from 'axios';
import md5 from 'md5';
import Browser from '~/common/utils/Browser';
import Utils from '~/common/utils/Utils';
import { as } from '../utils/GlobalUtils';

const baseUrls: Record<ExtensionMode, string> = {
  prod: 'https://api.anime-skip.com/',
  beta: 'https://api.anime-skip.com/',
  staged: 'https://staged.api.anime-skip.com/',
  dev: 'http://localhost:8081/',
};

const clientId = 'OB3AfF3fZg9XlZhxtLvhwLhDcevslhnr';

const mode = import.meta.env.VITE_EXT_MODE ?? 'dev';

const axios = Axios.create({
  baseURL: baseUrls[mode],
});

const modesToLog: ExtensionMode[] = ['dev', 'staged'];

if (modesToLog.includes(mode)) {
  axios.interceptors.response.use(
    /* eslint-disable no-console */
    response => {
      const formattedGraphql = Utils.formatGraphql(JSON.parse(response.config.data).query);
      const type = formattedGraphql.split('\n')[0]?.replace('{', '').trim();
      const headers = {
        ...response.config.headers,
        ...response.config.headers.common,
        ...response.config.headers[response.config.method || 'get'],
      };
      delete headers.get;
      delete headers.post;
      delete headers.put;
      delete headers.delete;
      delete headers.patch;
      delete headers.head;
      console.groupCollapsed(
        `%cAPI  %c/${response.config.url} ${type}`,
        'font-weight: 600; color: default;',
        'font-weight: 400; color: default;'
      );
      console.debug(`URL: %c${response.config.baseURL}${response.config.url}`, 'color: #137AF8');
      console.debug('Headers: ', headers);
      if (response.config.params) {
        console.debug('Parameters: ', response.config.params);
      }
      if (response.config.data) {
        console.debug(`GraphQL:\n%c${formattedGraphql}`, 'color: #137AF8');
        if (response.config.data.variables) {
          console.debug('Variables: ', response.config.data.variables);
        }
      }
      console.debug('Response: ', response.data);
      console.groupEnd();

      return response;
    }
    /* eslint-enable no-console */
  );
}

function query(q: string, vars?: GraphQlVariables): GraphQlBody {
  return { query: q, variables: vars };
}

function mutation(mutationString: string, vars: GraphQlVariables): GraphQlBody {
  return { query: mutationString, variables: vars };
}

const preferencesData = `
  enableAutoSkip enableAutoPlay
  skipBranding skipIntros skipNewIntros skipMixedIntros skipRecaps skipFiller skipCanon skipTransitions skipTitleCard skipCredits skipMixedCredits skipNewCredits skipPreview
`;

const loginData = `
  authToken refreshToken
  account {
    username emailVerified
    preferences {
      ${preferencesData}
    }
  }
`;

const loginRefreshData = `
  authToken refreshToken
`;

const showSearchData = `id name originalName`;

const showData = `id name originalName website image`;

const episodeSearchData = `id name season number absoluteNumber baseDuration`;

const episodeUrlNoEpisodeData = `
  url
  createdAt
  duration
  timestampsOffset
`;

const timestampData = `
  id
  at
  typeId
  source
`;

const timestampWithoutSourceData = `
  id
  at
  typeId
`;

const thirdPartyEpisodeData = `
  id
  name
  season
  number
  absoluteNumber
  source
  baseDuration
  timestamps {
    ${timestampWithoutSourceData}
  }
  show { name }
`;

const templateData = `
  id
  showId
  sourceEpisodeId
  timestampIds
  type
  seasons
`;

const episodeData = `
  id absoluteNumber number season name baseDuration
  timestamps {
    ${timestampData}
  }
  show { 
    ${showData} 
  }
  template {
    ${templateData}
  }
`;

const episodeUrlData = `
  ${episodeUrlNoEpisodeData}
  episode {
    ${episodeData}
  }
`;

/* eslint-disable no-console */
async function sendGraphql<Q extends string, D>(
  data: unknown,
  skipAuth = false
): Promise<{ data: { [field in Q]: D } }> {
  const token = skipAuth ? undefined : await Browser.getAccessToken();
  const response = await axios.post('graphql', data, {
    headers: {
      Authorization: token ? `Bearer ${token}` : undefined,
      'X-Client-ID': clientId,
    },
  });
  if (response.data?.errors) {
    const error = new Error(
      `GraphQL Request failed with ${response.data.errors.length} errors`
    ) as AxiosError;
    error.response = response;
    throw error;
  }
  return response.data;
}

async function sendUnauthorizedGraphql<Q extends string, D>(
  data: unknown
): Promise<{ data: { [field in Q]: D } }> {
  return await sendGraphql(data, true);
}
/* eslint-enable no-console */

export default as<Api.Implementation>({
  async loginManual(username, password): Promise<Api.LoginResponse> {
    const q = query(
      `query LoginManual($username: String!, $passwordHash: String!) {
        login(usernameEmail: $username, passwordHash: $passwordHash) {
          ${loginData}
        }
      }`,
      { username, passwordHash: md5(password) }
    );
    const response = await sendUnauthorizedGraphql<'login', Api.LoginResponse>(q);
    return response.data.login;
  },

  async loginRefresh(refreshToken): Promise<Api.LoginRefreshResponse> {
    const q = query(
      `query LoginRefresh($refreshToken: String!) {
        loginRefresh(refreshToken: $refreshToken) {
          ${loginRefreshData}
        }
      }`,
      { refreshToken }
    );
    const response = await sendUnauthorizedGraphql<'loginRefresh', Api.LoginRefreshResponse>(q);
    return response.data.loginRefresh;
  },

  async updatePreferences(preferences): Promise<void> {
    const m = mutation(
      `mutation SavePreferences($preferences: InputPreferences!) {
        savePreferences(preferences: $preferences) {
          ${preferencesData}
        }
      }`,
      {
        preferences,
      }
    );
    await sendGraphql(m);
  },

  async createShow(data): Promise<Api.Show> {
    const m = mutation(
      `mutation CreateShow($data: InputShow!) {
        createShow(showInput: $data, becomeAdmin: false) {
          ${showData}
        }
      }`,
      {
        data,
      }
    );
    const response = await sendGraphql<'createShow', Api.ShowSearchResult>(m);
    return response.data.createShow;
  },
  async searchShows(name): Promise<Api.ShowSearchResult[]> {
    const q = query(
      `query SearchShows($name: String!, $limit: Int) {
        searchShows(search: $name, limit: $limit) {
          ${showSearchData}
        }
      }`,
      { name, limit: 5 }
    );
    const response = await sendGraphql<'searchShows', Api.ShowSearchResult[]>(q);
    return response.data.searchShows;
  },

  async createEpisode(data, showId): Promise<Api.EpisodeSearchResult> {
    const m = mutation(
      `mutation CreateEpisode($data: InputEpisode!, $showId: ID!) {
        createEpisode(episodeInput: $data, showId: $showId) {
          ${episodeSearchData}
        }
      }`,
      {
        data,
        showId,
      }
    );
    const response = await sendGraphql<'createEpisode', Api.EpisodeSearchResult>(m);
    return response.data.createEpisode;
  },
  async searchEpisodes(name: string, showId?: string): Promise<Api.EpisodeSearchResult[]> {
    const params: string[] = [`search: "${name}"`, 'limit: 5'];
    if (showId != null) {
      params.push(`showId: "${showId}"`);
    }
    const q = query(
      `query SearchEpisodes($name: String!, $showId: ID, $limit: Int) {
        searchEpisodes(search: $name, limit: $limit, showId: $showId) {
          ${episodeSearchData}
        }
      }`,
      { name, limit: 5, showId }
    );
    console.debug({ q });
    const response = await sendUnauthorizedGraphql<'searchEpisodes', Api.EpisodeSearchResult[]>(q);
    return response.data.searchEpisodes;
  },
  async updateEpisode(episodeId, newEpisode): Promise<Api.Episode> {
    const m = mutation(
      `mutation UpdateEpisode($episodeId: ID!, $newEpisode: InputEpisode!) {
        updateEpisode(episodeId: $episodeId, newEpisode: $newEpisode) {
          ${episodeData}
        }
      }`,
      {
        newEpisode,
        episodeId,
      }
    );
    const response = await sendGraphql<'updateEpisode', Api.Episode>(m);
    return response.data.updateEpisode;
  },

  async createEpisodeUrl(data, episodeId): Promise<Api.EpisodeUrlNoEpisode> {
    const m = mutation(
      `mutation CreateEpisodeUrl($data: InputEpisodeUrl!, $episodeId: ID!) {
        createEpisodeUrl(episodeUrlInput: $data, episodeId: $episodeId) {
          ${episodeUrlNoEpisodeData}
        }
      }`,
      {
        data,
        episodeId,
      }
    );
    const response = await sendGraphql<'createEpisodeUrl', Api.EpisodeUrlNoEpisode>(m);
    return response.data.createEpisodeUrl;
  },
  async deleteEpisodeUrl(episodeUrl: string): Promise<Api.EpisodeUrlNoEpisode> {
    const m = mutation(
      `mutation DeleteEpisodeUrl($episodeUrl: String!) {
        deleteEpisodeUrl(episodeUrl: $episodeUrl) {
          ${episodeUrlNoEpisodeData}
        }
      }`,
      {
        episodeUrl,
      }
    );
    const response = await sendGraphql<'deleteEpisodeUrl', Api.EpisodeUrl>(m);
    return response.data.deleteEpisodeUrl;
  },
  async fetchEpisodeByUrl(url): Promise<Api.EpisodeUrl> {
    const q = query(
      `query FindEpisodeByUrl($url: String!) {
        findEpisodeUrl(episodeUrl: $url) {
          ${episodeUrlData}
        }
      }`,
      { url }
    );
    const response = await sendUnauthorizedGraphql<'findEpisodeUrl', Api.EpisodeUrl>(q);
    return response.data.findEpisodeUrl;
  },
  async fetchEpisodeByName(name, showName): Promise<Api.ThirdPartyEpisode[]> {
    const q = query(
      `query FindEpisodeByName($name: String!) {
        findEpisodeByName(name: $name) {
          ${thirdPartyEpisodeData}
        }
      }`,
      { name }
    );
    const response = await sendUnauthorizedGraphql<'findEpisodeByName', Api.ThirdPartyEpisode[]>(q);
    return response.data.findEpisodeByName.filter(
      episode => episode.show.name.toLowerCase() === showName.toLowerCase()
    );
  },
  async updateEpisodeUrl(episodeUrl, newEpisodeUrl): Promise<Api.EpisodeUrlNoEpisode> {
    const m = mutation(
      `mutation UpdateEpisodeUrl($newEpisodeUrl: InputEpisodeUrl!, $episodeUrl: String!) {
        updateEpisodeUrl(episodeUrl: $episodeUrl, newEpisodeUrl: $newEpisodeUrl) {
          ${episodeUrlNoEpisodeData}
        }
      }`,
      {
        newEpisodeUrl,
        episodeUrl,
      }
    );
    const response = await sendGraphql<'updateEpisodeUrl', Api.EpisodeUrlNoEpisode>(m);
    return response.data.updateEpisodeUrl;
  },

  async createTimestamp(
    episodeId: string,
    { at, typeId, source }: Api.InputTimestamp
  ): Promise<Api.Timestamp> {
    const m = mutation(
      `mutation CreateTimestamp($data: InputTimestamp!, $episodeId: ID!) {
        createTimestamp(timestampInput: $data, episodeId: $episodeId) {
          ${timestampData}
        }
      }`,
      {
        episodeId,
        data: { at, typeId, source },
      }
    );
    const response = await sendGraphql<'createTimestamp', Api.Timestamp>(m);
    return response.data.createTimestamp;
  },
  async updateTimestamp({ id, at, typeId, source }: Api.Timestamp): Promise<Api.Timestamp> {
    const m = mutation(
      `mutation UpdateTimestamp($data: InputTimestamp!, $timestampId: ID!) {
        updateTimestamp(newTimestamp: $data, timestampId: $timestampId) {
          ${timestampData}
        }
      }`,
      {
        timestampId: id,
        data: { at, typeId, source },
      }
    );
    const response = await sendGraphql<'updateTimestamp', Api.Timestamp>(m);
    return response.data.updateTimestamp;
  },
  async deleteTimestamp(timestampId: string): Promise<Api.Timestamp> {
    const m = mutation(
      `mutation DeleteTimestamp($timestampId: ID!) {
        deleteTimestamp(timestampId: $timestampId) {
          ${timestampData}
        }
      }`,
      {
        timestampId,
      }
    );
    const response = await sendGraphql<'deleteTimestamp', Api.Timestamp>(m);
    return response.data.deleteTimestamp;
  },

  async findTemplateByDetails(
    episodeId,
    showName,
    season
  ): Promise<Api.TemplateWithTimestamps | undefined> {
    const q = query(
      `query FindTemplateByDetails($episodeId: ID, $showName: String, $season: String) {
        findTemplateByDetails(episodeId: $episodeId, showName: $showName, season: $season) {
          ${templateData}
          timestamps {
            ${timestampData}
          }
          sourceEpisode {
            baseDuration
          }
        }
      }`,
      { episodeId, showName, season }
    );
    const response = await sendUnauthorizedGraphql<
      'findTemplateByDetails',
      Api.TemplateWithTimestamps | undefined
    >(q);
    return response.data.findTemplateByDetails;
  },
  async createTemplate(newTemplate): Promise<Api.Template> {
    const m = mutation(
      `mutation CreateTemplate($newTemplate: InputTemplate!) {
        createTemplate(newTemplate: $newTemplate) {
          ${templateData}
        }
      }`,
      {
        newTemplate: {
          showId: newTemplate.showId,
          sourceEpisodeId: newTemplate.sourceEpisodeId,
          type: newTemplate.type,
          seasons: newTemplate.seasons,
        },
      }
    );
    const response = await sendGraphql<'createTemplate', Api.Template>(m);
    return response.data.createTemplate;
  },
  async updateTemplate(templateId, newTemplate): Promise<Api.Template> {
    const m = mutation(
      `mutation UpdateTemplate($templateId: ID!, $newTemplate: InputTemplate!) {
        updateTemplate(templateId: $templateId, newTemplate: $newTemplate) {
          ${templateData}
        }
      }`,
      {
        templateId,
        newTemplate: {
          showId: newTemplate.showId,
          sourceEpisodeId: newTemplate.sourceEpisodeId,
          type: newTemplate.type,
          seasons: newTemplate.seasons,
        },
      }
    );
    const response = await sendGraphql<'updateTemplate', Api.Template>(m);
    return response.data.updateTemplate;
  },
  async deleteTemplate(templateId): Promise<Api.Template> {
    const m = mutation(
      `mutation DeleteTemplate($templateId: ID!) {
        deleteTemplate(templateId: $templateId) {
          ${templateData}
        }
      }`,
      {
        templateId,
      }
    );
    const response = await sendGraphql<'deleteTemplate', Api.Template>(m);
    return response.data.deleteTemplate;
  },
  async addTimestampToTemplate(templateTimestamp): Promise<void> {
    const m = mutation(
      `mutation AddTimestampToTemplate($templateTimestamp: InputTemplateTimestamp!) {
        addTimestampToTemplate(templateTimestamp: $templateTimestamp) {
          templateId
          timestampId
        }
      }`,
      {
        templateTimestamp,
      }
    );
    await sendGraphql<'addTimestampToTemplate', void>(m);
  },
  async removeTimestampFromTemplate(templateTimestamp): Promise<void> {
    const m = mutation(
      `mutation RemoveTimestampFromTemplate($templateTimestamp: InputTemplateTimestamp!) {
        removeTimestampFromTemplate(templateTimestamp: $templateTimestamp) {
          templateId
          timestampId
        }
      }`,
      {
        templateTimestamp,
      }
    );
    await sendGraphql<'removeTimestampFromTemplate', void>(m);
  },
});
