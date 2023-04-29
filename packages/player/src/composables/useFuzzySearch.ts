import { Ref } from 'vue';
import fuzzy from 'fuzzy';

export default function <T>(
  search: Ref<string>,
  fullList: Ref<T[] | undefined>,
  extract: (t: T) => string,
) {
  return computed<T[]>(() => {
    if (fullList.value == null) return [];

    const s = search.value.toLowerCase().trim();
    if (!s) return fullList.value;

    return fuzzy
      .filter(s, fullList.value, { extract: (t) => extract(t).toLowerCase() })
      .sort((l, r) => r.score - l.score)
      .filter((i) => i.score > 0.75)
      .map((t) => t.original);
  });
}
