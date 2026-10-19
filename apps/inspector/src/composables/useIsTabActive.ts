import { type MaybeRefOrGetter, computed, toValue } from 'vue';

export default function (path: MaybeRefOrGetter<string>) {
  const route = useRoute();
  return computed(() => route.path.startsWith(toValue(path)));
}
