import { TextEncoder, TextDecoder } from 'util';
global.TextEncoder = TextEncoder;
// @ts-expect-error bad typing?
global.TextDecoder = TextDecoder;
