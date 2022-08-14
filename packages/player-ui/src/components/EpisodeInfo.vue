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
      <i-mdi-link-variant class="as-w-6 as-h-6 as-fill-on-surface as-inline" />
      <span class="as-pl-2">Connect to Anime Skip</span>
    </FlatButton>
  </div>
</template>

<script lang="ts" setup>
import { RequestState } from 'vue-use-request-state';
import ThemedLogo from '~/components/ThemedLogo.vue';
import { usePlayerConfig } from '~/composables/usePlayerConfig';
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
