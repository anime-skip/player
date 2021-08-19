import { PluginOption } from 'vite';

export class ParallelizeController {
  private initialized = false;
  private instanceCount = 0;
  private instancesFirstBuildCompleted: boolean[] = [];

  private completedOncePromises: Promise<void>[] = [];
  private beforeAllPromise?: Promise<void>;

  constructor(
    readonly config?: {
      beforeAll?(): Promise<void>;
      afterFirstBuild?(): Promise<void>;
      afterEachWatchUpdate?(): Promise<void>;
    }
  ) {}

  private init() {
    if (this.initialized) return;
    this.initialized = true;
    Promise.all(this.completedOncePromises).then(() => this.afterFirstBuild());
  }

  private async beforeAll() {
    console.info('[life] beforeAll');
    await this.config?.beforeAll?.();
  }

  private async afterFirstBuild() {
    console.info('[life] afterFirstBuild');
    await this.config?.afterFirstBuild?.();
  }

  private async afterEachWatchUpdate() {
    console.info('[life] afterEachWatchUpdate');
    await this.config?.afterEachWatchUpdate?.();
  }

  async plugin(): Promise<PluginOption> {
    const index = this.instanceCount;
    this.instanceCount++;

    // afterFirstBuild
    let completedOnceRes: () => void;
    this.completedOncePromises.push(
      new Promise<void>(res => {
        completedOnceRes = res;
      })
    );

    this.init();

    return {
      name: 'parallelize',
      buildStart: async () => {
        if (this.beforeAllPromise == null) {
          let beforeAllRes: () => void;
          let beforeAllRej: (err: Error) => void;
          this.beforeAllPromise = new Promise<void>((res, rej) => {
            beforeAllRes = res;
            beforeAllRej = rej;
          });
          try {
            await this.beforeAll();
            beforeAllRes!();
          } catch (err) {
            beforeAllRej!(err);
          }
        } else {
          await this.beforeAllPromise;
        }
      },
      closeBundle: async () => {
        // afterFirstBuild
        completedOnceRes();

        // afterEachWatchUpdate
        if (this.instancesFirstBuildCompleted[index]) await this.afterEachWatchUpdate();
        else this.instancesFirstBuildCompleted[index] = true;
      },
    };
  }
}
