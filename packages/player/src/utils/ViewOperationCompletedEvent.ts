import { View } from '../composables/useView';

export class ViewOperationCompletedEvent extends CustomEvent<string> {
  static TYPE = '@anime-skip/view-operation-completed';

  constructor(view: View) {
    super(ViewOperationCompletedEvent.TYPE, { detail: view });
  }

  /**
   * The view the operation was completed for.
   */
  get view(): string {
    return this.detail;
  }
}
