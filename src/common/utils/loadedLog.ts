export function loadedLog(file: string): void {
  console.log(
    `%c◈ %cLoaded %c${file}`,
    'color: #a27bde; font-weight: bold', // Purple 300
    'color: inherit; font-weight: regular',
    'color: #009de5; font-weight: bold' // Blue 600
  );
}
