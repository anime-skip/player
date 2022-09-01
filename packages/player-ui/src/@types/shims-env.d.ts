// Custom vite global since import.meta.env is broken (build was hanging):
var vite: {
  env: {
    [key: string]: string | undefined;
    VITE_API_ENV: 'local' | 'test' | 'prod' | undefined;
  };
};
