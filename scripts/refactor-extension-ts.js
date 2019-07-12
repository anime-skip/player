const fs = require('fs');

const replaceAll = (target, search, replacement) => {
  return target.toString().replace(new RegExp(search, 'g'), replacement);
};
start();

function start() {
  const files = getFiles();
  for (const file of files) {
    refactorFile(file);
  }
}

function getFiles() {
  const root = __dirname + '/../dist';
  const folders = [root];
  const files = [];

  while (folders.length !== 0) {
    const folder = folders.pop();
    const children = fs.readdirSync(folder).map((child) => `${folder}/${child}`);
    for (const child of children) {
      const isFile = fs.lstatSync(child).isFile();
      if (isFile) {
        if ((child.endsWith('.js')
          || child.endsWith('.html')
          || child.endsWith('.css')
          || child.endsWith('.json'))

        ) {
          files.push(child);
        }
      } else {
        folders.push(child);
      }
    }
  }
  return files;
}

function refactorFile(path) {
  const content = fs.readFileSync(path);
  const jsContent = replaceAll(content, /\.ts/, '.js');
  const refactoredContent = replaceAll(
    jsContent,
    'Object.defineProperty(exports, "__esModule", { value: true });',
    ''
  );
  fs.writeFileSync(path, refactoredContent);
}
