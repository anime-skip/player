import { TextDecoder, TextEncoder } from 'util';
import { afterEach, beforeEach, vi } from 'vitest';

global.TextEncoder = TextEncoder;
// @ts-expect-error bad typing?
global.TextDecoder = TextDecoder;

vi.mock('webextension-polyfill');

const ogDebug = console.debug;
const ogLog = console.log;
const ogInfo = console.info;
const ogWarn = console.warn;
const ogError = console.error;

const noop = () => {};

beforeEach(() => {
  console.debug = noop;
  console.log = noop;
  console.info = noop;
  console.warn = noop;
  console.error = noop;
});

afterEach(() => {
  console.debug = ogDebug;
  console.log = ogLog;
  console.info = ogInfo;
  console.warn = ogWarn;
  console.error = ogError;
});
