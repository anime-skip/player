import { TextDecoder, TextEncoder } from 'util';
import { vi } from 'vitest';

global.TextEncoder = TextEncoder;
// @ts-expect-error bad typing?
global.TextDecoder = TextDecoder;

vi.mock('webextension-polyfill');
