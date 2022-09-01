// Extend process.env types
namespace NodeJS {
  interface ProcessEnv extends [ImportMeta['env']] {
    BROWSER?: SupportedBrowser;
  }
}

// Custom vite global since import.meta.env is broken (build was hanging):
var vite: {
  env: {
    [key: string]: string | undefined;
    VITE_API_ENV: 'local' | 'test' | 'prod' | undefined;
  };
};
