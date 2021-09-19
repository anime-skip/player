import { GqlTemplate, GqlTemplateType } from '@anime-skip/axios-api';
import { Episode } from './episodes';
import { Timestamp, TIMESTAMP_DATA } from './timestamps';

// Template

export interface Template
  extends Pick<GqlTemplate, 'id' | 'showId' | 'sourceEpisodeId' | 'type' | 'seasons'> {
  sourceEpisode: Episode;
  timestamps: Timestamp[];
}
export const TEMPLATE_DATA = `{
  id
  showId
  sourceEpisodeId
  type
  seasons
  timestamps ${TIMESTAMP_DATA}
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
