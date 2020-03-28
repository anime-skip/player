<template>
  <BasicDialog name="EpisodeEditorDialog" gravityX="center" gravityY="center">
    <ProgressOverlay :isLoading="isLoadingEpisode">
      <PopupHeader :title="headerTitle" />

      <h2 class="section-header">Find Existing Epiosde</h2>
      <AutocompleteTextInput
        class="row"
        label="Find Show"
        v-model="showSearch"
        :isValid="isShowSelected()"
        :isShowingSuggestions="isShowSearchSearchable()"
        @focus="onFocusShowSearch"
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
        @focus="onFocusEpisodeSearch"
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
        <TextInput class="row" label="Show Name" v-model="editableShowName" />
        <TextInput class="row" label="Episode Name" v-model="editableEpisodeName" />
        <div class="row flex-row">
          <TextInput class="flex-1" label="Season" v-model="editableSeasonNumber" />
          <div class="column-space" />
          <TextInput class="flex-1" label="Episode #" v-model="editableEpisodeNumber" />
          <div class="column-space" />
          <TextInput class="flex-1" label="Overall #" v-model="editableAbsoluteNumber" />
        </div>
        <input
          type="submit"
          value="Save Changes"
          class="clickable focus button save"
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
  @Action() searchEpisodes!: (name: string) => void;

  public showSearch = '';
  public showSearchTimeout: any = undefined;
  public selectedShowId: string | undefined = undefined;

  public episodeSearch = '';
  public episodeSearchTimeout: any = undefined;
  public selectedEpisodeId: string | undefined = undefined;

  public editableShowName = '';
  public editableEpisodeName = '';
  public editableSeasonNumber = '';
  public editableEpisodeNumber = '';
  public editableAbsoluteNumber = '';

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
  public onChangeShowSearch(showSearch: any) {
    this.showSearch = showSearch;
    this.selectedShowId = this.showSearchListItems.find(item => item.title === showSearch)?.id;
    this.episodeSearch = '';
    this.selectedEpisodeId = undefined;

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
    if (this.showSearch === CREATE_NEW_SHOW_TITLE) {
      this.showSearch = '';
      this.selectedShowId = undefined;
    }
  }

  @Watch('episodeSearch')
  public onChangeEpisodeSearch(episodeSearch: string) {
    this.episodeSearch = episodeSearch;
    const episode = this.episodeSearchListItems.find(item => item.title === episodeSearch);
    const fullEpisode = this.searchEpisodesResult.find(item => item.id === episode?.id);
    this.selectedEpisodeId = fullEpisode?.id;

    if (this.episodeSearchTimeout) {
      clearTimeout(this.episodeSearchTimeout);
    }
    if (this.isEpisodeSearchSearchable()) {
      this.episodeSearchTimeout = setTimeout(() => {
        this.searchEpisodes(this.episodeSearch.trim());
      }, 500);
    }
  }

  public onFocusEpisodeSearch(isFocused: boolean) {
    if (this.episodeSearch === CREATE_NEW_EPISODE_TITLE) {
      this.episodeSearch = '';
      this.selectedEpisodeId = undefined;
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
    return this.showSearch.trim().length > 2;
  }

  public isEpisodeSearchValid(): boolean {
    return !!this.episodeSearch;
  }
  public isEpisodeSelected(): boolean {
    return this.selectedEpisodeId != null;
  }
  public isCreatingNewEpisode(): boolean {
    return this.selectedEpisodeId === CREATE_NEW_EPISODE_ID;
  }
  public isEpisodeSearchSearchable(): boolean {
    return this.episodeSearch.trim().length > 1;
  }

  public isShowingEditSection(): boolean {
    return this.isCreatingNewShow() || (this.isShowSelected() && this.isEpisodeSelected());
  }

  public get isLoadingEpisode(): boolean {
    const requestState = this.episodeRequestState;
    return requestState === RequestState.LOADING || requestState === RequestState.NOT_REQUESTED;
  }

  public onClickShowResult(id: string, index: number) {
    (document.activeElement as any).blur();
    const item = this.showSearchListItems[index];
    this.selectedShowId = id;
    this.showSearch = item.title;
    if (id !== CREATE_NEW_SHOW_ID) {
      this.editableShowName = item.title;
    }
  }

  public onClickEpisodeResult(id: string, index: number) {
    (document.activeElement as any).blur();
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
  }

  public onClickSaveChanges() {
    console.log('Saved changes', this);
  }
}
</script>

<style lang="scss">
$width: 450px;
$borderRadius: 3px;

#EpisodeEditorDialog {
  padding-bottom: $toolbarHeight + 4px + 8px;

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
