<template>
  <div class="EpisodeInfo space-y-4" :class="{ visible: hasLoadedData }">
    <h5 class="text-primary line-height-2.5">
      <a class="pr-1" href="https://anime-skip.com">
        <web-ext-img class="h-6 inline-block pb-1" src="logo-sm.svg" />
      </a>
      {{ showTitle }}
      <span class="font-normal text-opacity-low">&ensp;&bull;&ensp;{{ serviceDisplayName }}</span>
    </h5>
    <h3>{{ episodeTitle }}</h3>
    <h6 class="text-on-surface text-opacity-high">{{ episodeDetails }}</h6>
    <FlatButton v-if="isConnectButtonVisible" transparent @click.stop="showEditDialog">
      <Icon
        class="inline fill-on-surface opacity-100"
        path="M10.59,13.41C11,13.8 11,14.44 10.59,14.83C10.2,15.22 9.56,15.22 9.17,14.83C7.22,12.88 7.22,9.71 9.17,7.76V7.76L12.71,4.22C14.66,2.27 17.83,2.27 19.78,4.22C21.73,6.17 21.73,9.34 19.78,11.29L18.29,12.78C18.3,11.96 18.17,11.14 17.89,10.36L18.36,9.88C19.54,8.71 19.54,6.81 18.36,5.64C17.19,4.46 15.29,4.46 14.12,5.64L10.59,9.17C9.41,10.34 9.41,12.24 10.59,13.41M13.41,9.17C13.8,8.78 14.44,8.78 14.83,9.17C16.78,11.12 16.78,14.29 14.83,16.24V16.24L11.29,19.78C9.34,21.73 6.17,21.73 4.22,19.78C2.27,17.83 2.27,14.66 4.22,12.71L5.71,11.22C5.7,12.04 5.83,12.86 6.11,13.65L5.64,14.12C4.46,15.29 4.46,17.19 5.64,18.36C6.81,19.54 8.71,19.54 9.88,18.36L13.41,14.83C14.59,13.66 14.59,11.76 13.41,10.59C13,10.2 13,9.56 13.41,9.17Z"
      />
      <span class="pl-2">Connect to Anime Skip</span>
    </FlatButton>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import RequestState from '~/common/utils/RequestState';
import EpisodeUtils from '~/common/utils/EpisodeUtils';
import VideoControllerMixin from '~/common/mixins/VideoController';

export default defineComponent({
  mixins: [VideoControllerMixin],
  data() {
    return {
      serviceDisplayName: window.serviceDisplayName ?? 'Unknown',
    };
  },
  computed: {
    displayEpisodeInfo(): DisplayEpisodeInfo | undefined {
      return this.$store.getters[GetterTypes.DISPLAY_EPISODE_INFO];
    },
    initialVideoDataRequestState(): RequestState {
      return this.$store.state.initialVideoDataRequestState;
    },
    hasEpisodeUrl(): boolean {
      return !!this.$store.state.episodeUrl;
    },
    activeDialog(): string | undefined {
      return this.$store.state.activeDialog;
    },
    isLoggedIn(): boolean {
      return this.$store.state.isLoggedIn;
    },
    duration(): number | undefined {
      return this.$store.getters[GetterTypes.DURATION];
    },
    hasLoadedData(): boolean {
      return (
        this.initialVideoDataRequestState === RequestState.FAILURE ||
        this.initialVideoDataRequestState === RequestState.SUCCESS
      );
    },
    isConnectButtonVisible(): boolean {
      const areDialogsHidden = this.activeDialog == null || this.activeDialog === 'TimestampsPanel';
      const episodeUrlIsMissing = !this.hasEpisodeUrl;
      const videoIsLoaded = this.duration != null && this.duration > 0;
      return episodeUrlIsMissing && areDialogsHidden && videoIsLoaded;
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
      this.$store.dispatch(ActionTypes.SHOW_DIALOG, 'EditEpisodeDialog');
    },
    showLoginDialog(): void {
      this.$store.commit(MutationTypes.TOGGLE_LOGIN_DIALOG, true);
    },
    showEditDialog() {
      this.pause();
      if (!this.isLoggedIn) {
        this.showLoginDialog();
      }
      this.showEpisodeDialog();
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
}

.opacity-100 {
  opacity: 1 !important;
}

.line-height-2\.5 {
  line-height: 2.5rem;
}
</style>
