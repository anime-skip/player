<template>
  <BasicDialog name="EditEpisodeDialog" gravityX="center" gravityY="center" @show="onShowDialog()">
    <ProgressOverlay :isLoading="isLoadingEpisode">
      <h2 class="section-header">Find Existing Episode</h2>
      <AutocompleteTextInput
        class="row"
        label="Find Show"
        v-model="selectedShowOption"
        :options="showSearchListItems"
        @select="onChangeSelectedShow"
        @search="searchShows"
      />
      <AutocompleteTextInput
        class="row"
        label="Find Episode"
        v-model="selectedEpisodeOption"
        :options="episodeSearchListItems"
        @select="onChangeSelectedEpisode"
        @search="onSearchEpisodes"
      />
      <div class="row flex-row">
        <TextInput
          class="flex-1"
          label="Season"
          v-model="editableSeasonNumber"
          :disabled="shouldDisableEpisodeNumbers"
        />
        <div class="column-space" />
        <TextInput
          class="flex-1"
          label="Episode #"
          v-model="editableEpisodeNumber"
          :disabled="shouldDisableEpisodeNumbers"
        />
        <div class="column-space" />
        <TextInput
          class="flex-1"
          label="Overall #"
          v-model="editableAbsoluteNumber"
          :disabled="shouldDisableEpisodeNumbers"
        />
      </div>
      <input
        type="submit"
        value="Save Episode"
        class="clickable focus button save"
        @click="onClickSaveChanges"
      />
    </ProgressOverlay>
  </BasicDialog>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import Popup from '@/popup/Popup.vue';
import BasicDialog from './BasicDialog.vue';
import PopupHeader from '@/popup/components/PopupHeader.vue';
import ProgressOverlay from '@/common/components/ProgressOverlay.vue';
import { Getter, Action, Mutation } from '../../common/utils/VuexDecorators';
import RequestState from '../../common/utils/RequestState';
import TextInput from '@/common/components/TextInput.vue';
import AutocompleteTextInput from '@/common/components/AutocompleteTextInput.vue';
import EpisodeUtils from '../../common/utils/EpisodeUtils';
import Browser from '../../common/utils/Browser';

@Component({
  components: { BasicDialog, PopupHeader, ProgressOverlay, TextInput, AutocompleteTextInput },
})
export default class EditEpisodeDialog extends Vue {
  @Getter() episodeUrl?: Api.EpisodeUrl;
  @Getter() episodeRequestState?: RequestState;
  @Getter() searchShowsResult!: Api.ShowSearchResult[];
  @Getter() searchEpisodesResult!: Api.EpisodeSearchResult[];
  @Getter() tabUrl!: string;

  @Mutation('searchShowsResult') clearShowSearchResults!: () => void;
  @Mutation('searchEpisodesResult') clearSearchEpisodeResults!: () => void;

  @Action() searchShows!: (name: string) => void;
  @Action() searchEpisodes!: (payload: { name: string; showId?: string }) => void;
  @Action() createEpisodeData!: (payload: CreateEpisodeDataPayload) => void;
  @Action() showDialog!: (dialog?: string) => void;

  public selectedShowOption: any = {
    title: '',
  };
  public selectedEpisodeOption: any = {
    title: '',
  };

  public editableSeasonNumber = '';
  public editableEpisodeNumber = '';
  public editableAbsoluteNumber = '';

  public onChangeSelectedShow() {
    this.selectedEpisodeOption = {
      title: '',
    };
    this.$forceUpdate();
    this.onSearchEpisodes('');
    this.onChangeSelectedEpisode(this.selectedEpisodeOption);
  }

  public onChangeSelectedEpisode(currentValue: any) {
    const episode = this.searchEpisodesResult.find(result => result.id === currentValue.id);
    this.editableSeasonNumber = String(episode?.season ?? '');
    this.editableEpisodeNumber = String(episode?.number ?? '');
    this.editableAbsoluteNumber = String(episode?.absoluteNumber ?? '');
  }

  public onShowDialog() {
    if (this.episodeUrl) {
      if (this.episodeUrl?.episode.show) {
        this.selectedShowOption = {
          id: this.episodeUrl.episode.show.id,
          title: this.episodeUrl.episode.show.name,
          subtitle: this.episodeUrl.episode.show.originalName,
        };
      }
      this.selectedEpisodeOption = {
        id: this.episodeUrl.episode.id,
        title: this.episodeUrl.episode.name ?? '',
        subtitle: EpisodeUtils.seasonAndNumberFromEpisodeUrl(this.episodeUrl),
      };
    } else {
      this.selectedShowOption = {
        title: '',
      };
      this.selectedEpisodeOption = {
        title: '',
      };
    }
    this.editableSeasonNumber = String(this.episodeUrl?.episode.season ?? '');
    this.editableEpisodeNumber = String(this.episodeUrl?.episode.number ?? '');
    this.editableAbsoluteNumber = String(this.episodeUrl?.episode.absoluteNumber ?? '');
  }

  public get showSearchListItems() {
    return this.searchShowsResult.map(item => ({
      id: item.id,
      title: item.name,
      subtitle: item.originalName,
    }));
  }

  public get episodeSearchListItems() {
    return this.searchEpisodesResult.map(item => ({
      id: item.id,
      title: item.name || '(No title)',
      subtitle: EpisodeUtils.seasonAndNumberFromSearchResult(item),
    }));
  }

  public get shouldDisableEpisodeNumbers(): boolean {
    return this.selectedEpisodeOption.id != null || !this.selectedEpisodeOption.title;
  }

  public onSearchEpisodes(episodeNameSearch: string): void {
    if (this.selectedShowOption.id == null) {
      this.clearSearchEpisodeResults();
      return;
    }

    this.searchEpisodes({
      showId: this.selectedShowOption.id,
      name: episodeNameSearch,
    });
  }

  public get isLoadingEpisode(): boolean {
    return (
      this.episodeRequestState === RequestState.LOADING ||
      this.episodeRequestState === RequestState.NOT_REQUESTED
    );
  }

  public isShowChanged(): boolean {
    return this.selectedShowOption.title.trim() !== this.episodeUrl?.episode.show?.name;
  }

  public isEpisodeChanged(): boolean {
    const existingEpisode = this.episodeUrl?.episode;
    return (
      this.selectedEpisodeOption.title.trim() !== existingEpisode?.name ||
      this.editableEpisodeNumber.trim() !==
        (existingEpisode?.number ? String(existingEpisode.number) : undefined) ||
      this.editableSeasonNumber.trim() !==
        (existingEpisode?.season ? String(existingEpisode.season) : undefined) ||
      this.editableAbsoluteNumber.trim() !==
        (existingEpisode?.absoluteNumber ? String(existingEpisode.absoluteNumber) : undefined)
    );
  }

  public onClickSaveChanges() {
    // Prepare data
    const episodeName = this.selectedEpisodeOption.title;
    const number = isFinite(Number(this.editableEpisodeNumber))
      ? Number(this.editableEpisodeNumber)
      : undefined;
    const season = isFinite(Number(this.editableSeasonNumber))
      ? Number(this.editableSeasonNumber)
      : undefined;
    const absoluteNumber = isFinite(Number(this.editableAbsoluteNumber))
      ? Number(this.editableAbsoluteNumber)
      : undefined;
    const episodeData: Api.InputEpisode = {
      name: episodeName,
      number,
      season,
      absoluteNumber,
    };

    // Creating Data
    if (this.selectedShowOption.id == null) {
      this.createEpisodeData({
        show: {
          create: true,
          name: this.selectedShowOption.title,
        },
        episode: {
          create: true,
          data: episodeData,
        },
        episodeUrl: {
          create: true,
          data: { url: this.tabUrl },
        },
      });
    }
    if (this.selectedEpisodeOption.id == null) {
      this.createEpisodeData({
        show: {
          create: false,
          showId: this.selectedShowOption.id,
        },
        episode: {
          create: true,
          data: episodeData,
        },
        episodeUrl: {
          create: true,
          data: { url: this.tabUrl },
        },
      });
      return;
    }
    if (
      this.selectedEpisodeOption.id != null &&
      this.selectedShowOption.id != null &&
      this.episodeUrl == null
    ) {
      this.createEpisodeData({
        show: {
          create: false,
          showId: this.selectedShowOption.id,
        },
        episode: {
          create: false,
          episodeId: this.selectedEpisodeOption.id!,
        },
        episodeUrl: {
          create: true,
          data: { url: this.tabUrl },
        },
      });
      return;
    }

    // Change relationships
    if (this.episodeUrl?.episode.show?.id !== this.selectedShowOption.id) {
      console.log('Update episode.showId');
      return;
    }
    if (this.episodeUrl?.episode.id !== this.selectedEpisodeOption.id) {
      console.log('Update episodeUrl.episodeId');
      return;
    }

    // Updating existing data
    if (this.isShowChanged() && this.isEpisodeChanged()) {
      console.log('updated show and episode info');
      return;
    }
    if (this.isShowChanged()) {
      console.log('updated show info');
      return;
    }
    if (this.isEpisodeChanged()) {
      console.log('updated episode info');
      return;
    }

    this.showDialog(undefined);
  }
}
</script>

<style lang="scss">
$width: 450px;
$borderRadius: 3px;

* {
  padding: 0;
  margin: 0;
}

#EditEpisodeDialog {
  .dialog-root-container {
    overflow-y: auto;
    max-height: 70%;
    width: $width;
    overflow-y: visible;

    & > * {
      padding: 14px 16px;
    }
  }

  .section-header {
    margin-top: 0px;
  }

  .edit-section {
    display: flex;
    flex-direction: column;
  }

  .row {
    margin-top: 10px;
  }

  .flex-row {
    display: flex;
    flex-direction: row;
  }

  .flex-1 {
    flex: 1;
  }

  .column-space {
    width: 8px;
  }

  .save {
    margin-top: 18px;
    align-self: flex-end;
  }
}
</style>
