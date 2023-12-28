import { MaybeRefOrGetter, computed } from 'vue';

export default function (path: MaybeRefOrGetter<string>) {
  const route = useRoute();
  return computed(() => route.path.startsWith(toValue(path)));
}
