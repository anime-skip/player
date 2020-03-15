<template>
  <div class="EpisodeInfo" :class="{ visible: hasTriedLoadingEpisodeInfo }">
    <h2>
      {{ showTitle }}
      <span>&ensp;&bull;&ensp;Anime Skip</span>
    </h2>
    <h1>{{ episodeTitle }}</h1>
    <h3>{{ episodeDetails }}</h3>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { Getter } from '@/common/utils/VuexDecorators';
import RequestState from '@/common/utils/RequestState';

@Component
export default class EpisodeInfo extends Vue {
  @Getter() public episodeUrl?: Api.EpisodeUrl;
  @Getter() public episodeRequestState!: RequestState;

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
    return this.episodeUrl?.episode?.show?.name ?? 'Unknown Show';
  }

  public get episodeTitle(): string {
    return this.episodeUrl?.episode?.name ?? 'Unknown Episode';
  }

  public get episodeDetails(): string {
    if (!this.episodeUrl) return '';

    const { absoluteNumber, number, season } = this.episodeUrl?.episode;

    if (absoluteNumber != null && number != null && season != null && number === absoluteNumber) {
      return `Season ${season}, Episode ${number}`;
    }
    if (absoluteNumber != null && number != null && season != null) {
      return `Season ${season}, Episode ${number} (#${absoluteNumber})`;
    }
    if (absoluteNumber != null && season != null) {
      return `Season ${season} (#${absoluteNumber})`;
    }
    if (number != null && season != null) {
      return `Season ${season}, Episode ${number}`;
    }
    if (absoluteNumber != null) {
      return `Episode #${absoluteNumber}`;
    }
    return '';
  }
}
</script>

<style lang="scss" scoped>
.EpisodeInfo {
  opacity: 0;
  transition: 250ms;
  transition-property: opacity;

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
    color: $textPrimarySolid;
  }

  h2 {
    font-size: 26px;
    font-weight: 600;
    color: $primary300;
    span {
      color: $textSecondary;
      font-weight: 400;
    }
  }

  h3 {
    font-size: 20px;
    font-weight: 400;
    color: $textSecondarySolid;
  }
}
</style>
