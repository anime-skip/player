type Service = 'test-service' | 'vrv' | 'funimation' | 'funimation-2021-09-26' | 'crunchyroll';

type ReportableService = Service | 'crunchyroll-beta';

type ServiceDisplayName = 'Anime Skip Test' | 'VRV' | 'Funimation' | 'Crunchyroll' | undefined;

type SupportedBrowser = 'firefox' | 'chrome';

type ExtensionMode = 'dev' | 'test' | 'staged' | 'beta' | 'prod';
