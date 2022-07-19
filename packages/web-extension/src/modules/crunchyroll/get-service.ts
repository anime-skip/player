export function getService(): 'crunchyroll' | 'crunchyroll-beta' {
  if (window.location.hostname.includes('beta')) {
    return 'crunchyroll-beta';
  }
  return 'crunchyroll';
}
