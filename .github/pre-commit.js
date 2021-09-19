const path = require('path');
const { execSync } = require('child_process');

exports.preCommit = async () => {
  const projectRoot = path.resolve(__dirname, '..');
  execSync('pnpm format', { cwd: projectRoot });
};
