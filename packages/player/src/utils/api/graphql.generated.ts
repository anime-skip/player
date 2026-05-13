/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> =
  | T
  | {
      [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never;
    };
import type { DocumentNode } from 'graphql';
import type { GraphQLClient, RequestOptions } from 'graphql-request';
import gql from 'graphql-tag';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
type GraphQLClientRequestHeaders = RequestOptions['requestHeaders'];
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
  Time: { input: string; output: string };
  UInt: { input: string; output: string };
};

/** Account info that should only be accessible by the authorized user */
export type Account = {
  __typename?: 'Account';
  /**
   * The linking object that associates a user to the shows they are admins of.
   *
   * > This data is also accessible on the `User` model. It has been added here for convenience
   */
  adminOfShows: Array<ShowAdmin>;
  createdAt: Scalars['Time']['output'];
  deletedAt?: Maybe<Scalars['Time']['output']>;
  email: Scalars['String']['output'];
  /** If the user's email is verified. Emails must be verified before the user can call a mutation */
  emailVerified: Scalars['Boolean']['output'];
  id: Scalars['ID']['output'];
  /** The user's preferences */
  preferences: Preferences;
  /** Url to an image that is the user's profile picture */
  profileUrl: Scalars['String']['output'];
  /** The user's administrative role. Most users are `Role.USER` */
  role: Role;
  /** Unique string slug that is the easy to remember identifier */
  username: Scalars['String']['output'];
};

export type ApiClient = {
  __typename?: 'ApiClient';
  appName: Scalars['String']['output'];
  createdAt: Scalars['Time']['output'];
  createdBy: User;
  createdByUserId: Scalars['ID']['output'];
  deletedAt?: Maybe<Scalars['Time']['output']>;
  deletedBy?: Maybe<User>;
  deletedByUserId?: Maybe<Scalars['ID']['output']>;
  description: Scalars['String']['output'];
  id: Scalars['String']['output'];
  rateLimitRpm?: Maybe<Scalars['UInt']['output']>;
  updatedAt: Scalars['Time']['output'];
  updatedBy: User;
  updatedByUserId: Scalars['ID']['output'];
  /** The user this client belongs to */
  user: User;
  /** The ID of the user this client belongs to */
  userId: Scalars['ID']['output'];
};

export type ApiClientChanges = {
  appName?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  /** Rate limits can only be changed by admins */
  rateLimitRpm?: InputMaybe<Scalars['UInt']['input']>;
};

/**
 * The base model has all the fields you would expect a fully fleshed out item in the database would
 * have. It is used to track who create, updated, and deleted items
 */
export type BaseModel = {
  /** Time that the item was created at */
  createdAt: Scalars['Time']['output'];
  /** The entire user that created the item */
  createdBy: User;
  /** The user's `id` that created the item */
  createdByUserId: Scalars['ID']['output'];
  /** Time that the item was updated at. If this value is present, the item is considered deleted */
  deletedAt?: Maybe<Scalars['Time']['output']>;
  /** The entire user that deleted the item */
  deletedBy?: Maybe<User>;
  /** The user's `id` that deleted the item */
  deletedByUserId?: Maybe<Scalars['ID']['output']>;
  /** Unique, v4 UUID. When asked for an `id` of an object, use this field */
  id: Scalars['ID']['output'];
  /** Time that the item was updated at */
  updatedAt: Scalars['Time']['output'];
  /** The entire user that last updated the item */
  updatedBy: User;
  /** The user's `id` that last updated the item */
  updatedByUserId: Scalars['ID']['output'];
};

/** Color theme the user prefers */
export enum ColorTheme {
  AnimeSkipBlue = 'ANIME_SKIP_BLUE',
  CrunchyrollOrange = 'CRUNCHYROLL_ORANGE',
  FunimationPurple = 'FUNIMATION_PURPLE',
  /** Change to match where you're watching */
  PerService = 'PER_SERVICE',
  VrvYellow = 'VRV_YELLOW',
}

export type CreateApiClient = {
  appName: Scalars['String']['input'];
  description: Scalars['String']['input'];
};

/**
 * Basic information about an episode, including season, numbers, a list of timestamps, and urls that
 * it can be watched at
 */
export type Episode = BaseModel & {
  __typename?: 'Episode';
  /**
   * The absolute episode number out of all the episodes of the show. Generally only regular episodes
   * should have this field
   */
  absoluteNumber?: Maybe<Scalars['String']['output']>;
  /**
   * The duration of the episode's first url, which can be used to calculate a suggested offset for new
   * episode urls. Episodes at different URLs have different branding intros, and that difference can
   * be computed using: `EpisodeUrl.duration - Episode.baseDuration`
   * Generally, this works because each service has it's own branding at the beginning of the show, not
   * at the end of it
   */
  baseDuration?: Maybe<Scalars['Float']['output']>;
  createdAt: Scalars['Time']['output'];
  createdBy: User;
  createdByUserId: Scalars['ID']['output'];
  deletedAt?: Maybe<Scalars['Time']['output']>;
  deletedBy?: Maybe<User>;
  deletedByUserId?: Maybe<Scalars['ID']['output']>;
  id: Scalars['ID']['output'];
  /** The episode's name */
  name?: Maybe<Scalars['String']['output']>;
  /**
   * The episode number in the current season
   *
   * ### Examples:
   *
   * - "1"
   * - "2"
   * - "5.5"
   * - "OVA 1"
   */
  number?: Maybe<Scalars['String']['output']>;
  /**
   * The season number that this episode belongs to
   *
   * ### Examples:
   *
   * - "1"
   * - "1 Directors Cut"
   * - "2"
   * - "Movies"
   */
  season?: Maybe<Scalars['String']['output']>;
  /** The show that the episode belongs to */
  show: Show;
  /** The id of the show that the episode belongs to */
  showId: Scalars['ID']['output'];
  /** If the episode is the source episode for a `Template`, this will resolve to that template */
  template?: Maybe<Template>;
  /**
   * The list of current timestamps.
   *
   * Timestamps are apart apart of the `Episode` instead of the `EpisodeUrl` so that they can be shared
   * between urls and not need duplicate data
   */
  timestamps: Array<Timestamp>;
  updatedAt: Scalars['Time']['output'];
  updatedBy: User;
  updatedByUserId: Scalars['ID']['output'];
  /** The list of urls and services that the episode can be accessed from */
  urls: Array<EpisodeUrl>;
  /**
   * List the user reports for the episode. Requires the REVIEWER role.
   *
   * > `@hasRole(role: REVIEWER)` - The user must have the `REVIEWER` role to query this property.
   */
  userReports: Array<UserReport>;
};

/**
 * Basic information about an episode, including season, numbers, a list of timestamps, and urls that
 * it can be watched at
 */
export type EpisodeUserReportsArgs = {
  resolved?: InputMaybe<Scalars['Boolean']['input']>;
};

/**
 * Which of the supported services the `EpisodeUrl` was created for. This is a simple enum that allows
 * for simple checks, but this data can also be pulled from the url in the case of UNKNOWN
 */
export enum EpisodeSource {
  /** Data is from <crunchyroll.com> and <beta.crunchyroll.com> */
  Crunchyroll = 'CRUNCHYROLL',
  /** Data is from <funimation.com> */
  Funimation = 'FUNIMATION',
  /** Data came from an external source */
  Unknown = 'UNKNOWN',
  /** Data is from <vrv.co> */
  Vrv = 'VRV',
}

/** Stores information about what where an episode can be watched from */
export type EpisodeUrl = {
  __typename?: 'EpisodeUrl';
  createdAt: Scalars['Time']['output'];
  createdBy: User;
  createdByUserId: Scalars['ID']['output'];
  /**
   * The length of the episode at this url. For more information on why this field exists, check out
   * the `Episode.baseDuration`. If an `Episode` does not have a duration, that `Episode` and this
   * `EpisodeUrl` should be given the same value, and the `EpisodeUrl.timestampsOffset` should be set to 0
   */
  duration?: Maybe<Scalars['Float']['output']>;
  /** The `Episode` that this url belongs to */
  episode: Episode;
  /** The `Episode.id` that this url belongs to */
  episodeId: Scalars['ID']['output'];
  /** What service this url points to. This is computed when the `EpisodeUrl` is created */
  source: EpisodeSource;
  /**
   * How much a episode's timestamps should be offset for this `EpisodeUrl`, since different services
   * have different branding animations, leading to offsets between services. This field can be edited
   * to whatever, but it should be suggested to be `EpisodeUrl.duration - Episode.baseDuration`.
   * It can be positive or negative.
   */
  timestampsOffset?: Maybe<Scalars['Float']['output']>;
  updatedAt: Scalars['Time']['output'];
  updatedBy: User;
  updatedByUserId: Scalars['ID']['output'];
  /**
   * The url that would take a user to watch the `episode`.
   *
   * This url should be stripped of all query params.
   */
  url: Scalars['String']['output'];
};

export type ExternalLink = {
  __typename?: 'ExternalLink';
  service: Scalars['String']['output'];
  serviceId?: Maybe<Scalars['String']['output']>;
  show: Show;
  showId: Scalars['ID']['output'];
  url: Scalars['String']['output'];
};

/** Allowed services for show's external links */
export enum ExternalService {
  Anilist = 'ANILIST',
}

/** Data required to create a new `Episode`. See `Episode` for a description of each field */
export type InputEpisode = {
  /** See `Episode.absoluteNumber` */
  absoluteNumber?: InputMaybe<Scalars['String']['input']>;
  /** See `Episode.baseDuration` */
  baseDuration: Scalars['Float']['input'];
  /** See `Episode.name` */
  name?: InputMaybe<Scalars['String']['input']>;
  /** See `Episode.number` */
  number?: InputMaybe<Scalars['String']['input']>;
  /** See `Episode.season` */
  season?: InputMaybe<Scalars['String']['input']>;
};

/** Data required to create a new `EpisodeUrl`. See `EpisodeUrl` for a description of each field */
export type InputEpisodeUrl = {
  duration?: InputMaybe<Scalars['Float']['input']>;
  timestampsOffset?: InputMaybe<Scalars['Float']['input']>;
  url: Scalars['String']['input'];
};

export type InputExistingTimestamp = {
  /** The id of the timestamp you want to modify */
  id: Scalars['ID']['input'];
  /** The new values for the timestamp */
  timestamp: InputTimestamp;
};

/**
 * Data used to update a user's `Preferences`. See `Preferences` for a description of each field. If a
 * field is not passed or passed as `null`, it will leave the value as is and skip updating it
 */
export type InputPreferences = {
  colorTheme?: InputMaybe<ColorTheme>;
  enableAutoPlay?: InputMaybe<Scalars['Boolean']['input']>;
  enableAutoSkip?: InputMaybe<Scalars['Boolean']['input']>;
  hideTimelineWhenMinimized?: InputMaybe<Scalars['Boolean']['input']>;
  minimizeToolbarWhenEditing?: InputMaybe<Scalars['Boolean']['input']>;
  skipBranding?: InputMaybe<Scalars['Boolean']['input']>;
  skipCanon?: InputMaybe<Scalars['Boolean']['input']>;
  skipCredits?: InputMaybe<Scalars['Boolean']['input']>;
  skipFiller?: InputMaybe<Scalars['Boolean']['input']>;
  skipIntros?: InputMaybe<Scalars['Boolean']['input']>;
  skipMixedCredits?: InputMaybe<Scalars['Boolean']['input']>;
  skipMixedIntros?: InputMaybe<Scalars['Boolean']['input']>;
  skipNewCredits?: InputMaybe<Scalars['Boolean']['input']>;
  skipNewIntros?: InputMaybe<Scalars['Boolean']['input']>;
  skipPreview?: InputMaybe<Scalars['Boolean']['input']>;
  skipRecaps?: InputMaybe<Scalars['Boolean']['input']>;
  skipTitleCard?: InputMaybe<Scalars['Boolean']['input']>;
  skipTransitions?: InputMaybe<Scalars['Boolean']['input']>;
};

/** Data required to create a new `Show`. See `Show` for a description of each field */
export type InputShow = {
  image?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  originalName?: InputMaybe<Scalars['String']['input']>;
  website?: InputMaybe<Scalars['String']['input']>;
};

/** Data required to create a new `ShowAdmin`. See `ShowAdmin` for a description of each field */
export type InputShowAdmin = {
  showId: Scalars['ID']['input'];
  userId: Scalars['ID']['input'];
};

/** Data required to create a new template. See `Template` for a description of each field */
export type InputTemplate = {
  seasons?: InputMaybe<Array<Scalars['String']['input']>>;
  showId: Scalars['ID']['input'];
  sourceEpisodeId: Scalars['ID']['input'];
  type: TemplateType;
};

/** Data required to modify the timestamps on a template */
export type InputTemplateTimestamp = {
  templateId: Scalars['ID']['input'];
  timestampId: Scalars['ID']['input'];
};

/** Data required to create a new `Timestamp`. See `Timestamp` for a description of each field */
export type InputTimestamp = {
  at: Scalars['Float']['input'];
  source?: InputMaybe<TimestampSource>;
  typeId: Scalars['ID']['input'];
};

export type InputTimestampOn = {
  /** The episode id the timestamp will be created on */
  episodeId: Scalars['ID']['input'];
  /** The new values for the timestamp */
  timestamp: InputTimestamp;
};

/** Data required to create a new `TimestampType`. See `TimestampType` for a description of each field */
export type InputTimestampType = {
  description: Scalars['String']['input'];
  name: Scalars['String']['input'];
};

export type InputUserReport = {
  /** The ID of an episode if you're reporting an issue with a specific episode. */
  episodeId?: InputMaybe<Scalars['ID']['input']>;
  /**
   * The URL of the epiosde URL if you're reporting an issue with a specific episode URL.
   *
   * This is different from `reportedFromUrl`, this is related to an EpisodeUrl model, not the url the report is coming from.
   */
  episodeUrl?: InputMaybe<Scalars['String']['input']>;
  /** The content of the report stating what is wrong with the reported data. */
  message: Scalars['String']['input'];
  /** The URL the user made the report from so the reviewer can easily navigate to it. */
  reportedFromUrl: Scalars['String']['input'];
  /** The ID of an show if you're reporting an issue with a specific show. */
  showId?: InputMaybe<Scalars['ID']['input']>;
  /** The ID of a timestamp if you're reporting an issue with a specific timestamp. */
  timestampId?: InputMaybe<Scalars['ID']['input']>;
};

/** When logging in with a password or refresh token, you can get new tokens and account info */
export type LoginData = {
  __typename?: 'LoginData';
  /** The personal account information of the user that got authenticated */
  account: Account;
  /** A JWT that should be used in the header of all requests: `Authorization: Bearer <authToken>` */
  authToken: Scalars['String']['output'];
  /** A JWT used for the `loginRefresh` query to get new `LoginData` */
  refreshToken: Scalars['String']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  addExternalLink: ExternalLink;
  /** Add a timestamp to an existing template */
  addTimestampToTemplate: TemplateTimestamp;
  /**
   * Change a user's password by first confirming the old one. This is not a forgot password flow
   *
   * > Note the passwords aren't md5 hashes. The regular login will be moving to this as well eventually
   */
  changePassword: LoginData;
  /**
   * Create a user account. 3rd party applications will not have access to this function because of
   * `recaptchaResponse`. Redirect new users to create an account on <anime-skip.com>
   */
  createAccount: LoginData;
  /** Create a new API client for the authenticated user to use */
  createApiClient: ApiClient;
  /** Create an episode under a `Show` */
  createEpisode: Episode;
  /** Link an `Episode` to a service URL */
  createEpisodeUrl: EpisodeUrl;
  /** Create a show and optionally become an admin */
  createShow: Show;
  /**
   * Give admin privilege to a user for a show.
   *
   * > `@isShowAdmin` - You need to be an admin of the show to do this action
   */
  createShowAdmin: ShowAdmin;
  /** Make changes to an existing template */
  createTemplate: Template;
  /** Add a timestamp to an `Episode` */
  createTimestamp: Timestamp;
  /**
   * Create a timestamp type
   *
   * > `@hasRole(role: ADMIN)` - The user must have the `ADMIN` role to perform this action
   */
  createTimestampType: TimestampType;
  /** Report an issue with a single timestamp, episode, episode URL, or show. */
  createUserReport: UserReport;
  /** Handle a deleteToken from `deleteAccountRequest` and actually delete the user's account */
  deleteAccount: Account;
  /**
   * Request your account be deleted. The user will receive an email with a link to confirm deleting
   * their account
   */
  deleteAccountRequest: Account;
  /** Delete one of the authenticated user's API clients */
  deleteApiClient: ApiClient;
  /**
   * Delete an episode and all it's child data
   *
   * > `@isShowAdmin` - You need to be an admin of the show to do this action
   */
  deleteEpisode: Episode;
  /**
   * Unlink an `Episode` to from service URL
   *
   * > `@isShowAdmin` - You need to be an admin of the show to do this action
   */
  deleteEpisodeUrl: EpisodeUrl;
  /**
   * Delete a show and all it's children (episodes, episode urls, timestamps, admins, etc)
   *
   * > `@hasRole(role: ADMIN)` - The user must have the `ADMIN` role to perform this action
   */
  deleteShow: Show;
  /**
   * Remove admin privileges from a user for a show.
   *
   * > `@isShowAdmin` - You need to be an admin of the show to do this action
   */
  deleteShowAdmin: ShowAdmin;
  /**
   * Delete an existing template
   *
   * > `@isShowAdmin` - You need to be an admin of the show to do this action
   */
  deleteTemplate: Template;
  /** Delete a timestamp */
  deleteTimestamp: Timestamp;
  /**
   * Delete a timestamp type
   *
   * > `@hasRole(role: ADMIN)` - The user must have the `ADMIN` role to perform this action
   */
  deleteTimestampType: TimestampType;
  removeExternalLink: ExternalLink;
  /** Remove a timestamp from an existing template */
  removeTimestampFromTemplate: TemplateTimestamp;
  /**
   * The first step in the password reset process
   *
   * It sends an email containing a link to reset your password with. That link includes a token, the
   * `passwordResetToken`, that can be passed into the `resetPassword` mutation.
   *
   * > Because the `recaptchaResponse` is required, this can not be performed by 3rd parties
   */
  requestPasswordReset: Scalars['Boolean']['output'];
  /** Resend the verification email for the account of the authenticated user */
  resendVerificationEmail?: Maybe<Scalars['Boolean']['output']>;
  /**
   * The second step in the password reset process, coming after `requestPasswordReset`
   *
   * This step is pretty self explanatory, this is when the password is actually reset for a user
   */
  resetPassword: LoginData;
  /**
   * Mark a report as fixed
   *
   * > `@hasRole(role: REVIEWER)` - The user must have the `REVIEWER` role to perform this operation.
   */
  resolveUserReport: UserReport;
  /** Update user preferences */
  savePreferences: Preferences;
  /** Update one of the authenticated user's API clients */
  updateApiClient: ApiClient;
  /** Update episode info */
  updateEpisode: Episode;
  /** Update episode url info */
  updateEpisodeUrl: EpisodeUrl;
  /** Update show data */
  updateShow: Show;
  /** Make changes to an existing template */
  updateTemplate: Template;
  /** Update timestamp data */
  updateTimestamp: Timestamp;
  /**
   * Update a timestamp type
   *
   * > `@hasRole(role: ADMIN)` - The user must have the `ADMIN` role to perform this action
   */
  updateTimestampType: TimestampType;
  /** Will create, update, and delete timestamps as passed. Partial failures are completely rolled back */
  updateTimestamps: UpdatedTimestamps;
  /**
   * Callback to handle the verification token included in the email sent using
   * `resendVerificationEmail`
   */
  verifyEmailAddress: Account;
};

export type MutationAddExternalLinkArgs = {
  showId: Scalars['ID']['input'];
  url: Scalars['String']['input'];
};

export type MutationAddTimestampToTemplateArgs = {
  templateTimestamp: InputTemplateTimestamp;
};

export type MutationChangePasswordArgs = {
  confirmNewPassword: Scalars['String']['input'];
  newPassword: Scalars['String']['input'];
  oldPassword: Scalars['String']['input'];
};

export type MutationCreateAccountArgs = {
  email: Scalars['String']['input'];
  passwordHash: Scalars['String']['input'];
  recaptchaResponse: Scalars['String']['input'];
  username: Scalars['String']['input'];
};

export type MutationCreateApiClientArgs = {
  client: CreateApiClient;
};

export type MutationCreateEpisodeArgs = {
  episodeInput: InputEpisode;
  showId: Scalars['ID']['input'];
};

export type MutationCreateEpisodeUrlArgs = {
  episodeId: Scalars['ID']['input'];
  episodeUrlInput: InputEpisodeUrl;
};

export type MutationCreateShowArgs = {
  becomeAdmin: Scalars['Boolean']['input'];
  showInput: InputShow;
};

export type MutationCreateShowAdminArgs = {
  showAdminInput: InputShowAdmin;
};

export type MutationCreateTemplateArgs = {
  newTemplate: InputTemplate;
};

export type MutationCreateTimestampArgs = {
  episodeId: Scalars['ID']['input'];
  timestampInput: InputTimestamp;
};

export type MutationCreateTimestampTypeArgs = {
  timestampTypeInput: InputTimestampType;
};

export type MutationCreateUserReportArgs = {
  report?: InputMaybe<InputUserReport>;
};

export type MutationDeleteAccountArgs = {
  deleteToken: Scalars['String']['input'];
};

export type MutationDeleteAccountRequestArgs = {
  passwordHash: Scalars['String']['input'];
};

export type MutationDeleteApiClientArgs = {
  id: Scalars['String']['input'];
};

export type MutationDeleteEpisodeArgs = {
  episodeId: Scalars['ID']['input'];
};

export type MutationDeleteEpisodeUrlArgs = {
  episodeUrl: Scalars['String']['input'];
};

export type MutationDeleteShowArgs = {
  showId: Scalars['ID']['input'];
};

export type MutationDeleteShowAdminArgs = {
  showAdminId: Scalars['ID']['input'];
};

export type MutationDeleteTemplateArgs = {
  templateId: Scalars['ID']['input'];
};

export type MutationDeleteTimestampArgs = {
  timestampId: Scalars['ID']['input'];
};

export type MutationDeleteTimestampTypeArgs = {
  timestampTypeId: Scalars['ID']['input'];
};

export type MutationRemoveExternalLinkArgs = {
  showId: Scalars['ID']['input'];
  url: Scalars['String']['input'];
};

export type MutationRemoveTimestampFromTemplateArgs = {
  templateTimestamp: InputTemplateTimestamp;
};

export type MutationRequestPasswordResetArgs = {
  email: Scalars['String']['input'];
  recaptchaResponse: Scalars['String']['input'];
};

export type MutationResendVerificationEmailArgs = {
  recaptchaResponse: Scalars['String']['input'];
};

export type MutationResetPasswordArgs = {
  confirmNewPassword: Scalars['String']['input'];
  newPassword: Scalars['String']['input'];
  passwordResetToken: Scalars['String']['input'];
};

export type MutationResolveUserReportArgs = {
  id: Scalars['ID']['input'];
  resolvedMessage?: InputMaybe<Scalars['String']['input']>;
};

export type MutationSavePreferencesArgs = {
  preferences: InputPreferences;
};

export type MutationUpdateApiClientArgs = {
  changes: ApiClientChanges;
  id: Scalars['String']['input'];
};

export type MutationUpdateEpisodeArgs = {
  episodeId: Scalars['ID']['input'];
  newEpisode: InputEpisode;
};

export type MutationUpdateEpisodeUrlArgs = {
  episodeUrl: Scalars['String']['input'];
  newEpisodeUrl: InputEpisodeUrl;
};

export type MutationUpdateShowArgs = {
  newShow: InputShow;
  showId: Scalars['ID']['input'];
};

export type MutationUpdateTemplateArgs = {
  newTemplate: InputTemplate;
  templateId: Scalars['ID']['input'];
};

export type MutationUpdateTimestampArgs = {
  newTimestamp: InputTimestamp;
  timestampId: Scalars['ID']['input'];
};

export type MutationUpdateTimestampTypeArgs = {
  newTimestampType: InputTimestampType;
  timestampTypeId: Scalars['ID']['input'];
};

export type MutationUpdateTimestampsArgs = {
  create: Array<InputTimestampOn>;
  delete: Array<Scalars['ID']['input']>;
  update: Array<InputExistingTimestamp>;
};

export type MutationVerifyEmailAddressArgs = {
  validationToken: Scalars['String']['input'];
};

/**
 * Where all the user preferences are stored. This includes what timestamps the user doesn't want to
 * watch
 */
export type Preferences = {
  __typename?: 'Preferences';
  colorTheme: ColorTheme;
  createdAt: Scalars['Time']['output'];
  deletedAt?: Maybe<Scalars['Time']['output']>;
  /** Whether or not the user wants to auto-play the videos. Default: `true` */
  enableAutoPlay: Scalars['Boolean']['output'];
  /** Whether or not the user wants to automatically skip section. Default: `true` */
  enableAutoSkip: Scalars['Boolean']['output'];
  /**
   * When false, timeline is pinned to the bottom of the screen after inactivity. When true, it is
   * hidden completely
   */
  hideTimelineWhenMinimized: Scalars['Boolean']['output'];
  id: Scalars['ID']['output'];
  /**
   * Whether or not the bottom toolbar with the video progress and play button is minimized after
   * inactivity while editing
   */
  minimizeToolbarWhenEditing: Scalars['Boolean']['output'];
  /** Whether or not the user whats to skip branding timestamps. Default: `true` */
  skipBranding: Scalars['Boolean']['output'];
  /** Whether or not the user whats to skip canon content. Default: `false` */
  skipCanon: Scalars['Boolean']['output'];
  /** Whether or not the user whats to skip credits/outros. Default: `true` */
  skipCredits: Scalars['Boolean']['output'];
  /** Whether or not the user whats to skip filler content. Default: `true` */
  skipFiller: Scalars['Boolean']['output'];
  /** Whether or not the user whats to skip regular intros. Default: `true` */
  skipIntros: Scalars['Boolean']['output'];
  /** Whether or not the user whats to skip credits/outros that have plot progression rather than the standard animation. Default: `false` */
  skipMixedCredits: Scalars['Boolean']['output'];
  /** Whether or not the user whats to kip intros that have plot progression rather than the standard animation. Default: `false` */
  skipMixedIntros: Scalars['Boolean']['output'];
  /** Whether or not the user whats to skip the first of a credits/outro. Default: `false` */
  skipNewCredits: Scalars['Boolean']['output'];
  /** Whether or not the user whats to skip the first of an intro. Default: `false` */
  skipNewIntros: Scalars['Boolean']['output'];
  /** Whether or not to skip the next episode's preview. Default: `true` */
  skipPreview: Scalars['Boolean']['output'];
  /** Whether or not the user whats to skip recaps at the beginning of episodes. Default: `true` */
  skipRecaps: Scalars['Boolean']['output'];
  /** Whether or not to skip an episode's static title card. Default: `true` */
  skipTitleCard: Scalars['Boolean']['output'];
  /** Whether or not the user whats to skip commercial transitions. Default: `true` */
  skipTransitions: Scalars['Boolean']['output'];
  updatedAt: Scalars['Time']['output'];
  /** The `User` that the preferences belong to */
  user: User;
  /** The `User.id` that this preferences object belongs to */
  userId: Scalars['ID']['output'];
};

export type Query = {
  __typename?: 'Query';
  /** Get the logged in user's private account information */
  account: Account;
  /** List all the `TimestampType`s. Items come back in a random order */
  allTimestampTypes: Array<TimestampType>;
  counts?: Maybe<TotalCounts>;
  /** Find an API Client that you created based on it's ID. This will not return other users' clients */
  findApiClient: ApiClient;
  /** Find episode with a matching `Episode.id` */
  findEpisode: Episode;
  /**
   * Get a list of third party episodes for a given `Episode.name`. Since this can return an array of
   * multiple items, always use `findEpisodeUrl` first, then fallback to this query.
   *
   * Current 3rd party timestamp providers include:
   * - [BetterVRV](http://tuckerchap.in/BetterVRV/)
   *
   * > See `ThirdPartyEpisode` for more information about how to create data based on this type
   */
  findEpisodeByName: Array<ThirdPartyEpisode>;
  /**
   * Find an episode based on a URL. This is the primary method used to lookup data for a known service
   * URL. See `findEpisodeByName` for looking up fallback data.
   */
  findEpisodeUrl: EpisodeUrl;
  /** List all the `EpisodeUrl`s for a given `Episode.id` */
  findEpisodeUrlsByEpisodeId: Array<EpisodeUrl>;
  /** Get a list of episodes for a given `Show.id` */
  findEpisodesByShowId: Array<Episode>;
  /** Find show with a matching `Show.id` */
  findShow: Show;
  /** Find show admin with a matching `ShowAdmin.id` */
  findShowAdmin: ShowAdmin;
  /** Get a list of admins for a given `Show.id` */
  findShowAdminsByShowId: Array<ShowAdmin>;
  /** Get a list of show admins for a given `User.id` */
  findShowAdminsByUserId: Array<ShowAdmin>;
  findShowsByExternalId: Array<Show>;
  /**
   * Get template info based on a `Template.id`
   *
   * Only templates you've created are returned. If you don't include a token in the authorization
   * header, you will get a not found error, same as if the template was not found.
   */
  findTemplate: Template;
  /**
   * Find the most relevant template based on a few search criteria. If multiple templates are found,
   * their priority is like so:
   *
   * 1. Matching `sourceEpisodeID`
   * 2. Matching show name (case sensitive) and season (case sensitive)
   * 3. Matching show name (case sensitive)
   *
   * Only templates you've created are returned. If you don't include a token in the authorization
   * header, you will get a not found error, same as if the template was not found.
   */
  findTemplateByDetails: Template;
  /**
   * Get a list of templates based on the `Template.showId`
   *
   * Only templates you've created are returned. If you don't include a token in the authorization
   * header, you will receive an empty list.
   */
  findTemplatesByShowId: Array<Template>;
  /** Get timestamp info based on a `Timestamp.id` */
  findTimestamp: Timestamp;
  /** Get timestamp type info based on a `TimestampType.id` */
  findTimestampType: TimestampType;
  /** Get all the timestamps for an episode */
  findTimestampsByEpisodeId: Array<Timestamp>;
  /** Find user with a matching `User.id` */
  findUser: User;
  /** Find user with a matching `User.username` */
  findUserByUsername: User;
  /**
   * Get a single user report, even if it's been resolved/deleted.
   *
   * > `@hasRole(role: REVIEWER)` - The user must have the `REVIEWER` role to perform this query.
   */
  findUserReport: UserReport;
  /**
   * List all user reports.
   *
   * > `@hasRole(role: REVIEWER)` - The user must have the `REVIEWER` role to perform this query.
   */
  findUserReports: Array<UserReport>;
  /**
   * Use either the username or email and an md5 hash of the user's password to get an access and
   * refresh token
   */
  login: LoginData;
  /** Use a refresh token get a new access and refresh token */
  loginRefresh: LoginData;
  /** List or search through the authenticated user's API clients */
  myApiClients: Array<ApiClient>;
  /**
   * Get a list of recently added episodes that have timestamps.
   *
   * > Since this is a rather intensive query, it is cached for 20 minutes before it will look for new
   * > episodes again
   */
  recentlyAddedEpisodes: Array<Episode>;
  /**
   * Search for episodes that include the `search` in the `Episode.name`. Results are sorted by
   * `Show.name`as `ASC` or `DESC`
   *
   * Results can be limited to a single show by passing `showId`
   */
  searchEpisodes: Array<Episode>;
  /**
   * Search for shows that include the `search` in the `Show.name`. Results are sorted by `Show.name`
   * as `ASC` or `DESC`
   */
  searchShows: Array<Show>;
};

export type QueryFindApiClientArgs = {
  id: Scalars['String']['input'];
};

export type QueryFindEpisodeArgs = {
  episodeId: Scalars['ID']['input'];
};

export type QueryFindEpisodeByNameArgs = {
  name: Scalars['String']['input'];
};

export type QueryFindEpisodeUrlArgs = {
  episodeUrl: Scalars['String']['input'];
};

export type QueryFindEpisodeUrlsByEpisodeIdArgs = {
  episodeId: Scalars['ID']['input'];
};

export type QueryFindEpisodesByShowIdArgs = {
  showId: Scalars['ID']['input'];
};

export type QueryFindShowArgs = {
  showId: Scalars['ID']['input'];
};

export type QueryFindShowAdminArgs = {
  showAdminId: Scalars['ID']['input'];
};

export type QueryFindShowAdminsByShowIdArgs = {
  showId: Scalars['ID']['input'];
};

export type QueryFindShowAdminsByUserIdArgs = {
  userId: Scalars['ID']['input'];
};

export type QueryFindShowsByExternalIdArgs = {
  service: ExternalService;
  serviceId: Scalars['String']['input'];
};

export type QueryFindTemplateArgs = {
  templateId: Scalars['ID']['input'];
};

export type QueryFindTemplateByDetailsArgs = {
  episodeId?: InputMaybe<Scalars['ID']['input']>;
  season?: InputMaybe<Scalars['String']['input']>;
  showName?: InputMaybe<Scalars['String']['input']>;
};

export type QueryFindTemplatesByShowIdArgs = {
  showId: Scalars['ID']['input'];
};

export type QueryFindTimestampArgs = {
  timestampId: Scalars['ID']['input'];
};

export type QueryFindTimestampTypeArgs = {
  timestampTypeId: Scalars['ID']['input'];
};

export type QueryFindTimestampsByEpisodeIdArgs = {
  episodeId: Scalars['ID']['input'];
};

export type QueryFindUserArgs = {
  userId: Scalars['ID']['input'];
};

export type QueryFindUserByUsernameArgs = {
  username: Scalars['String']['input'];
};

export type QueryFindUserReportArgs = {
  id: Scalars['ID']['input'];
};

export type QueryFindUserReportsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  resolved?: InputMaybe<Scalars['Boolean']['input']>;
  sort?: InputMaybe<Scalars['String']['input']>;
};

export type QueryLoginArgs = {
  passwordHash: Scalars['String']['input'];
  usernameEmail: Scalars['String']['input'];
};

export type QueryLoginRefreshArgs = {
  refreshToken: Scalars['String']['input'];
};

export type QueryMyApiClientsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  sort?: InputMaybe<Scalars['String']['input']>;
};

export type QueryRecentlyAddedEpisodesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};

export type QuerySearchEpisodesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  showId?: InputMaybe<Scalars['ID']['input']>;
  sort?: InputMaybe<Scalars['String']['input']>;
};

export type QuerySearchShowsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  sort?: InputMaybe<Scalars['String']['input']>;
};

/**
 * A user's role in the system. Higher roles allow a user write access to certain data that a normal
 * user would not. Some queries and mutations are only allowed by certain roles
 */
export enum Role {
  /** Administrator role. Has some elevated permissions */
  Admin = 'ADMIN',
  /** Highest role. Has super user access to all queries and mutations */
  Dev = 'DEV',
  /** Reviewer role. Lets the user review issues with timestamps */
  Reviewer = 'REVIEWER',
  /** Basic role. Has no elevated permissions */
  User = 'USER',
}

/** A show containing a list of episodes and relevant links */
export type Show = BaseModel & {
  __typename?: 'Show';
  /** The list of admins for the show */
  admins: Array<ShowAdmin>;
  createdAt: Scalars['Time']['output'];
  createdBy: User;
  createdByUserId: Scalars['ID']['output'];
  deletedAt?: Maybe<Scalars['Time']['output']>;
  deletedBy?: Maybe<User>;
  deletedByUserId?: Maybe<Scalars['ID']['output']>;
  /** How many episodes are apart of this show */
  episodeCount: Scalars['Int']['output'];
  /** All the episodes that belong to the show */
  episodes: Array<Episode>;
  /** Any links to external sites (just Anilist right now) for the show */
  externalLinks: Array<ExternalLink>;
  id: Scalars['ID']['output'];
  /** A link to a show poster */
  image?: Maybe<Scalars['String']['output']>;
  /**
   * The show name
   *
   * ### Examples
   *
   * - "Death Note"
   * - "My Hero Academia"
   */
  name: Scalars['String']['output'];
  /**
   * The show's original Japanese name
   *
   * ### Examples
   *
   * - "Desu Nōto"
   * - "Boku no Hīrō Akademia"
   */
  originalName?: Maybe<Scalars['String']['output']>;
  /** How many seasons are associated with this show */
  seasonCount: Scalars['Int']['output'];
  /** All the templates that belong to this show */
  templates: Array<Template>;
  updatedAt: Scalars['Time']['output'];
  updatedBy: User;
  updatedByUserId: Scalars['ID']['output'];
  /** A link to the anime's official website */
  website?: Maybe<Scalars['String']['output']>;
};

/**
 * A list of users that have elevated permissions when making changes to a show, it's episodes, and
 * timestamps. Show admins are responsible for approving any changes that users might submit.
 *
 * If a user has the `ADMIN` or `DEV` roles, they do not need to be show admins to approve changes or
 * make changes directly. Likewise, if a show doesn't have an admin, the user that create the
 * show/episode will have temporary access to editing the data until someone becomes that shows admin.
 *
 * Admins can be created using the API and will soon come to the Anime Skip player/website.
 */
export type ShowAdmin = BaseModel & {
  __typename?: 'ShowAdmin';
  createdAt: Scalars['Time']['output'];
  createdBy: User;
  createdByUserId: Scalars['ID']['output'];
  deletedAt?: Maybe<Scalars['Time']['output']>;
  deletedBy?: Maybe<User>;
  deletedByUserId?: Maybe<Scalars['ID']['output']>;
  id: Scalars['ID']['output'];
  /** The `Show` that the admin has elevated privileges for */
  show: Show;
  /** The `Show.id` that the admin has elevated privileges for */
  showId: Scalars['ID']['output'];
  updatedAt: Scalars['Time']['output'];
  updatedBy: User;
  updatedByUserId: Scalars['ID']['output'];
  /** The `User` that the admin privileges belong to */
  user: User;
  /** The `User.id` that the admin privileges belong to */
  userId: Scalars['ID']['output'];
};

/** When no timestamps exist for a specific episode, templates are setup to provide fallback timestamps */
export type Template = BaseModel & {
  __typename?: 'Template';
  createdAt: Scalars['Time']['output'];
  createdBy: User;
  createdByUserId: Scalars['ID']['output'];
  deletedAt?: Maybe<Scalars['Time']['output']>;
  deletedBy?: Maybe<User>;
  deletedByUserId?: Maybe<Scalars['ID']['output']>;
  id: Scalars['ID']['output'];
  /** When the template is for a set of seasons, this is the set of seasons it is applied to */
  seasons?: Maybe<Array<Scalars['String']['output']>>;
  /** The show that this template is for */
  show: Show;
  /** The id of the show that this template is for */
  showId: Scalars['ID']['output'];
  /** The episode used to create the template. All the timestamps are from this episode */
  sourceEpisode: Episode;
  /** The id of the episode used to create the template. All the timestamps are from this episode */
  sourceEpisodeId: Scalars['ID']['output'];
  /**
   * The list of timestamp ids that are apart of this template. Since this is a many-to-many
   * relationship, this field will resolve quicker than `timestamps` since it doesn't have to do an
   * extra join
   *
   * This is useful when you already got the episode and timestamps, and you just need to know what
   * timestamps are apart of the template
   */
  timestampIds: Array<Scalars['ID']['output']>;
  /** The list of timestamps that are apart of this template */
  timestamps: Array<Timestamp>;
  /** Specify the scope of the template, if it's for the entire show, or just for a set of seasons */
  type: TemplateType;
  updatedAt: Scalars['Time']['output'];
  updatedBy: User;
  updatedByUserId: Scalars['ID']['output'];
};

/** The many to many object that links a timestamp to a template */
export type TemplateTimestamp = {
  __typename?: 'TemplateTimestamp';
  template: Template;
  templateId: Scalars['ID']['output'];
  timestamp: Timestamp;
  timestampId: Scalars['ID']['output'];
};

/** The scope that a template applies to */
export enum TemplateType {
  /** The template is loaded for episodes of a given show where their season is included in `Template.seasons` */
  Seasons = 'SEASONS',
  /** The template is loaded for all episodes of a given show */
  Show = 'SHOW',
}

/**
 * Episode info provided by a third party. See `Episode` for a description of each field.
 *
 * When creating data based on this type, fill out and post an episode, then timestamps based on the
 * data here. All fields will map 1 to 1 with the exception of `source`. Since a source belongs to a
 * episode for third party data, but belongs to timestamps in Anime Skip, the source should be
 * propagated down to each of the timestamps. This way when more timestamps are added, a episode can
 * have multiple timestamp sources.
 *
 * > Make sure to fill out the `source` field so that original owner of the timestamp is maintained
 */
export type ThirdPartyEpisode = {
  __typename?: 'ThirdPartyEpisode';
  absoluteNumber?: Maybe<Scalars['String']['output']>;
  baseDuration?: Maybe<Scalars['Float']['output']>;
  /** The Anime Skip `Episode.id` when the `source` is `ANIME_SKIP`, otherwise this is null */
  id?: Maybe<Scalars['ID']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  number?: Maybe<Scalars['String']['output']>;
  season?: Maybe<Scalars['String']['output']>;
  show: ThirdPartyShow;
  /** The id of the show from the third party */
  showId: Scalars['String']['output'];
  source?: Maybe<TimestampSource>;
  timestamps: Array<ThirdPartyTimestamp>;
};

export type ThirdPartyShow = {
  __typename?: 'ThirdPartyShow';
  createdAt?: Maybe<Scalars['Time']['output']>;
  name: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['Time']['output']>;
};

export type ThirdPartyTimestamp = {
  __typename?: 'ThirdPartyTimestamp';
  /** The actual time the timestamp is at */
  at: Scalars['Float']['output'];
  /** The Anime Skip `Timestamp.id` when the `Episode.source` is `ANIME_SKIP`, otherwise this is null */
  id?: Maybe<Scalars['ID']['output']>;
  type: TimestampType;
  /** The id specifying the type the timestamp is */
  typeId: Scalars['ID']['output'];
};

export type Timestamp = BaseModel & {
  __typename?: 'Timestamp';
  /** The actual time the timestamp is at */
  at: Scalars['Float']['output'];
  createdAt: Scalars['Time']['output'];
  createdBy: User;
  createdByUserId: Scalars['ID']['output'];
  deletedAt?: Maybe<Scalars['Time']['output']>;
  deletedBy?: Maybe<User>;
  deletedByUserId?: Maybe<Scalars['ID']['output']>;
  /** The `Episode` that the timestamp belongs to */
  episode: Episode;
  /** The `Episode.id` that the timestamp belongs to */
  episodeId: Scalars['ID']['output'];
  id: Scalars['ID']['output'];
  source: TimestampSource;
  /**
   * The type the timestamp is. This field is a constant string so including it has no effect on
   * performance or query complexity.
   */
  type: TimestampType;
  /** The id specifying the type the timestamp is */
  typeId: Scalars['ID']['output'];
  updatedAt: Scalars['Time']['output'];
  updatedBy: User;
  updatedByUserId: Scalars['ID']['output'];
};

/** Where a timestamp originated from */
export enum TimestampSource {
  AnimeSkip = 'ANIME_SKIP',
  BetterVrv = 'BETTER_VRV',
}

/**
 * The type a timestamp can be. This table rarely changes so the values fetched can either be hard
 * coded or fetch occasionally. Anime Skip website and web extension use hardcoded maps to store this
 * data, but a third party might want to fetch and cache this instead since you won't know when Anime
 * Skip adds timestamps
 */
export type TimestampType = BaseModel & {
  __typename?: 'TimestampType';
  createdAt: Scalars['Time']['output'];
  createdBy: User;
  createdByUserId: Scalars['ID']['output'];
  deletedAt?: Maybe<Scalars['Time']['output']>;
  deletedBy?: Maybe<User>;
  deletedByUserId?: Maybe<Scalars['ID']['output']>;
  /** The description for what this type represents */
  description: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  /** The name of the timestamp type */
  name: Scalars['String']['output'];
  updatedAt: Scalars['Time']['output'];
  updatedBy: User;
  updatedByUserId: Scalars['ID']['output'];
};

export type TotalCounts = {
  __typename?: 'TotalCounts';
  episodeUrls: Scalars['Int']['output'];
  episodes: Scalars['Int']['output'];
  shows: Scalars['Int']['output'];
  templates: Scalars['Int']['output'];
  timestampTypes: Scalars['Int']['output'];
  timestamps: Scalars['Int']['output'];
  users: Scalars['Int']['output'];
};

export type UpdatedTimestamps = {
  __typename?: 'UpdatedTimestamps';
  created: Array<Timestamp>;
  deleted: Array<Timestamp>;
  updated: Array<Timestamp>;
};

/** Information about a user that is public. See `Account` for a description of each field */
export type User = {
  __typename?: 'User';
  adminOfShows: Array<ShowAdmin>;
  createdAt: Scalars['Time']['output'];
  deletedAt?: Maybe<Scalars['Time']['output']>;
  id: Scalars['ID']['output'];
  profileUrl: Scalars['String']['output'];
  username: Scalars['String']['output'];
};

export type UserReport = BaseModel & {
  __typename?: 'UserReport';
  createdAt: Scalars['Time']['output'];
  createdBy: User;
  createdByUserId: Scalars['ID']['output'];
  deletedAt?: Maybe<Scalars['Time']['output']>;
  deletedBy?: Maybe<User>;
  deletedByUserId?: Maybe<Scalars['ID']['output']>;
  episode?: Maybe<Episode>;
  episodeId?: Maybe<Scalars['ID']['output']>;
  episodeUrl?: Maybe<EpisodeUrl>;
  episodeUrlString?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  message: Scalars['String']['output'];
  reportedFromUrl: Scalars['String']['output'];
  resolved: Scalars['Boolean']['output'];
  resolvedMessage?: Maybe<Scalars['String']['output']>;
  show?: Maybe<Show>;
  showId?: Maybe<Scalars['ID']['output']>;
  timestamp?: Maybe<Timestamp>;
  timestampId?: Maybe<Scalars['ID']['output']>;
  updatedAt: Scalars['Time']['output'];
  updatedBy: User;
  updatedByUserId: Scalars['ID']['output'];
};

/** Color theme the user prefers */
export type ColorTheme =
  | 'ANIME_SKIP_BLUE'
  | 'CRUNCHYROLL_ORANGE'
  | 'FUNIMATION_PURPLE'
  /** Change to match where you're watching */
  | 'PER_SERVICE'
  | 'VRV_YELLOW';

/**
 * Which of the supported services the `EpisodeUrl` was created for. This is a simple enum that allows
 * for simple checks, but this data can also be pulled from the url in the case of UNKNOWN
 */
export type EpisodeSource =
  /** Data is from <crunchyroll.com> and <beta.crunchyroll.com> */
  | 'CRUNCHYROLL'
  /** Data is from <funimation.com> */
  | 'FUNIMATION'
  /** Data came from an external source */
  | 'UNKNOWN'
  /** Data is from <vrv.co> */
  | 'VRV';

/** Data required to create a new `Episode`. See `Episode` for a description of each field */
export type InputEpisode = {
  /** See `Episode.absoluteNumber` */
  absoluteNumber?: string | null | undefined;
  /** See `Episode.baseDuration` */
  baseDuration: number;
  /** See `Episode.name` */
  name?: string | null | undefined;
  /** See `Episode.number` */
  number?: string | null | undefined;
  /** See `Episode.season` */
  season?: string | null | undefined;
};

/** Data required to create a new `EpisodeUrl`. See `EpisodeUrl` for a description of each field */
export type InputEpisodeUrl = {
  duration?: number | null | undefined;
  timestampsOffset?: number | null | undefined;
  url: string;
};

export type InputExistingTimestamp = {
  /** The id of the timestamp you want to modify */
  id: string | number;
  /** The new values for the timestamp */
  timestamp: InputTimestamp;
};

/**
 * Data used to update a user's `Preferences`. See `Preferences` for a description of each field. If a
 * field is not passed or passed as `null`, it will leave the value as is and skip updating it
 */
export type InputPreferences = {
  colorTheme?: ColorTheme | null | undefined;
  enableAutoPlay?: boolean | null | undefined;
  enableAutoSkip?: boolean | null | undefined;
  hideTimelineWhenMinimized?: boolean | null | undefined;
  minimizeToolbarWhenEditing?: boolean | null | undefined;
  skipBranding?: boolean | null | undefined;
  skipCanon?: boolean | null | undefined;
  skipCredits?: boolean | null | undefined;
  skipFiller?: boolean | null | undefined;
  skipIntros?: boolean | null | undefined;
  skipMixedCredits?: boolean | null | undefined;
  skipMixedIntros?: boolean | null | undefined;
  skipNewCredits?: boolean | null | undefined;
  skipNewIntros?: boolean | null | undefined;
  skipPreview?: boolean | null | undefined;
  skipRecaps?: boolean | null | undefined;
  skipTitleCard?: boolean | null | undefined;
  skipTransitions?: boolean | null | undefined;
};

/** Data required to create a new `Show`. See `Show` for a description of each field */
export type InputShow = {
  image?: string | null | undefined;
  name: string;
  originalName?: string | null | undefined;
  website?: string | null | undefined;
};

/** Data required to create a new template. See `Template` for a description of each field */
export type InputTemplate = {
  seasons?: Array<string> | null | undefined;
  showId: string | number;
  sourceEpisodeId: string | number;
  type: TemplateType;
};

/** Data required to modify the timestamps on a template */
export type InputTemplateTimestamp = {
  templateId: string | number;
  timestampId: string | number;
};

/** Data required to create a new `Timestamp`. See `Timestamp` for a description of each field */
export type InputTimestamp = {
  at: number;
  source?: TimestampSource | null | undefined;
  typeId: string | number;
};

export type InputTimestampOn = {
  /** The episode id the timestamp will be created on */
  episodeId: string | number;
  /** The new values for the timestamp */
  timestamp: InputTimestamp;
};

/**
 * A user's role in the system. Higher roles allow a user write access to certain data that a normal
 * user would not. Some queries and mutations are only allowed by certain roles
 */
export type Role =
  /** Administrator role. Has some elevated permissions */
  | 'ADMIN'
  /** Highest role. Has super user access to all queries and mutations */
  | 'DEV'
  /** Reviewer role. Lets the user review issues with timestamps */
  | 'REVIEWER'
  /** Basic role. Has no elevated permissions */
  | 'USER';

/** The scope that a template applies to */
export type TemplateType =
  /** The template is loaded for episodes of a given show where their season is included in `Template.seasons` */
  | 'SEASONS'
  /** The template is loaded for all episodes of a given show */
  | 'SHOW';

/** Where a timestamp originated from */
export type TimestampSource = 'ANIME_SKIP' | 'BETTER_VRV';

export type AccountQueryVariables = Exact<{ [key: string]: never }>;

export type AccountQuery = {
  account: {
    id: string;
    username: string;
    email: string;
    emailVerified: boolean;
    profileUrl: string;
    role: Role;
    createdAt: string;
    preferences: {
      enableAutoSkip: boolean;
      enableAutoPlay: boolean;
      minimizeToolbarWhenEditing: boolean;
      hideTimelineWhenMinimized: boolean;
      colorTheme: ColorTheme;
      skipBranding: boolean;
      skipCanon: boolean;
      skipCredits: boolean;
      skipFiller: boolean;
      skipIntros: boolean;
      skipMixedCredits: boolean;
      skipMixedIntros: boolean;
      skipNewCredits: boolean;
      skipNewIntros: boolean;
      skipPreview: boolean;
      skipRecaps: boolean;
      skipTitleCard: boolean;
      skipTransitions: boolean;
    };
  };
};

export type AllTimestampTypesQueryVariables = Exact<{ [key: string]: never }>;

export type AllTimestampTypesQuery = {
  allTimestampTypes: Array<{ id: string; name: string; description: string }>;
};

export type CreateEpisodeMutationVariables = Exact<{
  showId: string | number;
  episodeInput: InputEpisode;
}>;

export type CreateEpisodeMutation = {
  createEpisode: {
    id: string;
    createdAt: string;
    updatedAt: string;
    season: string | null;
    number: string | null;
    absoluteNumber: string | null;
    name: string | null;
    baseDuration: number | null;
    show: {
      id: string;
      name: string;
      originalName: string | null;
      createdAt: string;
      updatedAt: string;
      website: string | null;
      image: string | null;
    };
    timestamps: Array<{
      id: string;
      createdAt: string;
      updatedAt: string;
      at: number;
      source: TimestampSource;
      typeId: string;
      episodeId: string;
      createdBy: {
        id: string;
        username: string;
        profileUrl: string;
        createdAt: string;
      };
      updatedBy: {
        id: string;
        username: string;
        profileUrl: string;
        createdAt: string;
      };
    }>;
  };
};

export type CreateEpisodeUrlMutationVariables = Exact<{
  episodeId: string | number;
  episodeUrlInput: InputEpisodeUrl;
}>;

export type CreateEpisodeUrlMutation = {
  createEpisodeUrl: {
    url: string;
    createdAt: string;
    updatedAt: string;
    duration: number | null;
    timestampsOffset: number | null;
    source: EpisodeSource;
    episode: {
      id: string;
      createdAt: string;
      updatedAt: string;
      season: string | null;
      number: string | null;
      absoluteNumber: string | null;
      name: string | null;
      baseDuration: number | null;
      show: {
        id: string;
        name: string;
        originalName: string | null;
        createdAt: string;
        updatedAt: string;
        website: string | null;
        image: string | null;
      };
      timestamps: Array<{
        id: string;
        createdAt: string;
        updatedAt: string;
        at: number;
        source: TimestampSource;
        typeId: string;
        episodeId: string;
        createdBy: {
          id: string;
          username: string;
          profileUrl: string;
          createdAt: string;
        };
        updatedBy: {
          id: string;
          username: string;
          profileUrl: string;
          createdAt: string;
        };
      }>;
    };
  };
};

export type CreateShowMutationVariables = Exact<{
  showInput: InputShow;
  becomeAdmin: boolean;
}>;

export type CreateShowMutation = {
  createShow: {
    id: string;
    name: string;
    originalName: string | null;
    createdAt: string;
    updatedAt: string;
    website: string | null;
    image: string | null;
  };
};

export type FindTemplateByDetailsQueryVariables = Exact<{
  episodeId?: string | number | null | undefined;
  showName?: string | null | undefined;
  season?: string | null | undefined;
}>;

export type FindTemplateByDetailsQuery = {
  findTemplateByDetails: {
    id: string;
    type: TemplateType;
    createdAt: string;
    createdByUserId: string;
    updatedAt: string;
    updatedByUserId: string;
    seasons: Array<string> | null;
    sourceEpisodeId: string;
    createdBy: {
      id: string;
      username: string;
      profileUrl: string;
      createdAt: string;
    };
    updatedBy: {
      id: string;
      username: string;
      profileUrl: string;
      createdAt: string;
    };
    sourceEpisode: {
      id: string;
      createdAt: string;
      updatedAt: string;
      season: string | null;
      number: string | null;
      absoluteNumber: string | null;
      name: string | null;
      baseDuration: number | null;
      show: {
        id: string;
        name: string;
        originalName: string | null;
        createdAt: string;
        updatedAt: string;
        website: string | null;
        image: string | null;
      };
      timestamps: Array<{
        id: string;
        createdAt: string;
        updatedAt: string;
        at: number;
        source: TimestampSource;
        typeId: string;
        episodeId: string;
        createdBy: {
          id: string;
          username: string;
          profileUrl: string;
          createdAt: string;
        };
        updatedBy: {
          id: string;
          username: string;
          profileUrl: string;
          createdAt: string;
        };
      }>;
    };
    timestamps: Array<{
      id: string;
      createdAt: string;
      updatedAt: string;
      at: number;
      source: TimestampSource;
      typeId: string;
      episodeId: string;
      createdBy: {
        id: string;
        username: string;
        profileUrl: string;
        createdAt: string;
      };
      updatedBy: {
        id: string;
        username: string;
        profileUrl: string;
        createdAt: string;
      };
    }>;
  };
};

export type DeleteTemplateMutationVariables = Exact<{
  id: string | number;
}>;

export type DeleteTemplateMutation = {
  deleteTemplate: {
    id: string;
    type: TemplateType;
    createdAt: string;
    createdByUserId: string;
    updatedAt: string;
    updatedByUserId: string;
    seasons: Array<string> | null;
    sourceEpisodeId: string;
    createdBy: {
      id: string;
      username: string;
      profileUrl: string;
      createdAt: string;
    };
    updatedBy: {
      id: string;
      username: string;
      profileUrl: string;
      createdAt: string;
    };
    sourceEpisode: {
      id: string;
      createdAt: string;
      updatedAt: string;
      season: string | null;
      number: string | null;
      absoluteNumber: string | null;
      name: string | null;
      baseDuration: number | null;
      show: {
        id: string;
        name: string;
        originalName: string | null;
        createdAt: string;
        updatedAt: string;
        website: string | null;
        image: string | null;
      };
      timestamps: Array<{
        id: string;
        createdAt: string;
        updatedAt: string;
        at: number;
        source: TimestampSource;
        typeId: string;
        episodeId: string;
        createdBy: {
          id: string;
          username: string;
          profileUrl: string;
          createdAt: string;
        };
        updatedBy: {
          id: string;
          username: string;
          profileUrl: string;
          createdAt: string;
        };
      }>;
    };
    timestamps: Array<{
      id: string;
      createdAt: string;
      updatedAt: string;
      at: number;
      source: TimestampSource;
      typeId: string;
      episodeId: string;
      createdBy: {
        id: string;
        username: string;
        profileUrl: string;
        createdAt: string;
      };
      updatedBy: {
        id: string;
        username: string;
        profileUrl: string;
        createdAt: string;
      };
    }>;
  };
};

export type FindEpisodeByNameQueryVariables = Exact<{
  name: string;
}>;

export type FindEpisodeByNameQuery = {
  findEpisodeByName: Array<{
    id: string | null;
    name: string | null;
    season: string | null;
    number: string | null;
    absoluteNumber: string | null;
    baseDuration: number | null;
    source: TimestampSource | null;
    showId: string;
    show: { name: string };
    timestamps: Array<{ id: string | null; at: number; typeId: string }>;
  }>;
};

export type FindEpisodeQueryVariables = Exact<{
  episodeId: string | number;
}>;

export type FindEpisodeQuery = {
  findEpisode: {
    id: string;
    createdAt: string;
    updatedAt: string;
    season: string | null;
    number: string | null;
    absoluteNumber: string | null;
    name: string | null;
    baseDuration: number | null;
    show: {
      id: string;
      name: string;
      originalName: string | null;
      createdAt: string;
      updatedAt: string;
      website: string | null;
      image: string | null;
    };
    timestamps: Array<{
      id: string;
      createdAt: string;
      updatedAt: string;
      at: number;
      source: TimestampSource;
      typeId: string;
      episodeId: string;
      createdBy: {
        id: string;
        username: string;
        profileUrl: string;
        createdAt: string;
      };
      updatedBy: {
        id: string;
        username: string;
        profileUrl: string;
        createdAt: string;
      };
    }>;
  };
};

export type FindEpisodeUrlQueryVariables = Exact<{
  url: string;
}>;

export type FindEpisodeUrlQuery = {
  findEpisodeUrl: {
    url: string;
    createdAt: string;
    updatedAt: string;
    duration: number | null;
    timestampsOffset: number | null;
    source: EpisodeSource;
    episode: {
      id: string;
      createdAt: string;
      updatedAt: string;
      season: string | null;
      number: string | null;
      absoluteNumber: string | null;
      name: string | null;
      baseDuration: number | null;
      show: {
        id: string;
        name: string;
        originalName: string | null;
        createdAt: string;
        updatedAt: string;
        website: string | null;
        image: string | null;
      };
      timestamps: Array<{
        id: string;
        createdAt: string;
        updatedAt: string;
        at: number;
        source: TimestampSource;
        typeId: string;
        episodeId: string;
        createdBy: {
          id: string;
          username: string;
          profileUrl: string;
          createdAt: string;
        };
        updatedBy: {
          id: string;
          username: string;
          profileUrl: string;
          createdAt: string;
        };
      }>;
    };
  };
};

export type LoginQueryVariables = Exact<{
  usernameEmail: string;
  passwordHash: string;
}>;

export type LoginQuery = {
  login: {
    authToken: string;
    refreshToken: string;
    account: {
      id: string;
      username: string;
      email: string;
      emailVerified: boolean;
      profileUrl: string;
      role: Role;
      createdAt: string;
    };
  };
};

export type LoginRefreshQueryVariables = Exact<{
  refreshToken: string;
}>;

export type LoginRefreshQuery = {
  loginRefresh: {
    authToken: string;
    refreshToken: string;
    account: {
      id: string;
      username: string;
      email: string;
      emailVerified: boolean;
      profileUrl: string;
      role: Role;
      createdAt: string;
    };
  };
};

export type SavePreferencesMutationVariables = Exact<{
  preferences: InputPreferences;
}>;

export type SavePreferencesMutation = {
  savePreferences: { updatedAt: string };
};

export type UpdateTemplateMutationVariables = Exact<{
  id: string | number;
  newTemplate: InputTemplate;
}>;

export type UpdateTemplateMutation = {
  updateTemplate: {
    id: string;
    type: TemplateType;
    createdAt: string;
    createdByUserId: string;
    updatedAt: string;
    updatedByUserId: string;
    seasons: Array<string> | null;
    sourceEpisodeId: string;
    createdBy: {
      id: string;
      username: string;
      profileUrl: string;
      createdAt: string;
    };
    updatedBy: {
      id: string;
      username: string;
      profileUrl: string;
      createdAt: string;
    };
    sourceEpisode: {
      id: string;
      createdAt: string;
      updatedAt: string;
      season: string | null;
      number: string | null;
      absoluteNumber: string | null;
      name: string | null;
      baseDuration: number | null;
      show: {
        id: string;
        name: string;
        originalName: string | null;
        createdAt: string;
        updatedAt: string;
        website: string | null;
        image: string | null;
      };
      timestamps: Array<{
        id: string;
        createdAt: string;
        updatedAt: string;
        at: number;
        source: TimestampSource;
        typeId: string;
        episodeId: string;
        createdBy: {
          id: string;
          username: string;
          profileUrl: string;
          createdAt: string;
        };
        updatedBy: {
          id: string;
          username: string;
          profileUrl: string;
          createdAt: string;
        };
      }>;
    };
    timestamps: Array<{
      id: string;
      createdAt: string;
      updatedAt: string;
      at: number;
      source: TimestampSource;
      typeId: string;
      episodeId: string;
      createdBy: {
        id: string;
        username: string;
        profileUrl: string;
        createdAt: string;
      };
      updatedBy: {
        id: string;
        username: string;
        profileUrl: string;
        createdAt: string;
      };
    }>;
  };
};

export type CreateTemplateMutationVariables = Exact<{
  newTemplate: InputTemplate;
}>;

export type CreateTemplateMutation = {
  createTemplate: {
    id: string;
    type: TemplateType;
    createdAt: string;
    createdByUserId: string;
    updatedAt: string;
    updatedByUserId: string;
    seasons: Array<string> | null;
    sourceEpisodeId: string;
    createdBy: {
      id: string;
      username: string;
      profileUrl: string;
      createdAt: string;
    };
    updatedBy: {
      id: string;
      username: string;
      profileUrl: string;
      createdAt: string;
    };
    sourceEpisode: {
      id: string;
      createdAt: string;
      updatedAt: string;
      season: string | null;
      number: string | null;
      absoluteNumber: string | null;
      name: string | null;
      baseDuration: number | null;
      show: {
        id: string;
        name: string;
        originalName: string | null;
        createdAt: string;
        updatedAt: string;
        website: string | null;
        image: string | null;
      };
      timestamps: Array<{
        id: string;
        createdAt: string;
        updatedAt: string;
        at: number;
        source: TimestampSource;
        typeId: string;
        episodeId: string;
        createdBy: {
          id: string;
          username: string;
          profileUrl: string;
          createdAt: string;
        };
        updatedBy: {
          id: string;
          username: string;
          profileUrl: string;
          createdAt: string;
        };
      }>;
    };
    timestamps: Array<{
      id: string;
      createdAt: string;
      updatedAt: string;
      at: number;
      source: TimestampSource;
      typeId: string;
      episodeId: string;
      createdBy: {
        id: string;
        username: string;
        profileUrl: string;
        createdAt: string;
      };
      updatedBy: {
        id: string;
        username: string;
        profileUrl: string;
        createdAt: string;
      };
    }>;
  };
};

export type AddTimestampToTemplateMutationVariables = Exact<{
  timestamp: InputTemplateTimestamp;
}>;

export type AddTimestampToTemplateMutation = {
  addTimestampToTemplate: {
    timestamp: {
      id: string;
      createdAt: string;
      updatedAt: string;
      at: number;
      source: TimestampSource;
      typeId: string;
      episodeId: string;
      createdBy: {
        id: string;
        username: string;
        profileUrl: string;
        createdAt: string;
      };
      updatedBy: {
        id: string;
        username: string;
        profileUrl: string;
        createdAt: string;
      };
    };
  };
};

export type RemoveTimestampFromTemplateMutationVariables = Exact<{
  timestamp: InputTemplateTimestamp;
}>;

export type RemoveTimestampFromTemplateMutation = {
  removeTimestampFromTemplate: {
    timestamp: {
      id: string;
      createdAt: string;
      updatedAt: string;
      at: number;
      source: TimestampSource;
      typeId: string;
      episodeId: string;
      createdBy: {
        id: string;
        username: string;
        profileUrl: string;
        createdAt: string;
      };
      updatedBy: {
        id: string;
        username: string;
        profileUrl: string;
        createdAt: string;
      };
    };
  };
};

export type SearchShowsQueryVariables = Exact<{
  search: string;
}>;

export type SearchShowsQuery = {
  searchShows: Array<{
    id: string;
    name: string;
    originalName: string | null;
    createdAt: string;
    updatedAt: string;
    website: string | null;
    image: string | null;
  }>;
};

export type UpdateEpisodeMutationVariables = Exact<{
  episodeId: string | number;
  newEpisode: InputEpisode;
}>;

export type UpdateEpisodeMutation = {
  updateEpisode: {
    id: string;
    createdAt: string;
    updatedAt: string;
    season: string | null;
    number: string | null;
    absoluteNumber: string | null;
    name: string | null;
    baseDuration: number | null;
    show: {
      id: string;
      name: string;
      originalName: string | null;
      createdAt: string;
      updatedAt: string;
      website: string | null;
      image: string | null;
    };
    timestamps: Array<{
      id: string;
      createdAt: string;
      updatedAt: string;
      at: number;
      source: TimestampSource;
      typeId: string;
      episodeId: string;
      createdBy: {
        id: string;
        username: string;
        profileUrl: string;
        createdAt: string;
      };
      updatedBy: {
        id: string;
        username: string;
        profileUrl: string;
        createdAt: string;
      };
    }>;
  };
};

export type UpdateTimestampsMutationVariables = Exact<{
  create: Array<InputTimestampOn> | InputTimestampOn;
  update: Array<InputExistingTimestamp> | InputExistingTimestamp;
  delete: Array<string | number> | string | number;
}>;

export type UpdateTimestampsMutation = {
  updateTimestamps: {
    created: Array<{
      id: string;
      createdAt: string;
      updatedAt: string;
      at: number;
      source: TimestampSource;
      typeId: string;
      episodeId: string;
      createdBy: {
        id: string;
        username: string;
        profileUrl: string;
        createdAt: string;
      };
      updatedBy: {
        id: string;
        username: string;
        profileUrl: string;
        createdAt: string;
      };
    }>;
    updated: Array<{
      id: string;
      createdAt: string;
      updatedAt: string;
      at: number;
      source: TimestampSource;
      typeId: string;
      episodeId: string;
      createdBy: {
        id: string;
        username: string;
        profileUrl: string;
        createdAt: string;
      };
      updatedBy: {
        id: string;
        username: string;
        profileUrl: string;
        createdAt: string;
      };
    }>;
    deleted: Array<{
      id: string;
      createdAt: string;
      updatedAt: string;
      at: number;
      source: TimestampSource;
      typeId: string;
      episodeId: string;
      createdBy: {
        id: string;
        username: string;
        profileUrl: string;
        createdAt: string;
      };
      updatedBy: {
        id: string;
        username: string;
        profileUrl: string;
        createdAt: string;
      };
    }>;
  };
};

export type MyAccountFragment = {
  id: string;
  username: string;
  email: string;
  emailVerified: boolean;
  profileUrl: string;
  role: Role;
  createdAt: string;
};

export type PreferencesFragment = {
  enableAutoSkip: boolean;
  enableAutoPlay: boolean;
  minimizeToolbarWhenEditing: boolean;
  hideTimelineWhenMinimized: boolean;
  colorTheme: ColorTheme;
  skipBranding: boolean;
  skipCanon: boolean;
  skipCredits: boolean;
  skipFiller: boolean;
  skipIntros: boolean;
  skipMixedCredits: boolean;
  skipMixedIntros: boolean;
  skipNewCredits: boolean;
  skipNewIntros: boolean;
  skipPreview: boolean;
  skipRecaps: boolean;
  skipTitleCard: boolean;
  skipTransitions: boolean;
};

export type AuthDetailsFragment = {
  authToken: string;
  refreshToken: string;
  account: {
    id: string;
    username: string;
    email: string;
    emailVerified: boolean;
    profileUrl: string;
    role: Role;
    createdAt: string;
  };
};

export type EpisodeUrlFragment = {
  url: string;
  createdAt: string;
  updatedAt: string;
  duration: number | null;
  timestampsOffset: number | null;
  source: EpisodeSource;
  episode: {
    id: string;
    createdAt: string;
    updatedAt: string;
    season: string | null;
    number: string | null;
    absoluteNumber: string | null;
    name: string | null;
    baseDuration: number | null;
    show: {
      id: string;
      name: string;
      originalName: string | null;
      createdAt: string;
      updatedAt: string;
      website: string | null;
      image: string | null;
    };
    timestamps: Array<{
      id: string;
      createdAt: string;
      updatedAt: string;
      at: number;
      source: TimestampSource;
      typeId: string;
      episodeId: string;
      createdBy: {
        id: string;
        username: string;
        profileUrl: string;
        createdAt: string;
      };
      updatedBy: {
        id: string;
        username: string;
        profileUrl: string;
        createdAt: string;
      };
    }>;
  };
};

export type EpisodeFragment = {
  id: string;
  createdAt: string;
  updatedAt: string;
  season: string | null;
  number: string | null;
  absoluteNumber: string | null;
  name: string | null;
  baseDuration: number | null;
  show: {
    id: string;
    name: string;
    originalName: string | null;
    createdAt: string;
    updatedAt: string;
    website: string | null;
    image: string | null;
  };
  timestamps: Array<{
    id: string;
    createdAt: string;
    updatedAt: string;
    at: number;
    source: TimestampSource;
    typeId: string;
    episodeId: string;
    createdBy: {
      id: string;
      username: string;
      profileUrl: string;
      createdAt: string;
    };
    updatedBy: {
      id: string;
      username: string;
      profileUrl: string;
      createdAt: string;
    };
  }>;
};

export type ShowFragment = {
  id: string;
  name: string;
  originalName: string | null;
  createdAt: string;
  updatedAt: string;
  website: string | null;
  image: string | null;
};

export type TimestampFragment = {
  id: string;
  createdAt: string;
  updatedAt: string;
  at: number;
  source: TimestampSource;
  typeId: string;
  episodeId: string;
  createdBy: {
    id: string;
    username: string;
    profileUrl: string;
    createdAt: string;
  };
  updatedBy: {
    id: string;
    username: string;
    profileUrl: string;
    createdAt: string;
  };
};

export type TimestampTypeFragment = {
  id: string;
  name: string;
  description: string;
};

export type UserFragment = {
  id: string;
  username: string;
  profileUrl: string;
  createdAt: string;
};

export type ThirdPartyEpisodeFragment = {
  id: string | null;
  name: string | null;
  season: string | null;
  number: string | null;
  absoluteNumber: string | null;
  baseDuration: number | null;
  source: TimestampSource | null;
  showId: string;
  show: { name: string };
  timestamps: Array<{ id: string | null; at: number; typeId: string }>;
};

export type ThirdPartyShowFragment = { name: string };

export type ThirdPartyTimestampFragment = {
  id: string | null;
  at: number;
  typeId: string;
};

export type TemplateFragment = {
  id: string;
  type: TemplateType;
  createdAt: string;
  createdByUserId: string;
  updatedAt: string;
  updatedByUserId: string;
  seasons: Array<string> | null;
  sourceEpisodeId: string;
  createdBy: {
    id: string;
    username: string;
    profileUrl: string;
    createdAt: string;
  };
  updatedBy: {
    id: string;
    username: string;
    profileUrl: string;
    createdAt: string;
  };
  sourceEpisode: {
    id: string;
    createdAt: string;
    updatedAt: string;
    season: string | null;
    number: string | null;
    absoluteNumber: string | null;
    name: string | null;
    baseDuration: number | null;
    show: {
      id: string;
      name: string;
      originalName: string | null;
      createdAt: string;
      updatedAt: string;
      website: string | null;
      image: string | null;
    };
    timestamps: Array<{
      id: string;
      createdAt: string;
      updatedAt: string;
      at: number;
      source: TimestampSource;
      typeId: string;
      episodeId: string;
      createdBy: {
        id: string;
        username: string;
        profileUrl: string;
        createdAt: string;
      };
      updatedBy: {
        id: string;
        username: string;
        profileUrl: string;
        createdAt: string;
      };
    }>;
  };
  timestamps: Array<{
    id: string;
    createdAt: string;
    updatedAt: string;
    at: number;
    source: TimestampSource;
    typeId: string;
    episodeId: string;
    createdBy: {
      id: string;
      username: string;
      profileUrl: string;
      createdAt: string;
    };
    updatedBy: {
      id: string;
      username: string;
      profileUrl: string;
      createdAt: string;
    };
  }>;
};

export const PreferencesFragmentDoc = gql`
  fragment Preferences on Preferences {
    enableAutoSkip
    enableAutoPlay
    minimizeToolbarWhenEditing
    hideTimelineWhenMinimized
    colorTheme
    skipBranding
    skipCanon
    skipCredits
    skipFiller
    skipIntros
    skipMixedCredits
    skipMixedIntros
    skipNewCredits
    skipNewIntros
    skipPreview
    skipRecaps
    skipTitleCard
    skipTransitions
  }
`;
export const MyAccountFragmentDoc = gql`
  fragment MyAccount on Account {
    id
    username
    email
    emailVerified
    profileUrl
    role
    createdAt
  }
`;
export const AuthDetailsFragmentDoc = gql`
  fragment AuthDetails on LoginData {
    authToken
    refreshToken
    account {
      ...MyAccount
    }
  }
  ${MyAccountFragmentDoc}
`;
export const ShowFragmentDoc = gql`
  fragment Show on Show {
    id
    name
    originalName
    createdAt
    updatedAt
    website
    image
  }
`;
export const UserFragmentDoc = gql`
  fragment User on User {
    id
    username
    profileUrl
    createdAt
  }
`;
export const TimestampFragmentDoc = gql`
  fragment Timestamp on Timestamp {
    id
    createdAt
    createdBy {
      ...User
    }
    updatedAt
    updatedBy {
      ...User
    }
    at
    source
    typeId
    episodeId
  }
  ${UserFragmentDoc}
`;
export const EpisodeFragmentDoc = gql`
  fragment Episode on Episode {
    id
    createdAt
    updatedAt
    season
    number
    absoluteNumber
    name
    baseDuration
    show {
      ...Show
    }
    timestamps {
      ...Timestamp
    }
  }
  ${ShowFragmentDoc}
  ${TimestampFragmentDoc}
`;
export const EpisodeUrlFragmentDoc = gql`
  fragment EpisodeUrl on EpisodeUrl {
    url
    createdAt
    updatedAt
    duration
    timestampsOffset
    episode {
      ...Episode
    }
    source
  }
  ${EpisodeFragmentDoc}
`;
export const TimestampTypeFragmentDoc = gql`
  fragment TimestampType on TimestampType {
    id
    name
    description
  }
`;
export const ThirdPartyShowFragmentDoc = gql`
  fragment ThirdPartyShow on ThirdPartyShow {
    name
  }
`;
export const ThirdPartyTimestampFragmentDoc = gql`
  fragment ThirdPartyTimestamp on ThirdPartyTimestamp {
    id
    at
    typeId
  }
`;
export const ThirdPartyEpisodeFragmentDoc = gql`
  fragment ThirdPartyEpisode on ThirdPartyEpisode {
    id
    name
    season
    number
    absoluteNumber
    baseDuration
    source
    showId
    show {
      ...ThirdPartyShow
    }
    timestamps {
      ...ThirdPartyTimestamp
    }
  }
  ${ThirdPartyShowFragmentDoc}
  ${ThirdPartyTimestampFragmentDoc}
`;
export const TemplateFragmentDoc = gql`
  fragment Template on Template {
    id
    type
    createdAt
    createdByUserId
    createdBy {
      ...User
    }
    updatedAt
    updatedByUserId
    updatedBy {
      ...User
    }
    seasons
    sourceEpisodeId
    sourceEpisode {
      ...Episode
    }
    timestamps {
      ...Timestamp
    }
  }
  ${UserFragmentDoc}
  ${EpisodeFragmentDoc}
  ${TimestampFragmentDoc}
`;
export const AccountDocument = gql`
  query account {
    account {
      ...MyAccount
      preferences {
        ...Preferences
      }
    }
  }
  ${MyAccountFragmentDoc}
  ${PreferencesFragmentDoc}
`;
export const AllTimestampTypesDocument = gql`
  query allTimestampTypes {
    allTimestampTypes {
      ...TimestampType
    }
  }
  ${TimestampTypeFragmentDoc}
`;
export const CreateEpisodeDocument = gql`
  mutation createEpisode($showId: ID!, $episodeInput: InputEpisode!) {
    createEpisode(showId: $showId, episodeInput: $episodeInput) {
      ...Episode
    }
  }
  ${EpisodeFragmentDoc}
`;
export const CreateEpisodeUrlDocument = gql`
  mutation createEpisodeUrl(
    $episodeId: ID!
    $episodeUrlInput: InputEpisodeUrl!
  ) {
    createEpisodeUrl(episodeId: $episodeId, episodeUrlInput: $episodeUrlInput) {
      ...EpisodeUrl
    }
  }
  ${EpisodeUrlFragmentDoc}
`;
export const CreateShowDocument = gql`
  mutation createShow($showInput: InputShow!, $becomeAdmin: Boolean!) {
    createShow(showInput: $showInput, becomeAdmin: $becomeAdmin) {
      ...Show
    }
  }
  ${ShowFragmentDoc}
`;
export const FindTemplateByDetailsDocument = gql`
  query findTemplateByDetails(
    $episodeId: ID
    $showName: String
    $season: String
  ) {
    findTemplateByDetails(
      episodeId: $episodeId
      showName: $showName
      season: $season
    ) {
      ...Template
    }
  }
  ${TemplateFragmentDoc}
`;
export const DeleteTemplateDocument = gql`
  mutation deleteTemplate($id: ID!) {
    deleteTemplate(templateId: $id) {
      ...Template
    }
  }
  ${TemplateFragmentDoc}
`;
export const FindEpisodeByNameDocument = gql`
  query findEpisodeByName($name: String!) {
    findEpisodeByName(name: $name) {
      ...ThirdPartyEpisode
    }
  }
  ${ThirdPartyEpisodeFragmentDoc}
`;
export const FindEpisodeDocument = gql`
  query findEpisode($episodeId: ID!) {
    findEpisode(episodeId: $episodeId) {
      ...Episode
    }
  }
  ${EpisodeFragmentDoc}
`;
export const FindEpisodeUrlDocument = gql`
  query findEpisodeUrl($url: String!) {
    findEpisodeUrl(episodeUrl: $url) {
      ...EpisodeUrl
    }
  }
  ${EpisodeUrlFragmentDoc}
`;
export const LoginDocument = gql`
  query login($usernameEmail: String!, $passwordHash: String!) {
    login(usernameEmail: $usernameEmail, passwordHash: $passwordHash) {
      ...AuthDetails
    }
  }
  ${AuthDetailsFragmentDoc}
`;
export const LoginRefreshDocument = gql`
  query loginRefresh($refreshToken: String!) {
    loginRefresh(refreshToken: $refreshToken) {
      ...AuthDetails
    }
  }
  ${AuthDetailsFragmentDoc}
`;
export const SavePreferencesDocument = gql`
  mutation savePreferences($preferences: InputPreferences!) {
    savePreferences(preferences: $preferences) {
      updatedAt
    }
  }
`;
export const UpdateTemplateDocument = gql`
  mutation updateTemplate($id: ID!, $newTemplate: InputTemplate!) {
    updateTemplate(templateId: $id, newTemplate: $newTemplate) {
      ...Template
    }
  }
  ${TemplateFragmentDoc}
`;
export const CreateTemplateDocument = gql`
  mutation createTemplate($newTemplate: InputTemplate!) {
    createTemplate(newTemplate: $newTemplate) {
      ...Template
    }
  }
  ${TemplateFragmentDoc}
`;
export const AddTimestampToTemplateDocument = gql`
  mutation addTimestampToTemplate($timestamp: InputTemplateTimestamp!) {
    addTimestampToTemplate(templateTimestamp: $timestamp) {
      timestamp {
        ...Timestamp
      }
    }
  }
  ${TimestampFragmentDoc}
`;
export const RemoveTimestampFromTemplateDocument = gql`
  mutation removeTimestampFromTemplate($timestamp: InputTemplateTimestamp!) {
    removeTimestampFromTemplate(templateTimestamp: $timestamp) {
      timestamp {
        ...Timestamp
      }
    }
  }
  ${TimestampFragmentDoc}
`;
export const SearchShowsDocument = gql`
  query searchShows($search: String!) {
    searchShows(search: $search) {
      ...Show
    }
  }
  ${ShowFragmentDoc}
`;
export const UpdateEpisodeDocument = gql`
  mutation updateEpisode($episodeId: ID!, $newEpisode: InputEpisode!) {
    updateEpisode(episodeId: $episodeId, newEpisode: $newEpisode) {
      ...Episode
    }
  }
  ${EpisodeFragmentDoc}
`;
export const UpdateTimestampsDocument = gql`
  mutation updateTimestamps(
    $create: [InputTimestampOn!]!
    $update: [InputExistingTimestamp!]!
    $delete: [ID!]!
  ) {
    updateTimestamps(create: $create, update: $update, delete: $delete) {
      created {
        ...Timestamp
      }
      updated {
        ...Timestamp
      }
      deleted {
        ...Timestamp
      }
    }
  }
  ${TimestampFragmentDoc}
`;

export type SdkFunctionWrapper = <T>(
  action: (requestHeaders?: Record<string, string>) => Promise<T>,
  operationName: string,
  operationType?: string,
  variables?: any,
) => Promise<T>;

const defaultWrapper: SdkFunctionWrapper = (
  action,
  _operationName,
  _operationType,
  _variables,
) => action();

export function getSdk(
  client: GraphQLClient,
  withWrapper: SdkFunctionWrapper = defaultWrapper,
) {
  return {
    account(
      variables?: AccountQueryVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
      signal?: RequestInit['signal'],
    ): Promise<AccountQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<AccountQuery>({
            document: AccountDocument,
            variables,
            requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders },
            signal,
          }),
        'account',
        'query',
        variables,
      );
    },
    allTimestampTypes(
      variables?: AllTimestampTypesQueryVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
      signal?: RequestInit['signal'],
    ): Promise<AllTimestampTypesQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<AllTimestampTypesQuery>({
            document: AllTimestampTypesDocument,
            variables,
            requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders },
            signal,
          }),
        'allTimestampTypes',
        'query',
        variables,
      );
    },
    createEpisode(
      variables: CreateEpisodeMutationVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
      signal?: RequestInit['signal'],
    ): Promise<CreateEpisodeMutation> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<CreateEpisodeMutation>({
            document: CreateEpisodeDocument,
            variables,
            requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders },
            signal,
          }),
        'createEpisode',
        'mutation',
        variables,
      );
    },
    createEpisodeUrl(
      variables: CreateEpisodeUrlMutationVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
      signal?: RequestInit['signal'],
    ): Promise<CreateEpisodeUrlMutation> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<CreateEpisodeUrlMutation>({
            document: CreateEpisodeUrlDocument,
            variables,
            requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders },
            signal,
          }),
        'createEpisodeUrl',
        'mutation',
        variables,
      );
    },
    createShow(
      variables: CreateShowMutationVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
      signal?: RequestInit['signal'],
    ): Promise<CreateShowMutation> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<CreateShowMutation>({
            document: CreateShowDocument,
            variables,
            requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders },
            signal,
          }),
        'createShow',
        'mutation',
        variables,
      );
    },
    findTemplateByDetails(
      variables?: FindTemplateByDetailsQueryVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
      signal?: RequestInit['signal'],
    ): Promise<FindTemplateByDetailsQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<FindTemplateByDetailsQuery>({
            document: FindTemplateByDetailsDocument,
            variables,
            requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders },
            signal,
          }),
        'findTemplateByDetails',
        'query',
        variables,
      );
    },
    deleteTemplate(
      variables: DeleteTemplateMutationVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
      signal?: RequestInit['signal'],
    ): Promise<DeleteTemplateMutation> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<DeleteTemplateMutation>({
            document: DeleteTemplateDocument,
            variables,
            requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders },
            signal,
          }),
        'deleteTemplate',
        'mutation',
        variables,
      );
    },
    findEpisodeByName(
      variables: FindEpisodeByNameQueryVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
      signal?: RequestInit['signal'],
    ): Promise<FindEpisodeByNameQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<FindEpisodeByNameQuery>({
            document: FindEpisodeByNameDocument,
            variables,
            requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders },
            signal,
          }),
        'findEpisodeByName',
        'query',
        variables,
      );
    },
    findEpisode(
      variables: FindEpisodeQueryVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
      signal?: RequestInit['signal'],
    ): Promise<FindEpisodeQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<FindEpisodeQuery>({
            document: FindEpisodeDocument,
            variables,
            requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders },
            signal,
          }),
        'findEpisode',
        'query',
        variables,
      );
    },
    findEpisodeUrl(
      variables: FindEpisodeUrlQueryVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
      signal?: RequestInit['signal'],
    ): Promise<FindEpisodeUrlQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<FindEpisodeUrlQuery>({
            document: FindEpisodeUrlDocument,
            variables,
            requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders },
            signal,
          }),
        'findEpisodeUrl',
        'query',
        variables,
      );
    },
    login(
      variables: LoginQueryVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
      signal?: RequestInit['signal'],
    ): Promise<LoginQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<LoginQuery>({
            document: LoginDocument,
            variables,
            requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders },
            signal,
          }),
        'login',
        'query',
        variables,
      );
    },
    loginRefresh(
      variables: LoginRefreshQueryVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
      signal?: RequestInit['signal'],
    ): Promise<LoginRefreshQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<LoginRefreshQuery>({
            document: LoginRefreshDocument,
            variables,
            requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders },
            signal,
          }),
        'loginRefresh',
        'query',
        variables,
      );
    },
    savePreferences(
      variables: SavePreferencesMutationVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
      signal?: RequestInit['signal'],
    ): Promise<SavePreferencesMutation> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<SavePreferencesMutation>({
            document: SavePreferencesDocument,
            variables,
            requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders },
            signal,
          }),
        'savePreferences',
        'mutation',
        variables,
      );
    },
    updateTemplate(
      variables: UpdateTemplateMutationVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
      signal?: RequestInit['signal'],
    ): Promise<UpdateTemplateMutation> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<UpdateTemplateMutation>({
            document: UpdateTemplateDocument,
            variables,
            requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders },
            signal,
          }),
        'updateTemplate',
        'mutation',
        variables,
      );
    },
    createTemplate(
      variables: CreateTemplateMutationVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
      signal?: RequestInit['signal'],
    ): Promise<CreateTemplateMutation> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<CreateTemplateMutation>({
            document: CreateTemplateDocument,
            variables,
            requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders },
            signal,
          }),
        'createTemplate',
        'mutation',
        variables,
      );
    },
    addTimestampToTemplate(
      variables: AddTimestampToTemplateMutationVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
      signal?: RequestInit['signal'],
    ): Promise<AddTimestampToTemplateMutation> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<AddTimestampToTemplateMutation>({
            document: AddTimestampToTemplateDocument,
            variables,
            requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders },
            signal,
          }),
        'addTimestampToTemplate',
        'mutation',
        variables,
      );
    },
    removeTimestampFromTemplate(
      variables: RemoveTimestampFromTemplateMutationVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
      signal?: RequestInit['signal'],
    ): Promise<RemoveTimestampFromTemplateMutation> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<RemoveTimestampFromTemplateMutation>({
            document: RemoveTimestampFromTemplateDocument,
            variables,
            requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders },
            signal,
          }),
        'removeTimestampFromTemplate',
        'mutation',
        variables,
      );
    },
    searchShows(
      variables: SearchShowsQueryVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
      signal?: RequestInit['signal'],
    ): Promise<SearchShowsQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<SearchShowsQuery>({
            document: SearchShowsDocument,
            variables,
            requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders },
            signal,
          }),
        'searchShows',
        'query',
        variables,
      );
    },
    updateEpisode(
      variables: UpdateEpisodeMutationVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
      signal?: RequestInit['signal'],
    ): Promise<UpdateEpisodeMutation> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<UpdateEpisodeMutation>({
            document: UpdateEpisodeDocument,
            variables,
            requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders },
            signal,
          }),
        'updateEpisode',
        'mutation',
        variables,
      );
    },
    updateTimestamps(
      variables: UpdateTimestampsMutationVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
      signal?: RequestInit['signal'],
    ): Promise<UpdateTimestampsMutation> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<UpdateTimestampsMutation>({
            document: UpdateTimestampsDocument,
            variables,
            requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders },
            signal,
          }),
        'updateTimestamps',
        'mutation',
        variables,
      );
    },
  };
}
export type Sdk = ReturnType<typeof getSdk>;
