import { Ref } from 'vue';
import fuzzysort from 'fuzzysort';

export default function <T>(
  search: Ref<string>,
  fullList: Ref<T[] | undefined>,
  extract: (t: T) => string,
) {
  return computed<T[]>(() => {
    if (fullList.value == null) return [];

    const s = search.value.toLowerCase().trim();
    if (!s) return fullList.value;

    return fuzzysort
      .go(search.value, fullList.value, { key: 'name', limit: 5 })
      .map((res) => res.obj);
  });
}
