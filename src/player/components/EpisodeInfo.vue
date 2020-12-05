<template>
  <div class="EpisodeInfo" :class="{ visible: hasTriedLoadingEpisodeInfo }">
    <h2>
      {{ showTitle }}
      <span>&ensp;&bull;&ensp;{{ serviceDisplayName }}</span>
    </h2>
    <h1>{{ episodeTitle }}</h1>
    <h3>{{ episodeDetails }}</h3>
    <ToolbarButton
      v-if="isConnectButtonVisible"
      class="link-button"
      icon="ic_link.svg"
      title="Connect to Anime Skip"
      @click.stop.native="showEditDialog"
    />
  </div>
</template>

<script lang="ts">
import vueMixins from 'vue-typed-mixins';
import RequestState from '@/common/utils/RequestState';
import EpisodeUtils from '@/common/utils/EpisodeUtils';
import ToolbarButton from '@/player/components/ToolbarButton.vue';
import VideoControllerMixin from '@/common/mixins/VideoController';
import actionTypes from '@/common/store/actionTypes';

export default vueMixins(VideoControllerMixin).extend({
  components: { ToolbarButton },
  data() {
    return {
      serviceDisplayName: global.serviceDisplayName ?? 'Unknown',
    };
  },
  computed: {
    displayEpisodeInfo(): DisplayEpisodeInfo | undefined {
      return this.$store.getters.displayEpisodeInfo;
    },
    episodeRequestState(): RequestState {
      return this.$store.getters.episodeRequestState;
    },
    hasEpisodeUrl(): boolean {
      return !!this.$store.getters.episodeUrl;
    },
    activeDialog(): string | undefined {
      return this.$store.getters.activeDialog;
    },
    isLoggedIn(): boolean {
      return this.$store.getters.isLoggedIn;
    },
    duration(): number | undefined {
      return this.$store.getters.duration;
    },
    hasTriedLoadingEpisodeInfo(): boolean {
      return (
        this.episodeRequestState === RequestState.FAILURE ||
        this.episodeRequestState === RequestState.SUCCESS
      );
    },
    isConnectButtonVisible(): boolean {
      const areDialogsHidden = this.activeDialog == null;
      const episodeUrlIsMissing = !this.hasEpisodeUrl;
      const videoIsLoaded = this.duration != null && this.duration > 0;
      return episodeUrlIsMissing && areDialogsHidden && videoIsLoaded;
    },
    isLoadingEpisodeInfo(): boolean {
      return this.episodeRequestState === RequestState.LOADING;
    },
    showTitle(): string {
      return this.displayEpisodeInfo?.show ?? '';
    },
    episodeTitle(): string {
      return this.displayEpisodeInfo?.name ?? '';
    },
    episodeDetails(): string {
      return EpisodeUtils.seasonAndNumberFromEpisodeInfo(this.displayEpisodeInfo);
    },
  },
  methods: {
    showEpisodeDialog(): void {
      this.$store.dispatch(actionTypes.showDialog, 'EditEpisodeDialog');
    },
    showAccountDialog(): void {
      this.$store.dispatch(actionTypes.showDialog, 'AccountDialog');
    },
    showEditDialog() {
      this.pause();
      if (this.isLoggedIn) {
        this.showEpisodeDialog();
      } else {
        this.showAccountDialog();
      }
    },
  },
});
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

  &.visible {
    opacity: 1;
  }

  * {
    text-align: start;
    margin: 0;
  }

  h1 {
    font-size: 64px;
    font-weight: 400;
    line-height: 64px;
    margin-bottom: 4px;
    color: $textPrimarySolid;
  }

  h2 {
    font-size: 26px;
    font-weight: 600;
    color: $primary300;
    margin-bottom: 16px;
    span {
      color: $textSecondary;
      font-weight: 400;
    }
  }

  h3 {
    font-size: 20px;
    font-weight: 400;
    color: $textSecondary;
  }

  .link-button {
    margin-top: 8px;
    background-color: rgba($color: white, $alpha: 0.12);
    padding-right: 12px;
  }
}
</style>
