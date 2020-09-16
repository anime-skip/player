<template>
  <div class="EpisodeInfo" :class="{ visible: hasTriedLoadingEpisodeInfo }">
    <h2>
      {{ showTitle }}
      <span>&ensp;&bull;&ensp;{{ serviceDisplayName }}</span>
    </h2>
    <h1>{{ episodeTitle }}</h1>
    <h3>{{ episodeDetails }}</h3>
    <ToolbarButton
      v-if="shouldShowEditButton"
      class="edit-button"
      icon="ic_edit.svg"
      title="Edit Episode Info"
      @click.stop.native="showEditDialog"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Getter, Action } from '@/common/utils/VuexDecorators';
import RequestState from '@/common/utils/RequestState';
import EpisodeUtils from '@/common/utils/EpisodeUtils';
import ToolbarButton from '@/player/components/ToolbarButton.vue';

@Component({
  components: { ToolbarButton },
})
export default class EpisodeInfo extends Vue {
  @Action() public showDialog!: (dialogName?: string) => void;

  @Getter() public displayEpisodeInfo?: DisplayEpisodeInfo;
  @Getter() public episodeRequestState!: RequestState;
  @Getter() public isEditing!: boolean;
  @Getter() public activeDialog?: string;
  @Getter() public isLoggedIn!: boolean;

  public serviceDisplayName = global.serviceDisplayName ?? 'Unknown';

  public get hasTriedLoadingEpisodeInfo(): boolean {
    return (
      this.episodeRequestState === RequestState.FAILURE ||
      this.episodeRequestState === RequestState.SUCCESS
    );
  }

  public get isLoadingEpisodeInfo(): boolean {
    return this.episodeRequestState === RequestState.LOADING;
  }

  public get showTitle(): string {
    return this.displayEpisodeInfo?.show ?? '';
  }

  public get episodeTitle(): string {
    return this.displayEpisodeInfo?.name ?? '';
  }

  public get episodeDetails(): string {
    return EpisodeUtils.seasonAndNumberFromEpisodeInfo(this.displayEpisodeInfo);
  }

  public showEditDialog() {
    this.showDialog('EditEpisodeDialog');
  }

  public get shouldShowEditButton(): boolean {
    return this.activeDialog == null && this.isLoggedIn;
  }
}
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

  .edit-button {
    margin-top: 8px;
    background-color: rgba($color: white, $alpha: 0.12);
    padding-right: 12px;
  }
}
</style>
