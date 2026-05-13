<script lang="ts" setup>
import { getSeasonAndNumberText } from '../utils/episode-utils';
import ThemedLogo from './ThemedLogo.vue';

defineProps<{
  /** When hidden, this UI fades away and slides up */
  hidden: boolean;
}>();

const { data: inferredEpisodeInfo } = useEpisodeInfoQuery();
const apiEpisode = useApiEpisode();

const { serviceName } = usePlayerOptions();

const episodeDetails = computed(() => {
  if (apiEpisode.value == null) return inferredEpisodeInfo.value;
  return {
    showName: apiEpisode.value.show.name,
    absoluteNumber: apiEpisode.value.absoluteNumber ?? undefined,
    episodeName: apiEpisode.value.name ?? undefined,
    number: apiEpisode.value.number ?? undefined,
    season: apiEpisode.value.season ?? undefined,
  };
});
const summary = computed(() => getSeasonAndNumberText(episodeDetails.value));
</script>

<template>
  <div
    class="flex max-w-[70%] flex-col justify-start p-12 transition-all duration-200"
    :class="{
      '-translate-y-12 opacity-0': hidden,
      'translate-y-0 opacity-100': !hidden,
    }"
  >
    <h2 class="flex items-center gap-4 truncate">
      <themed-logo class="h-6 w-8 shrink-0" />

      <!-- Show name -->
      <span
        class="font-overpass truncate text-ellipsis text-2xl font-bold text-primary"
        >{{ episodeDetails?.showName ?? 'Unknown Show' }}</span
      >

      <!-- Service Name -->
      <template v-if="serviceName">
        <span class="text-xl font-medium text-base-content text-opacity-50"
          >&bull;</span
        >
        <span class="text-xl font-medium text-base-content text-opacity-50">{{
          serviceName
        }}</span>
      </template>
    </h2>

    <!-- Episode name -->
    <h1 class="font-overpass line-clamp-2 text-[2.625rem] font-bold">
      {{ episodeDetails?.episodeName ?? 'Unknown Episode' }}
    </h1>

    <!-- Episode Numbers -->
    <h3 class="truncate font-medium text-base-content">{{ summary }}</h3>
  </div>
</template>
