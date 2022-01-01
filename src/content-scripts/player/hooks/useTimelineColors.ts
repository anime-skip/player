import * as Api from '~api';
import { isTimestampLocal } from '../utils/isTimestampLocal';

function useTimelineColors() {
  const values = {
    text: {
      default: 'as-text-primary',
      new: 'as-text-success',
      edited: 'as-text-secondary',
    },
    icon: {
      default: 'as-fill-timeline-foreground',
      new: 'as-fill-success',
      edited: 'as-fill-secondary',
    },
  };
  return values;
}

export function useGetTimestampColor(type: 'text' | 'icon') {
  const colors = useTimelineColors();
  return (timestamp: Api.AmbiguousTimestamp) => {
    if (isTimestampLocal(timestamp)) return colors[type].new;
    if (timestamp.edited) return colors[type].edited;
    return colors[type].default;
  };
}
