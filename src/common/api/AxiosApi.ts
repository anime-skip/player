import Axios, { AxiosError } from 'axios';
import Utils from '@/common/utils/Utils';
import Browser from '@/common/utils/Browser';
import md5 from 'md5';
import { as } from '../utils/GlobalUtils';

const axios = Axios.create({
  baseURL: 'http://localhost:8000/',
  // baseURL: 'http://api.anime-skip.com/',
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

const episodeSearchData = `id name season number absoluteNumber`;

const episodeData = `
  id absoluteNumber number season name 
  timestamps {
    id at typeId
  }
  show { id name originalName website image }
`;

const episodeUrlData = `
  episode {
    ${episodeData}
  }
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
  async loginManual(username: string, password: string): Promise<Api.LoginResponse> {
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

  async loginRefresh(refreshToken: string): Promise<Api.LoginResponse> {
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

  async updatePreferences(prefs: Api.Preferences): Promise<void> {
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

  async searchShows(name: string): Promise<Api.ShowSearchResult[]> {
    const q = query(`{
      searchShows(search: "${name}", limit: 5) {
        ${showSearchData}
      }
    }`);
    const response = await sendGraphql<'searchShows', Api.ShowSearchResult[]>(q);
    return response.data.searchShows;
  },

  async searchEpisodes(name: string): Promise<Api.EpisodeSearchResult[]> {
    const q = query(`{
      searchEpisodes(search: "${name}", limit: 5) {
        ${episodeSearchData}
      }
    }`);
    console.log({ q });
    const response = await sendGraphql<'searchEpisodes', Api.EpisodeSearchResult[]>(q);
    return response.data.searchEpisodes;
  },

  async fetchEpisodeByUrl(url: string): Promise<Api.EpisodeUrl> {
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
});
