/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
import type { DocumentNode } from "graphql";
import type * as Types from './graphql.schema';

import type { GraphQLClient, RequestOptions } from 'graphql-request';
import gql from 'graphql-tag';
export * from './graphql.schema';
type GraphQLClientRequestHeaders = RequestOptions['requestHeaders'];
export type AccountQueryVariables = Exact<{ [key: string]: never; }>;


export type AccountQuery = { account: { id: string, username: string, email: string, emailVerified: boolean, profileUrl: string, role: Types.Role, createdAt: string, preferences: { enableAutoSkip: boolean, enableAutoPlay: boolean, minimizeToolbarWhenEditing: boolean, hideTimelineWhenMinimized: boolean, colorTheme: Types.ColorTheme, skipBranding: boolean, skipCanon: boolean, skipCredits: boolean, skipFiller: boolean, skipIntros: boolean, skipMixedCredits: boolean, skipMixedIntros: boolean, skipNewCredits: boolean, skipNewIntros: boolean, skipPreview: boolean, skipRecaps: boolean, skipTitleCard: boolean, skipTransitions: boolean } } };

export type AllTimestampTypesQueryVariables = Exact<{ [key: string]: never; }>;


export type AllTimestampTypesQuery = { allTimestampTypes: Array<{ id: string, name: string, description: string }> };

export type CreateEpisodeMutationVariables = Exact<{
  showId: string | number;
  episodeInput: Types.InputEpisode;
}>;


export type CreateEpisodeMutation = { createEpisode: { id: string, createdAt: string, updatedAt: string, season: string | null, number: string | null, absoluteNumber: string | null, name: string | null, baseDuration: number | null, show: { id: string, name: string, originalName: string | null, createdAt: string, updatedAt: string, website: string | null, image: string | null }, timestamps: Array<{ id: string, createdAt: string, updatedAt: string, at: number, source: Types.TimestampSource, typeId: string, episodeId: string, createdBy: { id: string, username: string, profileUrl: string, createdAt: string }, updatedBy: { id: string, username: string, profileUrl: string, createdAt: string } }> } };

export type CreateEpisodeUrlMutationVariables = Exact<{
  episodeId: string | number;
  episodeUrlInput: Types.InputEpisodeUrl;
}>;


export type CreateEpisodeUrlMutation = { createEpisodeUrl: { url: string, createdAt: string, updatedAt: string, duration: number | null, timestampsOffset: number | null, source: Types.EpisodeSource, episode: { id: string, createdAt: string, updatedAt: string, season: string | null, number: string | null, absoluteNumber: string | null, name: string | null, baseDuration: number | null, show: { id: string, name: string, originalName: string | null, createdAt: string, updatedAt: string, website: string | null, image: string | null }, timestamps: Array<{ id: string, createdAt: string, updatedAt: string, at: number, source: Types.TimestampSource, typeId: string, episodeId: string, createdBy: { id: string, username: string, profileUrl: string, createdAt: string }, updatedBy: { id: string, username: string, profileUrl: string, createdAt: string } }> } } };

export type CreateShowMutationVariables = Exact<{
  showInput: Types.InputShow;
  becomeAdmin: boolean;
}>;


export type CreateShowMutation = { createShow: { id: string, name: string, originalName: string | null, createdAt: string, updatedAt: string, website: string | null, image: string | null } };

export type FindTemplateByDetailsQueryVariables = Exact<{
  episodeId?: string | number | null | undefined;
  showName?: string | null | undefined;
  season?: string | null | undefined;
}>;


export type FindTemplateByDetailsQuery = { findTemplateByDetails: { id: string, type: Types.TemplateType, createdAt: string, createdByUserId: string, updatedAt: string, updatedByUserId: string, seasons: Array<string> | null, sourceEpisodeId: string, createdBy: { id: string, username: string, profileUrl: string, createdAt: string }, updatedBy: { id: string, username: string, profileUrl: string, createdAt: string }, sourceEpisode: { id: string, createdAt: string, updatedAt: string, season: string | null, number: string | null, absoluteNumber: string | null, name: string | null, baseDuration: number | null, show: { id: string, name: string, originalName: string | null, createdAt: string, updatedAt: string, website: string | null, image: string | null }, timestamps: Array<{ id: string, createdAt: string, updatedAt: string, at: number, source: Types.TimestampSource, typeId: string, episodeId: string, createdBy: { id: string, username: string, profileUrl: string, createdAt: string }, updatedBy: { id: string, username: string, profileUrl: string, createdAt: string } }> }, timestamps: Array<{ id: string, createdAt: string, updatedAt: string, at: number, source: Types.TimestampSource, typeId: string, episodeId: string, createdBy: { id: string, username: string, profileUrl: string, createdAt: string }, updatedBy: { id: string, username: string, profileUrl: string, createdAt: string } }> } };

export type DeleteTemplateMutationVariables = Exact<{
  id: string | number;
}>;


export type DeleteTemplateMutation = { deleteTemplate: { id: string, type: Types.TemplateType, createdAt: string, createdByUserId: string, updatedAt: string, updatedByUserId: string, seasons: Array<string> | null, sourceEpisodeId: string, createdBy: { id: string, username: string, profileUrl: string, createdAt: string }, updatedBy: { id: string, username: string, profileUrl: string, createdAt: string }, sourceEpisode: { id: string, createdAt: string, updatedAt: string, season: string | null, number: string | null, absoluteNumber: string | null, name: string | null, baseDuration: number | null, show: { id: string, name: string, originalName: string | null, createdAt: string, updatedAt: string, website: string | null, image: string | null }, timestamps: Array<{ id: string, createdAt: string, updatedAt: string, at: number, source: Types.TimestampSource, typeId: string, episodeId: string, createdBy: { id: string, username: string, profileUrl: string, createdAt: string }, updatedBy: { id: string, username: string, profileUrl: string, createdAt: string } }> }, timestamps: Array<{ id: string, createdAt: string, updatedAt: string, at: number, source: Types.TimestampSource, typeId: string, episodeId: string, createdBy: { id: string, username: string, profileUrl: string, createdAt: string }, updatedBy: { id: string, username: string, profileUrl: string, createdAt: string } }> } };

export type FindEpisodeByNameQueryVariables = Exact<{
  name: string;
}>;


export type FindEpisodeByNameQuery = { findEpisodeByName: Array<{ id: string | null, name: string | null, season: string | null, number: string | null, absoluteNumber: string | null, baseDuration: number | null, source: Types.TimestampSource | null, showId: string, show: { name: string }, timestamps: Array<{ id: string | null, at: number, typeId: string }> }> };

export type FindEpisodeQueryVariables = Exact<{
  episodeId: string | number;
}>;


export type FindEpisodeQuery = { findEpisode: { id: string, createdAt: string, updatedAt: string, season: string | null, number: string | null, absoluteNumber: string | null, name: string | null, baseDuration: number | null, show: { id: string, name: string, originalName: string | null, createdAt: string, updatedAt: string, website: string | null, image: string | null }, timestamps: Array<{ id: string, createdAt: string, updatedAt: string, at: number, source: Types.TimestampSource, typeId: string, episodeId: string, createdBy: { id: string, username: string, profileUrl: string, createdAt: string }, updatedBy: { id: string, username: string, profileUrl: string, createdAt: string } }> } };

export type FindEpisodeUrlQueryVariables = Exact<{
  url: string;
}>;


export type FindEpisodeUrlQuery = { findEpisodeUrl: { url: string, createdAt: string, updatedAt: string, duration: number | null, timestampsOffset: number | null, source: Types.EpisodeSource, episode: { id: string, createdAt: string, updatedAt: string, season: string | null, number: string | null, absoluteNumber: string | null, name: string | null, baseDuration: number | null, show: { id: string, name: string, originalName: string | null, createdAt: string, updatedAt: string, website: string | null, image: string | null }, timestamps: Array<{ id: string, createdAt: string, updatedAt: string, at: number, source: Types.TimestampSource, typeId: string, episodeId: string, createdBy: { id: string, username: string, profileUrl: string, createdAt: string }, updatedBy: { id: string, username: string, profileUrl: string, createdAt: string } }> } } };

export type LoginQueryVariables = Exact<{
  usernameEmail: string;
  passwordHash: string;
}>;


export type LoginQuery = { login: { authToken: string, refreshToken: string, account: { id: string, username: string, email: string, emailVerified: boolean, profileUrl: string, role: Types.Role, createdAt: string } } };

export type LoginRefreshQueryVariables = Exact<{
  refreshToken: string;
}>;


export type LoginRefreshQuery = { loginRefresh: { authToken: string, refreshToken: string, account: { id: string, username: string, email: string, emailVerified: boolean, profileUrl: string, role: Types.Role, createdAt: string } } };

export type SavePreferencesMutationVariables = Exact<{
  preferences: Types.InputPreferences;
}>;


export type SavePreferencesMutation = { savePreferences: { updatedAt: string } };

export type UpdateTemplateMutationVariables = Exact<{
  id: string | number;
  newTemplate: Types.InputTemplate;
}>;


export type UpdateTemplateMutation = { updateTemplate: { id: string, type: Types.TemplateType, createdAt: string, createdByUserId: string, updatedAt: string, updatedByUserId: string, seasons: Array<string> | null, sourceEpisodeId: string, createdBy: { id: string, username: string, profileUrl: string, createdAt: string }, updatedBy: { id: string, username: string, profileUrl: string, createdAt: string }, sourceEpisode: { id: string, createdAt: string, updatedAt: string, season: string | null, number: string | null, absoluteNumber: string | null, name: string | null, baseDuration: number | null, show: { id: string, name: string, originalName: string | null, createdAt: string, updatedAt: string, website: string | null, image: string | null }, timestamps: Array<{ id: string, createdAt: string, updatedAt: string, at: number, source: Types.TimestampSource, typeId: string, episodeId: string, createdBy: { id: string, username: string, profileUrl: string, createdAt: string }, updatedBy: { id: string, username: string, profileUrl: string, createdAt: string } }> }, timestamps: Array<{ id: string, createdAt: string, updatedAt: string, at: number, source: Types.TimestampSource, typeId: string, episodeId: string, createdBy: { id: string, username: string, profileUrl: string, createdAt: string }, updatedBy: { id: string, username: string, profileUrl: string, createdAt: string } }> } };

export type CreateTemplateMutationVariables = Exact<{
  newTemplate: Types.InputTemplate;
}>;


export type CreateTemplateMutation = { createTemplate: { id: string, type: Types.TemplateType, createdAt: string, createdByUserId: string, updatedAt: string, updatedByUserId: string, seasons: Array<string> | null, sourceEpisodeId: string, createdBy: { id: string, username: string, profileUrl: string, createdAt: string }, updatedBy: { id: string, username: string, profileUrl: string, createdAt: string }, sourceEpisode: { id: string, createdAt: string, updatedAt: string, season: string | null, number: string | null, absoluteNumber: string | null, name: string | null, baseDuration: number | null, show: { id: string, name: string, originalName: string | null, createdAt: string, updatedAt: string, website: string | null, image: string | null }, timestamps: Array<{ id: string, createdAt: string, updatedAt: string, at: number, source: Types.TimestampSource, typeId: string, episodeId: string, createdBy: { id: string, username: string, profileUrl: string, createdAt: string }, updatedBy: { id: string, username: string, profileUrl: string, createdAt: string } }> }, timestamps: Array<{ id: string, createdAt: string, updatedAt: string, at: number, source: Types.TimestampSource, typeId: string, episodeId: string, createdBy: { id: string, username: string, profileUrl: string, createdAt: string }, updatedBy: { id: string, username: string, profileUrl: string, createdAt: string } }> } };

export type AddTimestampToTemplateMutationVariables = Exact<{
  timestamp: Types.InputTemplateTimestamp;
}>;


export type AddTimestampToTemplateMutation = { addTimestampToTemplate: { timestamp: { id: string, createdAt: string, updatedAt: string, at: number, source: Types.TimestampSource, typeId: string, episodeId: string, createdBy: { id: string, username: string, profileUrl: string, createdAt: string }, updatedBy: { id: string, username: string, profileUrl: string, createdAt: string } } } };

export type RemoveTimestampFromTemplateMutationVariables = Exact<{
  timestamp: Types.InputTemplateTimestamp;
}>;


export type RemoveTimestampFromTemplateMutation = { removeTimestampFromTemplate: { timestamp: { id: string, createdAt: string, updatedAt: string, at: number, source: Types.TimestampSource, typeId: string, episodeId: string, createdBy: { id: string, username: string, profileUrl: string, createdAt: string }, updatedBy: { id: string, username: string, profileUrl: string, createdAt: string } } } };

export type SearchShowsQueryVariables = Exact<{
  search: string;
}>;


export type SearchShowsQuery = { searchShows: Array<{ id: string, name: string, originalName: string | null, createdAt: string, updatedAt: string, website: string | null, image: string | null }> };

export type UpdateEpisodeMutationVariables = Exact<{
  episodeId: string | number;
  newEpisode: Types.InputEpisode;
}>;


export type UpdateEpisodeMutation = { updateEpisode: { id: string, createdAt: string, updatedAt: string, season: string | null, number: string | null, absoluteNumber: string | null, name: string | null, baseDuration: number | null, show: { id: string, name: string, originalName: string | null, createdAt: string, updatedAt: string, website: string | null, image: string | null }, timestamps: Array<{ id: string, createdAt: string, updatedAt: string, at: number, source: Types.TimestampSource, typeId: string, episodeId: string, createdBy: { id: string, username: string, profileUrl: string, createdAt: string }, updatedBy: { id: string, username: string, profileUrl: string, createdAt: string } }> } };

export type UpdateTimestampsMutationVariables = Exact<{
  create: Array<Types.InputTimestampOn> | Types.InputTimestampOn;
  update: Array<Types.InputExistingTimestamp> | Types.InputExistingTimestamp;
  delete: Array<string | number> | string | number;
}>;


export type UpdateTimestampsMutation = { updateTimestamps: { created: Array<{ id: string, createdAt: string, updatedAt: string, at: number, source: Types.TimestampSource, typeId: string, episodeId: string, createdBy: { id: string, username: string, profileUrl: string, createdAt: string }, updatedBy: { id: string, username: string, profileUrl: string, createdAt: string } }>, updated: Array<{ id: string, createdAt: string, updatedAt: string, at: number, source: Types.TimestampSource, typeId: string, episodeId: string, createdBy: { id: string, username: string, profileUrl: string, createdAt: string }, updatedBy: { id: string, username: string, profileUrl: string, createdAt: string } }>, deleted: Array<{ id: string, createdAt: string, updatedAt: string, at: number, source: Types.TimestampSource, typeId: string, episodeId: string, createdBy: { id: string, username: string, profileUrl: string, createdAt: string }, updatedBy: { id: string, username: string, profileUrl: string, createdAt: string } }> } };

export type MyAccountFragment = { id: string, username: string, email: string, emailVerified: boolean, profileUrl: string, role: Types.Role, createdAt: string };

export type PreferencesFragment = { enableAutoSkip: boolean, enableAutoPlay: boolean, minimizeToolbarWhenEditing: boolean, hideTimelineWhenMinimized: boolean, colorTheme: Types.ColorTheme, skipBranding: boolean, skipCanon: boolean, skipCredits: boolean, skipFiller: boolean, skipIntros: boolean, skipMixedCredits: boolean, skipMixedIntros: boolean, skipNewCredits: boolean, skipNewIntros: boolean, skipPreview: boolean, skipRecaps: boolean, skipTitleCard: boolean, skipTransitions: boolean };

export type AuthDetailsFragment = { authToken: string, refreshToken: string, account: { id: string, username: string, email: string, emailVerified: boolean, profileUrl: string, role: Types.Role, createdAt: string } };

export type EpisodeUrlFragment = { url: string, createdAt: string, updatedAt: string, duration: number | null, timestampsOffset: number | null, source: Types.EpisodeSource, episode: { id: string, createdAt: string, updatedAt: string, season: string | null, number: string | null, absoluteNumber: string | null, name: string | null, baseDuration: number | null, show: { id: string, name: string, originalName: string | null, createdAt: string, updatedAt: string, website: string | null, image: string | null }, timestamps: Array<{ id: string, createdAt: string, updatedAt: string, at: number, source: Types.TimestampSource, typeId: string, episodeId: string, createdBy: { id: string, username: string, profileUrl: string, createdAt: string }, updatedBy: { id: string, username: string, profileUrl: string, createdAt: string } }> } };

export type EpisodeFragment = { id: string, createdAt: string, updatedAt: string, season: string | null, number: string | null, absoluteNumber: string | null, name: string | null, baseDuration: number | null, show: { id: string, name: string, originalName: string | null, createdAt: string, updatedAt: string, website: string | null, image: string | null }, timestamps: Array<{ id: string, createdAt: string, updatedAt: string, at: number, source: Types.TimestampSource, typeId: string, episodeId: string, createdBy: { id: string, username: string, profileUrl: string, createdAt: string }, updatedBy: { id: string, username: string, profileUrl: string, createdAt: string } }> };

export type ShowFragment = { id: string, name: string, originalName: string | null, createdAt: string, updatedAt: string, website: string | null, image: string | null };

export type TimestampFragment = { id: string, createdAt: string, updatedAt: string, at: number, source: Types.TimestampSource, typeId: string, episodeId: string, createdBy: { id: string, username: string, profileUrl: string, createdAt: string }, updatedBy: { id: string, username: string, profileUrl: string, createdAt: string } };

export type TimestampTypeFragment = { id: string, name: string, description: string };

export type UserFragment = { id: string, username: string, profileUrl: string, createdAt: string };

export type ThirdPartyEpisodeFragment = { id: string | null, name: string | null, season: string | null, number: string | null, absoluteNumber: string | null, baseDuration: number | null, source: Types.TimestampSource | null, showId: string, show: { name: string }, timestamps: Array<{ id: string | null, at: number, typeId: string }> };

export type ThirdPartyShowFragment = { name: string };

export type ThirdPartyTimestampFragment = { id: string | null, at: number, typeId: string };

export type TemplateFragment = { id: string, type: Types.TemplateType, createdAt: string, createdByUserId: string, updatedAt: string, updatedByUserId: string, seasons: Array<string> | null, sourceEpisodeId: string, createdBy: { id: string, username: string, profileUrl: string, createdAt: string }, updatedBy: { id: string, username: string, profileUrl: string, createdAt: string }, sourceEpisode: { id: string, createdAt: string, updatedAt: string, season: string | null, number: string | null, absoluteNumber: string | null, name: string | null, baseDuration: number | null, show: { id: string, name: string, originalName: string | null, createdAt: string, updatedAt: string, website: string | null, image: string | null }, timestamps: Array<{ id: string, createdAt: string, updatedAt: string, at: number, source: Types.TimestampSource, typeId: string, episodeId: string, createdBy: { id: string, username: string, profileUrl: string, createdAt: string }, updatedBy: { id: string, username: string, profileUrl: string, createdAt: string } }> }, timestamps: Array<{ id: string, createdAt: string, updatedAt: string, at: number, source: Types.TimestampSource, typeId: string, episodeId: string, createdBy: { id: string, username: string, profileUrl: string, createdAt: string }, updatedBy: { id: string, username: string, profileUrl: string, createdAt: string } }> };

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
    ${MyAccountFragmentDoc}`;
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
    ${UserFragmentDoc}`;
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
${TimestampFragmentDoc}`;
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
    ${EpisodeFragmentDoc}`;
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
${ThirdPartyTimestampFragmentDoc}`;
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
${TimestampFragmentDoc}`;
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
${PreferencesFragmentDoc}`;
export const AllTimestampTypesDocument = gql`
    query allTimestampTypes {
  allTimestampTypes {
    ...TimestampType
  }
}
    ${TimestampTypeFragmentDoc}`;
export const CreateEpisodeDocument = gql`
    mutation createEpisode($showId: ID!, $episodeInput: InputEpisode!) {
  createEpisode(showId: $showId, episodeInput: $episodeInput) {
    ...Episode
  }
}
    ${EpisodeFragmentDoc}`;
export const CreateEpisodeUrlDocument = gql`
    mutation createEpisodeUrl($episodeId: ID!, $episodeUrlInput: InputEpisodeUrl!) {
  createEpisodeUrl(episodeId: $episodeId, episodeUrlInput: $episodeUrlInput) {
    ...EpisodeUrl
  }
}
    ${EpisodeUrlFragmentDoc}`;
export const CreateShowDocument = gql`
    mutation createShow($showInput: InputShow!, $becomeAdmin: Boolean!) {
  createShow(showInput: $showInput, becomeAdmin: $becomeAdmin) {
    ...Show
  }
}
    ${ShowFragmentDoc}`;
export const FindTemplateByDetailsDocument = gql`
    query findTemplateByDetails($episodeId: ID, $showName: String, $season: String) {
  findTemplateByDetails(
    episodeId: $episodeId
    showName: $showName
    season: $season
  ) {
    ...Template
  }
}
    ${TemplateFragmentDoc}`;
export const DeleteTemplateDocument = gql`
    mutation deleteTemplate($id: ID!) {
  deleteTemplate(templateId: $id) {
    ...Template
  }
}
    ${TemplateFragmentDoc}`;
export const FindEpisodeByNameDocument = gql`
    query findEpisodeByName($name: String!) {
  findEpisodeByName(name: $name) {
    ...ThirdPartyEpisode
  }
}
    ${ThirdPartyEpisodeFragmentDoc}`;
export const FindEpisodeDocument = gql`
    query findEpisode($episodeId: ID!) {
  findEpisode(episodeId: $episodeId) {
    ...Episode
  }
}
    ${EpisodeFragmentDoc}`;
export const FindEpisodeUrlDocument = gql`
    query findEpisodeUrl($url: String!) {
  findEpisodeUrl(episodeUrl: $url) {
    ...EpisodeUrl
  }
}
    ${EpisodeUrlFragmentDoc}`;
export const LoginDocument = gql`
    query login($usernameEmail: String!, $passwordHash: String!) {
  login(usernameEmail: $usernameEmail, passwordHash: $passwordHash) {
    ...AuthDetails
  }
}
    ${AuthDetailsFragmentDoc}`;
export const LoginRefreshDocument = gql`
    query loginRefresh($refreshToken: String!) {
  loginRefresh(refreshToken: $refreshToken) {
    ...AuthDetails
  }
}
    ${AuthDetailsFragmentDoc}`;
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
    ${TemplateFragmentDoc}`;
export const CreateTemplateDocument = gql`
    mutation createTemplate($newTemplate: InputTemplate!) {
  createTemplate(newTemplate: $newTemplate) {
    ...Template
  }
}
    ${TemplateFragmentDoc}`;
export const AddTimestampToTemplateDocument = gql`
    mutation addTimestampToTemplate($timestamp: InputTemplateTimestamp!) {
  addTimestampToTemplate(templateTimestamp: $timestamp) {
    timestamp {
      ...Timestamp
    }
  }
}
    ${TimestampFragmentDoc}`;
export const RemoveTimestampFromTemplateDocument = gql`
    mutation removeTimestampFromTemplate($timestamp: InputTemplateTimestamp!) {
  removeTimestampFromTemplate(templateTimestamp: $timestamp) {
    timestamp {
      ...Timestamp
    }
  }
}
    ${TimestampFragmentDoc}`;
export const SearchShowsDocument = gql`
    query searchShows($search: String!) {
  searchShows(search: $search) {
    ...Show
  }
}
    ${ShowFragmentDoc}`;
export const UpdateEpisodeDocument = gql`
    mutation updateEpisode($episodeId: ID!, $newEpisode: InputEpisode!) {
  updateEpisode(episodeId: $episodeId, newEpisode: $newEpisode) {
    ...Episode
  }
}
    ${EpisodeFragmentDoc}`;
export const UpdateTimestampsDocument = gql`
    mutation updateTimestamps($create: [InputTimestampOn!]!, $update: [InputExistingTimestamp!]!, $delete: [ID!]!) {
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
    ${TimestampFragmentDoc}`;

export type SdkFunctionWrapper = <T>(action: (requestHeaders?:Record<string, string>) => Promise<T>, operationName: string, operationType?: string, variables?: any) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = (action, _operationName, _operationType, _variables) => action();

export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    account(variables?: AccountQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<AccountQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<AccountQuery>({ document: AccountDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'account', 'query', variables);
    },
    allTimestampTypes(variables?: AllTimestampTypesQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<AllTimestampTypesQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<AllTimestampTypesQuery>({ document: AllTimestampTypesDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'allTimestampTypes', 'query', variables);
    },
    createEpisode(variables: CreateEpisodeMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<CreateEpisodeMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<CreateEpisodeMutation>({ document: CreateEpisodeDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'createEpisode', 'mutation', variables);
    },
    createEpisodeUrl(variables: CreateEpisodeUrlMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<CreateEpisodeUrlMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<CreateEpisodeUrlMutation>({ document: CreateEpisodeUrlDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'createEpisodeUrl', 'mutation', variables);
    },
    createShow(variables: CreateShowMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<CreateShowMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<CreateShowMutation>({ document: CreateShowDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'createShow', 'mutation', variables);
    },
    findTemplateByDetails(variables?: FindTemplateByDetailsQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<FindTemplateByDetailsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<FindTemplateByDetailsQuery>({ document: FindTemplateByDetailsDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'findTemplateByDetails', 'query', variables);
    },
    deleteTemplate(variables: DeleteTemplateMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<DeleteTemplateMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<DeleteTemplateMutation>({ document: DeleteTemplateDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'deleteTemplate', 'mutation', variables);
    },
    findEpisodeByName(variables: FindEpisodeByNameQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<FindEpisodeByNameQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<FindEpisodeByNameQuery>({ document: FindEpisodeByNameDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'findEpisodeByName', 'query', variables);
    },
    findEpisode(variables: FindEpisodeQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<FindEpisodeQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<FindEpisodeQuery>({ document: FindEpisodeDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'findEpisode', 'query', variables);
    },
    findEpisodeUrl(variables: FindEpisodeUrlQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<FindEpisodeUrlQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<FindEpisodeUrlQuery>({ document: FindEpisodeUrlDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'findEpisodeUrl', 'query', variables);
    },
    login(variables: LoginQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<LoginQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<LoginQuery>({ document: LoginDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'login', 'query', variables);
    },
    loginRefresh(variables: LoginRefreshQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<LoginRefreshQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<LoginRefreshQuery>({ document: LoginRefreshDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'loginRefresh', 'query', variables);
    },
    savePreferences(variables: SavePreferencesMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<SavePreferencesMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<SavePreferencesMutation>({ document: SavePreferencesDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'savePreferences', 'mutation', variables);
    },
    updateTemplate(variables: UpdateTemplateMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<UpdateTemplateMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<UpdateTemplateMutation>({ document: UpdateTemplateDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'updateTemplate', 'mutation', variables);
    },
    createTemplate(variables: CreateTemplateMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<CreateTemplateMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<CreateTemplateMutation>({ document: CreateTemplateDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'createTemplate', 'mutation', variables);
    },
    addTimestampToTemplate(variables: AddTimestampToTemplateMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<AddTimestampToTemplateMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<AddTimestampToTemplateMutation>({ document: AddTimestampToTemplateDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'addTimestampToTemplate', 'mutation', variables);
    },
    removeTimestampFromTemplate(variables: RemoveTimestampFromTemplateMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<RemoveTimestampFromTemplateMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<RemoveTimestampFromTemplateMutation>({ document: RemoveTimestampFromTemplateDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'removeTimestampFromTemplate', 'mutation', variables);
    },
    searchShows(variables: SearchShowsQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<SearchShowsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<SearchShowsQuery>({ document: SearchShowsDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'searchShows', 'query', variables);
    },
    updateEpisode(variables: UpdateEpisodeMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<UpdateEpisodeMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<UpdateEpisodeMutation>({ document: UpdateEpisodeDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'updateEpisode', 'mutation', variables);
    },
    updateTimestamps(variables: UpdateTimestampsMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<UpdateTimestampsMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<UpdateTimestampsMutation>({ document: UpdateTimestampsDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'updateTimestamps', 'mutation', variables);
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;