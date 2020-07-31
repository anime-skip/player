import Axios, { AxiosError } from 'axios';
import Utils from '@/common/utils/Utils';
import Browser from '@/common/utils/Browser';
import md5 from 'md5';
import { as } from '../utils/GlobalUtils';

const axios = Axios.create({
  baseURL:
    process.env.NODE_ENV === 'production' ? 'http://api.anime-skip.com/' : 'http://localhost:8000/',
});

axios.interceptors.request.use((config): any => {
  /* eslint-disable no-console */
  console.groupCollapsed(
    `%cAPI  %c/${config.url}`,
    'font-weight: 600; color: default;',
    'font-weight: 400; color: black;'
  );
  console.log(`URL: %c${config.baseURL}${config.url}`, 'color: #137AF8');
  const headers = {
    ...config.headers,
    ...config.headers.common,
    ...config.headers[config.method || 'get'],
  };
  delete headers.get;
  delete headers.post;
  delete headers.put;
  delete headers.delete;
  delete headers.patch;
  delete headers.head;
  console.log('Headers: ', headers);
  if (config.params) {
    console.log('Parameters: ', config.params);
  }
  if (config.data) {
    console.log(`GraphQL:\n%c${Utils.formatGraphql(config.data.query)}`, 'color: #137AF8');
    if (config.data.variables) {
      console.log('Variables: ', config.data.variables);
    }
  }
  /* eslint-enable no-console */
  return config;
});

function query(q: string): GraphQlBody {
  return { query: q };
}

function mutation(mutationString: string, vars: { [variableName: string]: any }): GraphQlBody {
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

const showSearchData = `id name originalName`;

const showData = `id name originalName website image`;

const episodeSearchData = `id name season number absoluteNumber`;

const episodeData = `
  id absoluteNumber number season name 
  timestamps {
    id at typeId
  }
  show { 
    ${showData} 
  }
`;

const episodeUrlNoEpisodeData = `
  url
  createdAt
`;

const episodeUrlData = `
  ${episodeUrlNoEpisodeData}
  episode {
    ${episodeData}
  }
`;

const timestampData = `
  id
  at
  typeId
`;

/* eslint-disable no-console */
async function sendGraphql<Q extends string, D>(data: any): Promise<{ data: { [field in Q]: D } }> {
  try {
    const token = await Browser.storage.getItem<string>('token');
    const response = await axios.post('graphql', data, {
      headers: {
        Authorization: token ? `Bearer ${token}` : undefined,
      },
    });
    if (response.data?.errors) {
      const error = new Error(
        `GraphQL Request failed with ${response.data.errors.length} errors`
      ) as AxiosError;
      error.response = response;
      throw error;
    }

    console.log('Response: ', response.data);
    console.groupEnd();

    return response.data;
  } catch (err) {
    console.error(err.message, {
      status: err.response.status,
      headers: err.response.headers,
      errors: err.response.data.errors,
      response: err.response,
    });
    console.groupEnd();
    throw err;
  }
}
/* eslint-enable no-console */

export default as<Api.Implementation>({
  async loginManual(username, password): Promise<Api.LoginResponse> {
    const q = query(
      `{
        login(usernameEmail: "${username}", passwordHash: "${md5(password)}") {
          ${loginData}
        }
      }`
    );
    const response = await sendGraphql<'login', Api.LoginResponse>(q);
    return response.data.login;
  },

  async loginRefresh(refreshToken): Promise<Api.LoginResponse> {
    const q = query(
      `{
        loginRefresh(refreshToken: "${refreshToken}") {
          ${loginData}
        }
      }`
    );
    const response = await sendGraphql<'login', Api.LoginResponse>(q);
    return response.data.login;
  },

  async updatePreferences(prefs): Promise<void> {
    const m = mutation(
      `mutation SavePreferences($prefs: InputPreferences!) {
        savePreferences(preferences: $prefs) {
          ${preferencesData}
        }
      }`,
      {
        prefs,
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
    const q = query(`{
      searchShows(search: "${name}", limit: 5) {
        ${showSearchData}
      }
    }`);
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
    const q = query(`{
      searchEpisodes(${params.join(', ')}) {
        ${episodeSearchData}
      }
    }`);
    console.log({ q });
    const response = await sendGraphql<'searchEpisodes', Api.EpisodeSearchResult[]>(q);
    return response.data.searchEpisodes;
  },

  async createEpisodeUrl(data, episodeId): Promise<Api.EpisodeUrl> {
    const m = mutation(
      `mutation CreateEpisodeUrl($data: InputEpisodeUrl!, $episodeId: ID!) {
        createEpisodeUrl(episodeUrlInput: $data, episodeId: $episodeId) {
          ${episodeUrlData}
        }
      }`,
      {
        data,
        episodeId,
      }
    );
    const response = await sendGraphql<'createEpisodeUrl', Api.EpisodeUrl>(m);
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
      `{
        findEpisodeUrl(episodeUrl: "${url}") {
          ${episodeUrlData}
        }
      }`
    );
    const response = await sendGraphql<'findEpisodeUrl', Api.EpisodeUrl>(q);
    return response.data.findEpisodeUrl;
  },

  async createTimestamp(
    episodeId: string,
    { at, typeId }: Api.InputTimestamp
  ): Promise<Api.Timestamp> {
    const m = mutation(
      `mutation CreateTimestamp($data: InputTimestamp!, $episodeId: ID!) {
        createTimestamp(timestampInput: $data, episodeId: $episodeId) {
          ${timestampData}
        }
      }`,
      {
        episodeId,
        data: { at, typeId },
      }
    );
    const response = await sendGraphql<'createTimestamp', Api.Timestamp>(m);
    return response.data.createTimestamp;
  },
  async updateTimestamp({ id, at, typeId }: Api.Timestamp): Promise<Api.Timestamp> {
    const m = mutation(
      `mutation UpdateTimestamp($data: InputTimestamp!, $timestampId: ID!) {
        updateTimestamp(newTimestamp: $data, timestampId: $timestampId) {
          ${timestampData}
        }
      }`,
      {
        timestampId: id,
        data: {
          at,
          typeId,
        },
      }
    );
    const response = await sendGraphql<'createTimestamp', Api.Timestamp>(m);
    return response.data.createTimestamp;
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
    const response = await sendGraphql<'createTimestamp', Api.Timestamp>(m);
    return response.data.createTimestamp;
  },
});
