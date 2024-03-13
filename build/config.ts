const shell = require('shelljs');
const { execSync } = require('child_process');
const getBranch = () => {
  try {
    const command = 'git rev-parse --abbrev-ref HEAD';
    const branch = execSync(command).toString().trim();
    return branch;
  } catch (e) {
    console.log('248行打印：============:', e);
    return '';
  }
}

const init = () => {
  console.log('build.js文件 13==============行打印=', getBranch());
  // shell.exec('rimraf dist && NODE_OPTIONS=--max-old-space-size=8192 vite build --mode dev');
  shell.exec('rimraf dist && NODE_OPTIONS=--max-old-space-size=8192 vite build --mode production');
}

init()