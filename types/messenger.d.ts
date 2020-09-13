type AllMessageTypes = MessageTypes | ApiMessageTypes | ParentMessageTypes;

interface AllMessagePayloads
  extends MessagePayloadMap<AllMessageTypes>,
    ApiMessagePayloadMap,
    ParentMessagePayloadMap {}

interface AllMessageResponses
  extends MessageResponseMap<AllMessageTypes>,
    ApiMessageResponseMap,
    ParentMessageResponseMap {}

//#region Generic Messenger

type MessageTypes = string;

type MessagePayloadMap<K extends MessageTypes> = { [type in K]: any };

type MessageResponseMap<K extends MessageTypes> = { [type in K]: any };

type MessageListener<K extends MessageTypes> = (
  payload: MessagePayloadMap<MessageTypes>[K]
) => Promise<MessageResponseMap<MessageTypes>[K]>;

type MessageListenerMap<K extends MessageTypes> = { [type in K]: MessageListener<any> };

//#endregion

//#region API Messenger

type ApiMessageTypes = keyof Api.Implementation;

type ApiMessageTypeListenerMap = MessageListenerMap<ApiMessageTypes>;

interface ApiMessagePayloadMap extends MessagePayloadMap<ApiMessageTypes> {
  loginManual: { username: string; password: string };
  loginRefresh: string;

  updatePreferences: Api.Preferences;

  createShow: Api.InputShow;
  searchShows: string;

  createEpisode: { data: Api.InputEpisode; showId: string };
  searchEpisodes: { name: string; showId?: string };

  createEpisodeUrl: { episodeId: string; data: Api.InputEpisodeUrl };
  deleteEpisodeUrl: string;
  fetchEpisodeByUrl: string;

  createTimestamp: { episodeId: string; data: Api.InputTimestamp };
  updateTimestamp: Api.Timestamp;
  deleteTimestamp: string;
}

interface ApiMessageResponseMap extends MessageResponseMap<ApiMessageTypes> {
  loginManual: Api.LoginResponse;
  loginRefresh: Api.LoginRefreshResponse;

  updatePreferences: void;

  createShow: Api.Show;
  searchShows: Api.ShowSearchResult[];

  createEpisode: Api.EpisodeSearchResult;
  searchEpisodes: Api.EpisodeSearchResult[];

  createEpisodeUrl: Api.EpisodeUrl;
  deleteEpisodeUrl: Api.EpisodeUrlNoEpisode;
  fetchEpisodeByUrl: Api.EpisodeUrl;

  createTimestamp: Api.Timestamp;
  updateTimestamp: Api.Timestamp;
  deleteTimestamp: Api.Timestamp;
}

type ApiMessageListener<T extends ApiMessageTypes> = (
  payload: ApiMessagePayloadMap[T]
) => Promise<ApiMessageResponseMap[T]>;

type ApiMessageListenerMap = { [type in ApiMessageTypes]: ApiMessageListener<type> };

//#endregion

//#region Parent Messenger

type ParentMessageTypes = '@anime-skip/inferEpisodeInfo';

interface ParentMessagePayloadMap extends MessagePayloadMap<ParentMessageTypes> {
  '@anime-skip/inferEpisodeInfo': undefined;
}

interface ParentMessageResponseMap extends MessageResponseMap<ParentMessageTypes> {
  '@anime-skip/inferEpisodeInfo': InferredEpisodeInfo;
}

type ParentMessageListener<T extends ParentMessageTypes> = (
  payload: ParentMessagePayloadMap[T]
) => Promise<ParentMessageResponseMap[T]>;

type ParentMessageListenerMap = { [type in ParentMessageTypes]: ParentMessageListener<type> };

//#endregion
