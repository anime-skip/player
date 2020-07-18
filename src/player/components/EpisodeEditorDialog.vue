<template>
  <BasicDialog
    name="EpisodeEditorDialog"
    gravityX="center"
    gravityY="center"
    @show="onShowDialog()"
  >
    <ProgressOverlay :isLoading="isLoadingEpisode">
      <PopupHeader :title="headerTitle" />

      <h2 class="section-header">Find Existing Epiosde</h2>
      <AutocompleteTextInput
        class="row"
        label="Find Show"
        v-model="showSearch"
        :isValid="isShowSelected()"
        :isShowingSuggestions="isShowSearchSearchable()"
        @focus="onFocusShowSearch(true)"
        @blur="onFocusShowSearch(false)"
      >
        <div
          v-for="(show, index) in showSearchListItems"
          :key="show.id"
          class="item"
          @mouseup="onClickShowResult(show.id, index)"
        >
          <p class="title">{{ show.title }}</p>
          <p v-if="show.subtitle" class="subtitle">
            {{ show.subtitle }}
          </p>
        </div>
      </AutocompleteTextInput>
      <AutocompleteTextInput
        v-if="isExistingShowSelected()"
        class="row"
        label="Find Episode"
        v-model="episodeSearch"
        :isValid="isEpisodeSelected()"
        :isShowingSuggestions="isEpisodeSearchSearchable()"
        @focus="onFocusEpisodeSearch(true)"
        @blur="onFocusEpisodeSearch(false)"
      >
        <div
          v-for="(epiosde, index) in episodeSearchListItems"
          :key="epiosde.id"
          class="item"
          @mouseup="onClickEpisodeResult(epiosde.id, index)"
        >
          <p class="title">{{ epiosde.title }}</p>
          <p v-if="epiosde.subtitle" class="subtitle">
            {{ epiosde.subtitle }}
          </p>
        </div>
      </AutocompleteTextInput>

      <div class="edit-section" v-if="isShowingEditSection()">
        <h2 class="section-header">Edit Episode Info</h2>
        <p v-if="isTempEditingDisabled || selectedShowId !== 'new-show-id'" class="disabled-label">
          (Editing existing data is not supported yet)
        </p>
        <TextInput
          class="row"
          label="Show Name"
          v-model="editableShowName"
          :disabled="isTempEditingDisabled || selectedShowId !== 'new-show-id'"
        />
        <TextInput
          class="row"
          label="Episode Name"
          v-model="editableEpisodeName"
          :disabled="isTempEditingDisabled"
        />
        <div class="row flex-row">
          <TextInput
            class="flex-1"
            label="Season"
            v-model="editableSeasonNumber"
            :disabled="isTempEditingDisabled"
          />
          <div class="column-space" />
          <TextInput
            class="flex-1"
            label="Episode #"
            v-model="editableEpisodeNumber"
            :disabled="isTempEditingDisabled"
          />
          <div class="column-space" />
          <TextInput
            class="flex-1"
            label="Overall #"
            v-model="editableAbsoluteNumber"
            :disabled="isTempEditingDisabled"
          />
        </div>
        <input
          type="submit"
          value="Save Episode"
          class="clickable focus button save"
          :class="{
            'disabled transparent': isTempEditingDisabled,
          }"
          @click="onClickSaveChanges"
        />
      </div>
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

const CREATE_NEW_SHOW_ID = 'new-show-id';
const CREATE_NEW_SHOW_TITLE = '+ New show';
const CREATE_NEW_EPISODE_ID = 'new-episode-id';
const CREATE_NEW_EPISODE_TITLE = '+ New episode';

interface AutocompleteItem {
  id: string;
  title: string;
  subtitle?: string;
}

@Component({
  components: { BasicDialog, PopupHeader, ProgressOverlay, TextInput, AutocompleteTextInput },
})
export default class EpisodeEditorDialog extends Vue {
  @Getter() episodeUrl?: Api.EpisodeUrl;
  @Getter() episodeRequestState?: RequestState;
  @Getter() searchShowsResult!: Api.ShowSearchResult[];
  @Getter() searchEpisodesResult!: Api.EpisodeSearchResult[];

  @Mutation('searchShowsResult') clearShowSearchResults!: () => void;
  @Mutation('searchEpisodesResult') clearEpisodeSearchResults!: () => void;

  @Action() searchShows!: (name: string) => void;
  @Action() searchEpisodes!: (payload: { name: string; showId?: string }) => void;
  @Action() createEpisodeData!: (payload: CreateEpisodeDataPayload) => void;
  @Action() showDialog!: (dialog?: string) => void;

  public showSearch: string = '';
  public showSearchTimeout: any = undefined;
  public selectedShowId: string | undefined = undefined;

  public episodeSearch: string = '';
  public episodeSearchTimeout: any = undefined;
  public selectedEpisodeId: string | undefined = undefined;

  public editableShowName = '';
  public editableEpisodeName = '';
  public editableSeasonNumber = '';
  public editableEpisodeNumber = '';
  public editableAbsoluteNumber = '';

  public onShowDialog() {
    const episodeUrl = this.episodeUrl;
    this.showSearch = episodeUrl?.episode.show?.name ?? '';
    this.selectedShowId = episodeUrl?.episode.show?.id;
    this.episodeSearch = episodeUrl?.episode.name ?? '';
    this.selectedEpisodeId = episodeUrl?.episode.id;
    this.editableShowName = this.showSearch;
    this.editableEpisodeName = this.episodeSearch;
    this.editableSeasonNumber = String(episodeUrl?.episode.season ?? '');
    this.editableEpisodeNumber = String(episodeUrl?.episode.number ?? '');
    this.editableAbsoluteNumber = String(episodeUrl?.episode.absoluteNumber ?? '');
  }

  public get headerTitle() {
    if (this.isLoadingEpisode) {
      return 'Episode';
    }
    if (
      this.selectedEpisodeId == CREATE_NEW_EPISODE_ID ||
      this.selectedEpisodeId == CREATE_NEW_SHOW_ID
    ) {
      return 'Create Episode';
    }
    return `Edit Episode`;
  }

  public get isTempEditingDisabled(): boolean {
    return (
      this.selectedShowId !== CREATE_NEW_SHOW_ID && this.selectedEpisodeId !== CREATE_NEW_EPISODE_ID
    );
  }

  public get showSearchListItems(): AutocompleteItem[] {
    return [
      ...this.searchShowsResult.map(item => ({
        id: item.id,
        title: item.name,
        subtitle: item.originalName,
      })),
      {
        id: CREATE_NEW_SHOW_ID,
        title: CREATE_NEW_SHOW_TITLE,
      },
    ];
  }

  public get episodeSearchListItems(): AutocompleteItem[] {
    return [
      ...this.searchEpisodesResult.map(item => ({
        id: item.id,
        title: item.name || '(No title)',
        subtitle: EpisodeUtils.seasonAndNumberFromSearchResult(item),
      })),
      {
        id: CREATE_NEW_EPISODE_ID,
        title: CREATE_NEW_EPISODE_TITLE,
      },
    ];
  }

  @Watch('showSearch')
  public onChangeShowSearch(showSearch: string) {
    if (this.showSearchTimeout) {
      clearTimeout(this.showSearchTimeout);
    }
    if (this.isShowSearchSearchable()) {
      this.showSearchTimeout = setTimeout(() => {
        this.searchShows(this.showSearch.trim());
      }, 500);
    }
  }

  public onFocusShowSearch(isFocused: boolean) {
    if (isFocused && this.selectedShowId === CREATE_NEW_SHOW_ID) {
      this.showSearch = '';
      this.selectedShowId = undefined;
    }
    if (!isFocused) {
      const selectedShowId = this.showSearchListItems.find(item => item.title === this.showSearch)
        ?.id;
      if (selectedShowId !== this.selectedShowId) {
        this.selectedShowId = selectedShowId;
        this.episodeSearch = '';
        this.selectedEpisodeId = undefined;
      }
    }
  }

  @Watch('episodeSearch')
  public onChangeEpisodeSearch(episodeSearch: string) {
    if (this.episodeSearchTimeout) {
      clearTimeout(this.episodeSearchTimeout);
    }
    if (this.isEpisodeSearchSearchable()) {
      this.episodeSearchTimeout = setTimeout(() => {
        this.searchEpisodes({ name: this.episodeSearch.trim(), showId: this.selectedShowId });
      }, 500);
    }
  }

  public onFocusEpisodeSearch(isFocused: boolean) {
    if (isFocused && this.episodeSearch === CREATE_NEW_EPISODE_TITLE) {
      this.episodeSearch = '';
      this.selectedEpisodeId = undefined;
    }
    if (!isFocused) {
      const episode = this.episodeSearchListItems.find(item => item.title === this.episodeSearch);
      this.selectedEpisodeId = episode?.id;
    }
  }

  public isExistingShowSelected(): boolean {
    return this.isShowSelected() && !this.isCreatingNewShow();
  }
  public isShowSelected(): boolean {
    return this.selectedShowId != null;
  }
  public isCreatingNewShow(): boolean {
    return this.selectedShowId === CREATE_NEW_SHOW_ID;
  }
  public isShowSearchSearchable(): boolean {
    return true; //this.showSearch.trim().length ;
  }

  public isEpisodeSearchValid(): boolean {
    return true; //!!this.episodeSearch;
  }
  public isEpisodeSelected(): boolean {
    return this.selectedEpisodeId != null;
  }
  public isCreatingNewEpisode(): boolean {
    return this.selectedEpisodeId === CREATE_NEW_EPISODE_ID;
  }
  public isEpisodeSearchSearchable(): boolean {
    return true; // this.episodeSearch.trim().length > 1;
  }

  public isShowingEditSection(): boolean {
    return this.isCreatingNewShow() || (this.isShowSelected() && this.isEpisodeSelected());
  }

  public get isLoadingEpisode(): boolean {
    const requestState = this.episodeRequestState;
    return requestState === RequestState.LOADING || requestState === RequestState.NOT_REQUESTED;
  }

  public onClickShowResult(id: string, index: number) {
    const item = this.showSearchListItems[index];
    this.selectedShowId = id;
    this.showSearch = item.title;
    if (id !== CREATE_NEW_SHOW_ID) {
      this.editableShowName = item.title;
    }
    (document.activeElement as any).blur();
  }

  public onClickEpisodeResult(id: string, index: number) {
    const item = this.episodeSearchListItems[index];
    const fullItem = this.searchEpisodesResult.find(i => i.id === item?.id);
    this.selectedEpisodeId = id;
    this.episodeSearch = item.title;
    if (fullItem) {
      this.editableEpisodeName = fullItem.name ?? '';
      this.editableEpisodeNumber = String(fullItem.number ?? '');
      this.editableSeasonNumber = String(fullItem.season ?? '');
      this.editableAbsoluteNumber = String(fullItem.absoluteNumber ?? '');
    }
    (document.activeElement as any).blur();
  }

  public isShowChanged(): boolean {
    return this.editableShowName.trim() !== this.episodeUrl?.episode.show?.name;
  }

  public isEpisodeChanged(): boolean {
    const existingEpisode = this.episodeUrl?.episode;
    return (
      this.editableEpisodeName.trim() !== existingEpisode?.name ||
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
    const episodeName = this.editableEpisodeName;
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
    if (this.selectedShowId === CREATE_NEW_SHOW_ID) {
      this.createEpisodeData({
        show: {
          create: true,
          name: this.editableShowName,
        },
        episode: {
          create: true,
          data: episodeData,
        },
        episodeUrl: {
          create: true,
          data: { url: Browser.getURL() },
        },
      });
    }
    if (this.selectedEpisodeId === CREATE_NEW_EPISODE_ID) {
      this.createEpisodeData({
        show: {
          create: false,
          showId: this.selectedShowId!,
        },
        episode: {
          create: true,
          data: episodeData,
        },
        episodeUrl: {
          create: true,
          data: { url: Browser.getURL() },
        },
      });
      return;
    }
    if (
      this.selectedEpisodeId !== CREATE_NEW_EPISODE_ID &&
      this.selectedShowId !== CREATE_NEW_SHOW_ID &&
      this.episodeUrl == null
    ) {
      this.createEpisodeData({
        show: {
          create: false,
          showId: this.selectedShowId!,
        },
        episode: {
          create: false,
          episodeId: this.selectedEpisodeId!,
        },
        episodeUrl: {
          create: true,
          data: { url: Browser.getURL() },
        },
      });
      return;
    }

    // Change relationships
    if (this.episodeUrl?.episode?.show?.id !== this.selectedShowId) {
      console.log('Update episode.showId');
      return;
    }
    if (this.episodeUrl?.episode.id !== this.selectedEpisodeId) {
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

#EpisodeEditorDialog {
  margin-bottom: $toolbarHeight + 4px + 8px;

  .dialog-root-container {
    overflow-y: visible;
    width: $width;
    & > * {
      padding: 14px 16px;
    }
  }

  .section-header {
    margin-top: 24px;
  }

  .item {
    height: 48px;
    border-top: 1px solid $divider;
    padding: 0 16px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    cursor: pointer;
    transition: 200ms;

    &:hover {
      background-color: $divider;
      border-top-color: transparent;
    }

    .title {
      padding-top: 2px;
      font-size: 15px;
      color: $textPrimary;
    }

    .subtitle {
      color: $textSecondary;
      margin-top: -1px;
      font-size: 13px;
    }
  }

  .edit-section {
    display: flex;
    flex-direction: column;

    .disabled-label {
      margin-top: 8px;
      font-size: 14px;
      color: rgba($color: #ff7777, $alpha: 0.7);
    }
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
