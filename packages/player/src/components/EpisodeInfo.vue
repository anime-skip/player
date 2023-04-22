<script lang="ts" setup>
import ThemedLogo from './ThemedLogo.vue';
import { getSeasonAndNumberText } from '../utils/episode-utils';

defineProps<{
  /**
   * When hidden, this UI fades away and slides up
   */
  hidden: boolean;
}>();

const { data: inferredEpisodeInfo } = useEpisodeInfoQuery();
const apiEpsiode = useApiEpisode();

const { serviceName } = usePlayerOptions();

const episodeDetails = computed(() => {
  if (apiEpsiode.value == null) return inferredEpisodeInfo.value;
  return {
    showName: apiEpsiode.value.show.name,
    absoluteNumber: apiEpsiode.value.absoluteNumber ?? undefined,
    episodeName: apiEpsiode.value.name ?? undefined,
    number: apiEpsiode.value.number ?? undefined,
    season: apiEpsiode.value.season ?? undefined,
  };
});
const summary = computed(() => getSeasonAndNumberText(episodeDetails.value));
</script>

<template>
  <div
    class="flex flex-col justify-start p-12 duration-200 transition-all"
    :class="{
      '-translate-y-12 opacity-0': hidden,
      'translate-y-0 opacity-100': !hidden,
    }"
  >
    <h2 class="flex items-center gap-4 truncate">
      <themed-logo class="h-6 w-8 shrink-0" />

      <!-- Show name -->
      <span
        class="text-2xl text-primary font-bold font-overpass truncate text-ellipsis"
        >{{ episodeDetails?.showName ?? 'Unknown Show' }}</span
      >

      <!-- Service Name -->
      <template v-if="serviceName">
        <span class="text-xl text-base-content text-opacity-50 font-medium"
          >&bull;</span
        >
        <span class="text-xl text-base-content text-opacity-50 font-medium">{{
          serviceName
        }}</span>
      </template>
    </h2>

    <!-- Episode name -->
    <h1 class="text-[2.625rem] font-bold font-overpass line-clamp-2">
      {{ episodeDetails?.episodeName ?? 'Unknown Episode' }}
    </h1>

    <!-- Episode Numbers -->
    <h3 class="font-medium text-base-content truncate">{{ summary }}</h3>
  </div>
</template>
