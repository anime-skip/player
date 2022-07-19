<template>
  <div class="EpisodeInfo as-space-y-4" :class="{ 'as-visible': isShowing }">
    <div class="as-flex as-flex-row as-items-center as-space-x-3">
      <a
        v-if="showThemeLogo"
        class="as-pr-1"
        href="https://anime-skip.com"
        target="_blank"
        @click.stop
      >
        <ThemedLogo class="as-w-8 as-h-8 as-object-contain" />
      </a>
      <h5 class="as-text-primary as-pt-1 as-line-clamp-2" :title="episodeDisplayInfo.show">
        {{ episodeDisplayInfo.show }}
        <span class="as-font-normal as-text-opacity-low"
          >&ensp;&bull;&ensp;{{ serviceDisplayName }}</span
        >
      </h5>
    </div>
    <h3 class="as-line-clamp-2" :title="episodeDisplayInfo.name">{{ episodeDisplayInfo.name }}</h3>
    <h6 class="as-text-on-surface as-text-opacity-high">{{ episodeDetails }}</h6>
    <FlatButton v-if="isConnectButtonShowing" transparent @click.stop="showConnectEpisodeDialog">
      <Icon
        class="as-inline as-fill-on-surface as-opacity-100"
        path="M10.59,13.41C11,13.8 11,14.44 10.59,14.83C10.2,15.22 9.56,15.22 9.17,14.83C7.22,12.88 7.22,9.71 9.17,7.76V7.76L12.71,4.22C14.66,2.27 17.83,2.27 19.78,4.22C21.73,6.17 21.73,9.34 19.78,11.29L18.29,12.78C18.3,11.96 18.17,11.14 17.89,10.36L18.36,9.88C19.54,8.71 19.54,6.81 18.36,5.64C17.19,4.46 15.29,4.46 14.12,5.64L10.59,9.17C9.41,10.34 9.41,12.24 10.59,13.41M13.41,9.17C13.8,8.78 14.44,8.78 14.83,9.17C16.78,11.12 16.78,14.29 14.83,16.24V16.24L11.29,19.78C9.34,21.73 6.17,21.73 4.22,19.78C2.27,17.83 2.27,14.66 4.22,12.71L5.71,11.22C5.7,12.04 5.83,12.86 6.11,13.65L5.64,14.12C4.46,15.29 4.46,17.19 5.64,18.36C6.81,19.54 8.71,19.54 9.88,18.36L13.41,14.83C14.59,13.66 14.59,11.76 13.41,10.59C13,10.2 13,9.56 13.41,9.17Z"
      />
      <span class="as-pl-2">Connect to Anime Skip</span>
    </FlatButton>
  </div>
</template>

<script lang="ts" setup>
import { RequestState } from 'vue-use-request-state';
import ThemedLogo from '~/components/ThemedLogo.vue';
import { usePlayerConfig } from '~/composables/player-config';
import { useEpisodeDisplayInfo } from '~/composables/useEpisodeDisplayInfo';
import { useTheme } from '~/composables/useTheme';
import { useDialogState, useShowConnectEpisodeDialog } from '~/stores/useDialogState';
import { useEpisodeUrl } from '~/stores/useEpisodeState';
import { useInferRequestState } from '~/stores/useInferredEpisodeState';
import { usePlayHistory } from '~/stores/usePlayHistory';
import { useDuration, useVideoState } from '~/stores/useVideoState';
import EpisodeUtils from '~utils/episode-utils';

const { serviceDisplayName } = usePlayerConfig();

const episodeDisplayInfo = useEpisodeDisplayInfo();
const episodeDetails = computed(() =>
  EpisodeUtils.seasonAndNumberFromEpisodeInfo(episodeDisplayInfo.value)
);

const episodeUrl = useEpisodeUrl();
const hasEpisodeUrl = computed(() => episodeUrl.value != null);

const { activeDialog } = useDialogState();

const showConnectEpisodeDialog = useShowConnectEpisodeDialog();

const inferRequestState = useInferRequestState();
const hasRequestedInferredDetails = computed(
  () =>
    inferRequestState.value === RequestState.SUCCESS ||
    inferRequestState.value === RequestState.FAILURE
);
const videoState = useVideoState();
const playHistory = usePlayHistory();
const isShowing = computed<boolean>(() => videoState.isPaused || playHistory.isInitialBuffer);

const duration = useDuration();
const isConnectButtonShowing = computed(() => {
  const allowedActiveDialogs = [undefined, 'TimestampsPanel'];
  return (
    !hasEpisodeUrl.value &&
    hasRequestedInferredDetails.value &&
    allowedActiveDialogs.includes(activeDialog) &&
    !!duration.value
  );
});

const { showThemeLogo } = useTheme();
</script>

<style lang="scss" scoped>
.EpisodeInfo {
  max-width: 1100px;
  width: 75%;
  min-width: 400px;
  opacity: 0;
  transition: 250ms;
  transition-property: opacity;
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  &.as-visible {
    opacity: 1;
  }

  * {
    text-align: start;
    margin: 0;
  }
}

.as-opacity-100 {
  opacity: 1 !important;
}
</style>
