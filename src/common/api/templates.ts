import { GqlTemplate, GqlTemplateType } from '@anime-skip/axios-api';
import { Episode } from './episodes';

export interface Template
  extends Pick<
    GqlTemplate,
    'id' | 'showId' | 'sourceEpisodeId' | 'type' | 'seasons' | 'timestampIds'
  > {
  sourceEpisode: Episode;
}

export { GqlTemplateType as TemplateType };

export const FIND_TEMPLATE_QUERY = `{}`; // TODO

export const CREATE_TEMPLATE_MUTATION = `{}`; // TODO

export const UPDATE_TEMPLATE_MUTATION = `{}`; // TODO

export const DELETE_TEMPLATE_MUTATION = `{}`; // TODO

export const ADD_TIMESTAMP_TO_TEMPLATE_MUTATION = `{}`; // TODO

export const REMOVE_TIMESTAMP_TO_TEMPLATE_MUTATION = `{}`; // TODO
