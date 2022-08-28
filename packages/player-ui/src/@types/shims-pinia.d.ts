import 'pinia';
import { InternalPlayerConfig } from 'common/src/types';

declare module 'pinia' {
  export interface PiniaCustomProperties {
    config: InternalPlayerConfig;
  }
}
