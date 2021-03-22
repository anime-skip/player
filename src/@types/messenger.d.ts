type AllMessageTypes = MessageTypes | ApiMessageTypes | ParentMessageTypes | RuntimeMessageTypes;

interface AllMessagePayloads
  extends MessagePayloadMap<AllMessageTypes>,
    ApiMessagePayloadMap,
    ParentMessagePayloadMap,
    RuntimeMessagePayloadMap {}

interface AllMessageResponses
  extends MessageResponseMap<AllMessageTypes>,
    ApiMessageResponseMap,
    ParentMessageResponseMap,
    RuntimeMessageResponseMap {}

//#region Generic Messenger

type MessageTypes = string;

type MessagePayloadMap<K extends MessageTypes> = { [type in K]: any };

type MessageResponseMap<K extends MessageTypes> = { [type in K]: any };

type MessageListener<K extends MessageTypes> = (
  payload: MessagePayloadMap<MessageTypes>[K],
  sender: browser.runtime.MessageSender
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
  updateEpisode: { episodeId: string; newEpisode: Api.InputEpisode };

  createEpisodeUrl: { episodeId: string; data: Api.InputEpisodeUrl };
  deleteEpisodeUrl: string;
  fetchEpisodeByUrl: string;
  fetchEpisodeByName: { name: string; showName: string };
  updateEpisodeUrl: { episodeUrl: string; newEpisodeUrl: Api.InputEpisodeUrl };

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
  updateEpisode: Api.Episode;

  createEpisodeUrl: Api.EpisodeUrlNoEpisode;
  deleteEpisodeUrl: Api.EpisodeUrlNoEpisode;
  fetchEpisodeByUrl: Api.EpisodeUrl;
  fetchEpisodeByName: Api.ThirdPartyEpisode[];
  updateEpisodeUrl: Api.EpisodeUrlNoEpisode;

  createTimestamp: Api.Timestamp;
  updateTimestamp: Api.Timestamp;
  deleteTimestamp: Api.Timestamp;
}

type ApiMessageListener<T extends ApiMessageTypes> = (
  payload: ApiMessagePayloadMap[T],
  sender: browser.runtime.MessageSender
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
  payload: ParentMessagePayloadMap[T],
  sender: browser.runtime.MessageSender
) => Promise<ParentMessageResponseMap[T]>;

type ParentMessageListenerMap = { [type in ParentMessageTypes]: ParentMessageListener<type> };

//#endregion

//#region Runtime Messenger

type RuntimeMessageTypes =
  | '@anime-skip/open-options'
  | '@anime-skip/open-popup'
  | '@anime-skip/get-url';

interface RuntimeMessagePayloadMap extends MessagePayloadMap<RuntimeMessageTypes> {
  '@anime-skip/open-options': undefined;
  '@anime-skip/open-popup': undefined;
  '@anime-skip/get-url': undefined;
}

interface RuntimeMessageResponseMap extends MessageResponseMap<RuntimeMessageTypes> {
  '@anime-skip/open-options': void;
  '@anime-skip/open-popup': void;
  '@anime-skip/get-url': string | undefined;
}

type RuntimeMessageListener<T extends RuntimeMessageTypes> = (
  payload: RuntimeMessagePayloadMap[T],
  sender: browser.runtime.MessageSender
) => Promise<RuntimeMessageResponseMap[T]>;

type RuntimeMessageListenerMap = { [type in RuntimeMessageTypes]: RuntimeMessageListener<type> };

//#endregion
