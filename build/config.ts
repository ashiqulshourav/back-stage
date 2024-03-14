const { execSync } = require('child_process');
const { isbuild } = require('yargs').argv;
const shell = require('shelljs');

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
  if (isbuild) {
    console.log('config.ts文件 18==============行打印=', getBranch());
    shell.exec(`rimraf dist && NODE_OPTIONS=--max-old-space-size=8192 vite build --mode ${getBranch()}`);
  } else {
    shell.exec(`vite --mode ${getBranch()}`);
  }
}

init()