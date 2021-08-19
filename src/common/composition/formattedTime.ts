import { computed, Ref } from 'vue';
import Utils from '../utils/Utils';

export default function useFormattedTime(
  currentTimeInS: Ref<number>,
  showDecimals: Ref<boolean>
): Ref<string> {
  return computed(() => Utils.formatSeconds(currentTimeInS.value, showDecimals.value));
}
