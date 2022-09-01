/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_ENV: 'prod' | 'test' | 'local' | undefined;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
