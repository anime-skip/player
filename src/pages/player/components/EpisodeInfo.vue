<template>
  <div class="EpisodeInfo">
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

@Component
export default class EpisodeInfo extends Vue {
  @Prop(Object) public episode?: Api.Episode;

  public get showTitle(): string {
    if (!this.episode || !this.episode.show || !this.episode.show.name) {
      return 'Unknown Show';
    }
    return this.episode.show.name;
  }

  public get episodeTitle(): string {
    if (!this.episode || !this.episode.name) {
      return 'Unknown Episode';
    }
    return this.episode.name;
  }

  public get episodeDetails(): string {
    if (!this.episode) return '';
    if (
      this.episode.absoluteNumber != null &&
      this.episode.number != null &&
      this.episode.season != null
    ) {
      return `Season ${this.episode.season}, Episode ${this.episode.number} (#${this.episode.absoluteNumber})`;
    }
    if (this.episode.absoluteNumber != null && this.episode.season != null) {
      return `Season ${this.episode.season} (#${this.episode.absoluteNumber})`;
    }
    if (this.episode.number != null && this.episode.season != null) {
      return `Season ${this.episode.season}, Episode ${this.episode.number}`;
    }
    if (this.episode.absoluteNumber != null) {
      return `Episode #${this.episode.absoluteNumber}`;
    }
    return '';
  }
}
</script>

<style lang="scss" scoped>
.EpisodeInfo {
  * {
    text-align: start;
    margin: 0;
  }

  h1 {
    font-size: 64px;
    font-weight: 300;
    color: $textPrimarySolid;
  }

  h2 {
    font-size: 26px;
    color: $primary300;
    span {
      color: $textSecondary;
      font-weight: 300;
    }
  }

  h3 {
    font-size: 20px;
    color: $textSecondarySolid;
  }
}
</style>
