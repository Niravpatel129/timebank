require('dotenv').config();
const { exec } = require('child_process');

console.log('Starting HourBlock Windows build process...');

function runCommand(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${error.message}`);
        return reject(error);
      }
      if (stderr) {
        console.error(`Stderr: ${stderr}`);
      }
      console.log(stdout);
      resolve();
    });
  });
}

async function build() {
  try {
    await runCommand('npm run prebuild');
    await runCommand('npx webpack --config webpack.config.js');
    await runCommand('electron-builder --win --publish always');
    console.log('HourBlock Windows build completed successfully');
  } catch (error) {
    console.error('Build process failed');
    process.exit(1);
  }
}

build();