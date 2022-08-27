// Extend import.meta.env types
interface ImportMetaEnv {
  readonly VITE_API_ENV: 'prod' | 'test' | 'local' | undefined;
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Extend process.env types
namespace NodeJS {
  interface ProcessEnv extends [ImportMeta['env']] {
    BROWSER?: SupportedBrowser;
  }
}
