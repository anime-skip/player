// Extend process.env types
namespace NodeJS {
  interface ProcessEnv extends [ImportMeta['env']] {
    BROWSER?: SupportedBrowser;
  }
}
