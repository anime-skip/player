interface StorageChangeData {
  key: string;
  newValue: any;
  oldValue: any;
}

export class StorageChangedEvent extends CustomEvent<StorageChangeData> {
  static TYPE = '@anime-skip/storage-changed';

  constructor(data: StorageChangeData) {
    super(StorageChangedEvent.TYPE, { detail: data });
  }
}
