import { GqlTemplate, GqlTemplateType } from '@anime-skip/axios-api';
import { Episode } from './episodes';

// Template

export interface Template
  extends Pick<
    GqlTemplate,
    'id' | 'showId' | 'sourceEpisodeId' | 'type' | 'seasons' | 'timestampIds'
  > {
  sourceEpisode: Episode;
}
export const TEMPLATE_DATA = `{
  id
  showId
  sourceEpisodeId
  timestampIds
  type
  seasons
}`;

// TemplateType

export { GqlTemplateType as TemplateType };

// Template Timestamp

export interface TemplateTimestamp {
  templateId: string;
  timestampId: string;
}
export const TEMPLATE_TIMESTAMPS_DATA = `{
  templateId
  timestampId
}`;
