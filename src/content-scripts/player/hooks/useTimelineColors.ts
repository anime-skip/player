import { theme } from '@anime-skip/ui';
import * as Api from '~/common/api';
import { isTimestampLocal } from '../utils/isTimestampLocal';

export function useTimelineColors() {
  const values = {
    default: theme['backgroundColor-primaryPalette-500'],
    defaultLight: theme['fill-primary'],
    new: theme['fill-success'],
    edited: theme['backgroundColor-secondaryPalette-300'],
  };
  return values;
}

export function useGetTimestampColor(useLighterDefault: boolean) {
  const colors = useTimelineColors();
  return (timestamp: Api.AmbiguousTimestamp) => {
    if (isTimestampLocal(timestamp)) return colors.new;
    if (timestamp.edited) return colors.edited;

    return colors[useLighterDefault ? 'defaultLight' : 'default'];
  };
}
