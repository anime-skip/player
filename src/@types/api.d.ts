type AxiosResponse<T> = import('axios').AxiosResponse<T>;

type GraphQlVariables = { [variableName: string]: unknown };

declare interface GraphQlBody {
  query?: string;
  variables?: GraphQlVariables;
}

declare namespace Api {
  type TimestampSource = 'ANIME_SKIP' | 'BETTER_VRV';

  interface Implementation {
    loginManual(username: string, password: string): Promise<LoginResponse>;
    loginRefresh(refreshToken: string): Promise<LoginRefreshResponse>;
    updatePreferences(preferences: Partial<Preferences>): Promise<void>;

    createShow(data: InputShow): Promise<Show>;
    searchShows(name: string): Promise<ShowSearchResult[]>;

    createEpisode(data: InputEpisode, showId: string): Promise<EpisodeSearchResult>;
    searchEpisodes(name: string, showId?: string): Promise<EpisodeSearchResult[]>;
    updateEpisode(id: string, input: InputEpisode): Promise<Episode>;

    createEpisodeUrl(data: InputEpisodeUrl, episodeId: string): Promise<EpisodeUrlNoEpisode>;
    deleteEpisodeUrl(episodeUrl: string): Promise<EpisodeUrlNoEpisode>;
    fetchEpisodeByUrl(url: string): Promise<EpisodeUrl>;
    fetchEpisodeByName(name: string, showName: string): Promise<ThirdPartyEpisode[]>;
    updateEpisodeUrl(url: string, inputUrl: InputEpisodeUrl): Promise<EpisodeUrlNoEpisode>;

    createTimestamp(episodeId: string, timestamp: InputTimestamp): Promise<Timestamp>;
    updateTimestamp(newTimestamp: Timestamp): Promise<Timestamp>;
    deleteTimestamp(timestampId: string): Promise<Timestamp>;

    findTemplateByDetails(
      episodeId?: string,
      showName?: string,
      season?: string
    ): Promise<TemplateWithTimestamps | undefined>;
    createTemplate(newTemplate: InputTemplate): Promise<Template>;
    updateTemplate(templateId: string, newTemplate: InputTemplate): Promise<Template>;
    deleteTemplate(templateId: string): Promise<Template>;
    addTimestampToTemplate(templateTimestamp: InputTemplateTimestamp): Promise<TemplateTimestamp>;
    removeTimestampFromTemplate(
      templateTimestamp: InputTemplateTimestamp
    ): Promise<TemplateTimestamp>;
  }

  interface Preferences {
    enableAutoSkip: boolean;
    enableAutoPlay: boolean;
    minimizeToolbarWhenEditing: boolean;
    hideTimelineWhenMinimized: boolean;

    skipBranding: boolean;
    skipIntros: boolean;
    skipNewIntros: boolean;
    skipMixedIntros: boolean;
    skipRecaps: boolean;
    skipFiller: boolean;
    skipCanon: boolean;
    skipTransitions: boolean;
    skipTitleCard: boolean;
    skipCredits: boolean;
    skipNewCredits: boolean;
    skipMixedCredits: boolean;
    skipPreview: boolean;
  }

  interface Account {
    username: string;
    emailVerified: boolean;
    preferences: Preferences;
  }

  interface InputShow {
    name: string;
    originalName?: string;
    website?: string;
    image?: string;
  }

  interface ShowSearchResult {
    id: string;
    name: string;
    originalName?: string;
  }

  interface Show extends ShowSearchResult {
    website?: string;
    image?: string;
  }

  interface ThirdPartyShow {
    name: string;
  }

  interface EpisodeUrlNoEpisode {
    url: string;
    createdAt: number;
    duration?: number;
    timestampsOffset?: number;
  }

  interface EpisodeUrl extends EpisodeUrlNoEpisode {
    episode: Episode;
  }

  interface InputEpisodeUrl {
    url: string;
    duration?: number;
    timestampsOffset?: number;
  }

  interface EpisodeSearchResult {
    id: string;
    name?: string;
    season?: string;
    absoluteNumber?: string;
    number?: string;
    baseDuration?: number;
  }

  interface InputEpisode {
    name?: string;
    season?: string;
    number?: string;
    absoluteNumber?: string;
    baseDuration?: number;
  }

  interface Episode extends EpisodeSearchResult {
    show?: Show;
    timestamps: Timestamp[];
    template?: Template;
  }

  type TemplateType = 'SHOW' | 'SEASONS';

  interface InputTemplate {
    showId: string;
    sourceEpisodeId: string;
    type: TemplateType;
    seasons?: string[];
  }

  interface Template {
    id: string;
    showId: string;
    sourceEpisodeId: string;
    type: TemplateType;
    seasons?: Array<string>;
    timestampIds: Array<string>;
  }

  interface TemplateWithTimestamps extends Template {
    sourceEpisode?: {
      baseDuration?: number;
    };
    timestamps?: Api.Timestamp[];
  }

  interface TemplateWithAmbiguousTimestamps extends Template {
    sourceEpisode?: {
      baseDuration?: number;
    };
    timestamps?: Api.AmbiguousTimestamp[];
  }

  interface InputTemplateTimestamp {
    templateId: string;
    timestampId: string;
  }

  type ThirdPartyEpisode =
    | {
        id: string;
        season?: string;
        number?: string;
        absoluteNumber?: string;
        name?: string;
        source: 'ANIME_SKIP';
        baseDuration?: number;
        timestamps: ThirdPartyTimestamp[];
        show: ThirdPartyShow;
      }
    | {
        id?: string;
        season?: string;
        number?: string;
        absoluteNumber?: string;
        name?: string;
        source: 'BETTER_VRV';
        baseDuration?: number;
        timestamps: ThirdPartyTimestamp[];
        show: ThirdPartyShow;
      };

  interface InputTimestamp {
    at: number;
    typeId: string;
    source?: TimestampSource;
  }

  interface Timestamp extends InputTimestamp {
    id: string;
    source: TimestampSource;
  }

  interface AmbiguousTimestamp extends InputTimestamp {
    /**
     * It is a number when it is local, randomly generated. It is remote when the id is a string (GUID)
     */
    id: number | string;
    source: TimestampSource;
    edited?: boolean;
  }

  interface ThirdPartyTimestamp {
    id?: string;
    at: number;
    typeId: string;
  }

  interface TimestampType {
    id: string;
    name: string;
    description: string;
  }

  interface LoginResponse {
    authToken: string;
    refreshToken: string;
    account: Account;
  }

  interface LoginRefreshResponse {
    authToken: string;
    refreshToken: string;
  }
}
