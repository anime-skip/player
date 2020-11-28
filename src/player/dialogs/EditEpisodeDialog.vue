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
        :disabled="shouldDisableEpisode"
        @select="onChangeSelectedEpisode"
        @search="onSearchEpisodes"
      />
      <div class="row flex-row">
        <TextInput
          class="flex-1"
          label="Season"
          v-model="editableSeasonNumber"
          :disabled="shouldDisableEpisodeNumbers"
          @submit="onClickSaveChanges"
        />
        <div class="column-space" />
        <TextInput
          class="flex-1"
          label="Episode #"
          v-model="editableEpisodeNumber"
          :disabled="shouldDisableEpisodeNumbers"
          @submit="onClickSaveChanges"
        />
        <div class="column-space" />
        <TextInput
          class="flex-1"
          label="Overall #"
          v-model="editableAbsoluteNumber"
          :disabled="shouldDisableEpisodeNumbers"
          @submit="onClickSaveChanges"
        />
      </div>
      <div class="button-row">
        <button
          class="clickable focus button"
          :class="{ disabled: !isSubmitEnabled }"
          :disabled="!isSubmitEnabled"
          @click="onClickSaveChanges"
        >
          Save Episode
        </button>
        <button class="clickable dark focus button" @click="showDialog(undefined)">Cancel</button>
      </div>
    </ProgressOverlay>
  </BasicDialog>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import BasicDialog from './BasicDialog.vue';
import PopupHeader from '@/popup/components/PopupHeader.vue';
import ProgressOverlay from '@/common/components/ProgressOverlay.vue';
import { Getter, Action, Mutation } from '../../common/utils/VuexDecorators';
import RequestState from '../../common/utils/RequestState';
import TextInput from '@/common/components/TextInput.vue';
import AutocompleteTextInput from '@/common/components/AutocompleteTextInput.vue';
import EpisodeUtils from '../../common/utils/EpisodeUtils';
import Utils from '@/common/utils/Utils';

function mapShowToAutocompleteItem(show: Api.Show): AutocompleteItem<Api.Show> {
  return {
    id: show.id,
    title: show.name,
    subtitle: show.originalName,
    data: show,
  };
}

function mapEpisodeToAutocompleteItem(
  episode: Api.EpisodeSearchResult
): AutocompleteItem<Api.EpisodeSearchResult> {
  return {
    id: episode.id,
    title: episode.name || '(No title)',
    subtitle: EpisodeUtils.seasonAndNumberDisplay(episode),
    data: episode,
  };
}

@Component({
  components: { BasicDialog, PopupHeader, ProgressOverlay, TextInput, AutocompleteTextInput },
})
export default class EditEpisodeDialog extends Vue {
  @Getter() episodeUrl?: Api.EpisodeUrl;
  @Getter() inferredEpisodeInfo?: DisplayEpisodeInfo;
  @Getter() episodeRequestState?: RequestState;
  @Getter() searchShowsResult!: Api.ShowSearchResult[];
  @Getter() searchEpisodesResult!: Api.EpisodeSearchResult[];
  @Getter() tabUrl!: string;
  @Getter() canEditTimestamps!: boolean;

  @Mutation('searchShowsResult') clearShowSearchResults!: () => void;
  @Mutation('searchEpisodesResult') clearSearchEpisodeResults!: () => void;

  @Action() searchShows!: (name: string) => void;
  @Action() searchEpisodes!: (payload: { name: string; showId?: string }) => void;
  @Action() createEpisodeData!: (payload: CreateEpisodeDataPayload) => void;
  @Action() showDialog!: (dialog?: string) => void;
  @Action() stopEditing!: (discard: boolean) => void;

  public selectedShowOption: AutocompleteItem<Api.ShowSearchResult> = {
    title: '',
  };
  public selectedEpisodeOption: AutocompleteItem<Api.EpisodeSearchResult> = {
    title: '',
  };

  public editableSeasonNumber = '';
  public editableEpisodeNumber = '';
  public editableAbsoluteNumber = '';
  public fetchingIds = RequestState.NOT_REQUESTED;

  public onChangeSelectedShow() {
    this.selectedEpisodeOption = {
      title: '',
    };
    this.$forceUpdate();
    this.onSearchEpisodes('');
    this.onChangeSelectedEpisode(this.selectedEpisodeOption);
  }

  public onChangeSelectedEpisode(currentValue: AutocompleteItem) {
    const episode = this.searchEpisodesResult.find(result => result.id === currentValue.id);
    this.editableSeasonNumber = String(episode?.season ?? '');
    this.editableEpisodeNumber = String(episode?.number ?? '');
    this.editableAbsoluteNumber = String(episode?.absoluteNumber ?? '');
  }

  public onShowDialog() {
    const episodeUrl = this.episodeUrl;
    if (episodeUrl) {
      if (episodeUrl?.episode.show) {
        this.selectedShowOption = mapShowToAutocompleteItem(episodeUrl.episode.show);
      }
      this.selectedEpisodeOption = mapEpisodeToAutocompleteItem(episodeUrl.episode);
    } else if (this.inferredEpisodeInfo) {
      // Show loading and fetch the show & episode
      this.fetchingIds = RequestState.LOADING;
      this.fetchInferredData();
    } else {
      this.selectedShowOption = {
        title: '',
      };
      this.selectedEpisodeOption = {
        title: '',
      };
    }
    this.editableSeasonNumber = String(episodeUrl?.episode.season ?? '');
    this.editableEpisodeNumber = String(episodeUrl?.episode.number ?? '');
    this.editableAbsoluteNumber = String(episodeUrl?.episode.absoluteNumber ?? '');
  }

  public get showSearchListItems(): AutocompleteItem<Api.ShowSearchResult>[] {
    return this.searchShowsResult.map(mapShowToAutocompleteItem);
  }

  public get episodeSearchListItems(): AutocompleteItem<Api.EpisodeSearchResult>[] {
    return this.searchEpisodesResult.map(mapEpisodeToAutocompleteItem);
  }

  public get shouldDisableEpisode(): boolean {
    return this.selectedShowOption.id == null && !this.selectedShowOption.title;
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

  public async fetchInferredData(): Promise<void> {
    try {
      const possibleShows = await global.Api.searchShows(this.inferredEpisodeInfo!.show);
      const matchingShows = possibleShows.filter(
        show => show.name === this.inferredEpisodeInfo!.show
      );
      if (matchingShows.length === 0) throw new Error('No matching shows');
      const firstShow = matchingShows.shift()!;
      this.selectedShowOption = mapShowToAutocompleteItem(firstShow);
      // this.otherShowOptions = matchingShows;

      try {
        const possibleEpisodes = await global.Api.searchEpisodes(this.inferredEpisodeInfo!.name);
        const matchingEpisodes = possibleEpisodes.filter(
          episode => episode.name === this.inferredEpisodeInfo!.name
        );
        if (matchingEpisodes.length === 0) throw new Error('No matching episodes');
        const firstEpisode = matchingEpisodes.shift()!;
        this.selectedEpisodeOption = mapEpisodeToAutocompleteItem(firstEpisode);
        // this.otherEpisodeOptions = matchingEpisodes;
      } catch (err) {
        this.selectedEpisodeOption = {
          title: this.inferredEpisodeInfo!.name,
        };
      }

      // Couldn't fetch show
    } catch (err) {
      this.selectedShowOption = {
        title: this.inferredEpisodeInfo!.show,
      };
      this.selectedEpisodeOption = {
        title: this.inferredEpisodeInfo!.name,
      };
    } finally {
      this.editableSeasonNumber = this.inferredEpisodeInfo!.season ?? '';
      this.editableEpisodeNumber = this.inferredEpisodeInfo!.number ?? '';
      this.editableAbsoluteNumber = this.inferredEpisodeInfo!.absoluteNumber ?? '';
    }
    this.fetchingIds = RequestState.SUCCESS;
  }

  public get isLoadingEpisode(): boolean {
    return (
      this.episodeRequestState === RequestState.LOADING || this.fetchingIds === RequestState.LOADING
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

  public get isSubmitEnabled(): boolean {
    // prettier-ignore
    return !!(
      (
        // An existing show and episode are selected
        (this.selectedShowOption.id && this.selectedEpisodeOption.id) ||
        // An existing show but new episode is entered
        (this.selectedShowOption.id && this.selectedEpisodeOption.title) ||
        // A new show and new episode are entered
        (this.selectedShowOption.title && this.selectedEpisodeOption.title)
      )
    );
  }

  public onClickSaveChanges() {
    // Prepare data
    const episodeName = this.selectedEpisodeOption.title;
    const number = this.editableEpisodeNumber.trim() || undefined;
    const absoluteNumber = this.editableAbsoluteNumber.trim() || undefined;
    const season = this.editableSeasonNumber.trim() || undefined;
    const duration = global.getVideo()?.duration;
    const baseDuration = this.selectedEpisodeOption?.data?.baseDuration;
    let timestampsOffset: number | undefined;
    if (baseDuration != null) {
      timestampsOffset = Utils.computeTimestampsOffset(baseDuration, duration);
    }

    const episodeData: Api.InputEpisode = {
      name: episodeName,
      number,
      season,
      absoluteNumber,
      baseDuration,
    };
    const episodeUrlData: Api.InputEpisodeUrl = {
      url: this.tabUrl,
      duration: duration,
      timestampsOffset,
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
          data: episodeUrlData,
        },
      });
      return;
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
          data: episodeUrlData,
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
          data: episodeUrlData,
        },
      });
      return;
    }

    // Change relationships
    if (this.episodeUrl?.episode.show?.id !== this.selectedShowOption.id) {
      console.info('Update episode.showId');
      return;
    }
    if (this.episodeUrl?.episode.id !== this.selectedEpisodeOption.id) {
      console.info('Update episodeUrl.episodeId');
      return;
    }

    // Updating existing data
    if (this.isShowChanged() && this.isEpisodeChanged()) {
      console.info('updated show and episode info');
      return;
    }
    if (this.isShowChanged()) {
      console.info('updated show info');
      return;
    }
    if (this.isEpisodeChanged()) {
      console.info('updated episode info');
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

  .button-row {
    display: flex;
    flex-direction: row-reverse;
    justify-content: space-between;
    margin-top: 24px;
  }
}
</style>
