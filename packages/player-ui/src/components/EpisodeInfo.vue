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
      <h5 class="as-text-primary as-pt-1 as-line-clamp-2" :title="showName">
        {{ showName }}
        <span class="as-font-normal as-text-opacity-low"
          >&ensp;&bull;&ensp;{{ serviceDisplayName }}</span
        >
      </h5>
    </div>
    <h3 class="as-line-clamp-2" :title="episodeName">{{ episodeName }}</h3>
    <h6 class="as-text-on-surface as-text-opacity-high">{{ episodeDetails }}</h6>
    <FlatButton v-if="isConnectButtonShowing" transparent @click.stop="showConnectEpisodeDialog">
      <i-mdi-link-variant class="as-w-6 as-h-6 as-fill-on-surface as-inline" />
      <span class="as-pl-2">Connect to Anime Skip</span>
    </FlatButton>
  </div>
</template>

<script lang="ts" setup>
import { RequestState } from 'vue-use-request-state';
import ThemedLogo from './ThemedLogo.vue';
import { usePlayerConfig } from '../composables/usePlayerConfig';
import { useTheme } from '../composables/useTheme';
import EpisodeUtils from 'common/src/utils/episode-utils';
import { useDisplayedEpisodeInfo } from '../state/composables/useDisplayedEpisodeInfo';
import { useEpisodeStore } from '../state/stores/useEpisodeStore';
import { storeToRefs } from 'pinia';
import { DialogName, useDialogStore } from '../state/stores/useDialogStore';
import { useShowConnectEpisodeDialog } from '../state/composables/useShowConnectEpisodeDialog';
import { useCrawlEpisodeStore } from '../state/stores/useCrawledEpisodeStore';
import { useCrawlEpisodeInfoQuery } from '../state/composables/useCrawlEpisodeInfoQuery';
import { useVideoStateStore } from '../state/stores/useVideoStateStore';
import { usePlayHistoryStore } from '../state/stores/usePlayHistoryStore';

const { serviceDisplayName } = usePlayerConfig();
const { episodeUrl, episode } = storeToRefs(useEpisodeStore());
const crawlStore = useCrawlEpisodeStore();
const { crawledInfo } = storeToRefs(crawlStore);
const dialogs = useDialogStore();
const videoState = useVideoStateStore();
const playHistory = usePlayHistoryStore();

const { episodeName, episodeNumber, season, absoluteNumber, showName } = useDisplayedEpisodeInfo(
  episode,
  crawledInfo
);
const episodeDetails = computed(() =>
  EpisodeUtils.seasonAndNumberDisplay({
    number: episodeNumber.value,
    season: season.value,
    absoluteNumber: absoluteNumber.value,
  })
);

const hasEpisodeUrl = computed(() => episodeUrl.value != null);

const showConnectEpisodeDialog = useShowConnectEpisodeDialog();

const isShowing = computed<boolean>(() => videoState.isPaused || playHistory.isInitialBuffer);

const isConnectButtonShowing = computed(() => {
  const allowedActiveDialogs = [undefined, DialogName.TIMESTAMPS_PANEL];
  return (
    !hasEpisodeUrl.value &&
    crawlStore.query.isIdle &&
    allowedActiveDialogs.includes(dialogs.activeDialog) &&
    !!videoState.duration
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
