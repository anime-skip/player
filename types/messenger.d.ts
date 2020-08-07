declare type MessageType = keyof Api.Implementation;
declare type MessageTypeListenerMap<T> = Partial<{ [type in MessageType]: T }>;
declare type MessageTypeMap<T> = Record<MessageType, T>;

declare interface MessagePayload extends Implements<MessageTypeMap<any>, MessagePayload> {
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

declare interface MessageResponse extends Implements<MessageTypeMap<any>, MessageResponse> {
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

declare type MessageListener<T extends MessageType> = (
  payload: MessagePayload[T]
) => Promise<MessageResponse[T]>;
declare type MessageListeners = { [type in MessageType]: MessageListener<type> };
