const fs = require('fs');
const path = require('path');
const {exec} = require('child_process');

const targetDir = path.join(__dirname, 'generated-api');

function emptyDirectory(directory) {
  if (fs.existsSync(directory)) {
    fs.readdirSync(directory).forEach(file => {
      const curPath = path.join(directory, file);
      if (fs.lstatSync(curPath).isDirectory()) {
        emptyDirectory(curPath);
        fs.rmdirSync(curPath);
      } else {
        fs.unlinkSync(curPath);
      }
    });
  }
}

function cleanDirectoryExceptModelAndApi(directory) {
  fs.readdir(directory, (err, files) => {
    if (err) throw err;

    for (const file of files) {
      if (file !== 'model' && file !== 'api') {
        const curPath = path.join(directory, file);
        fs.stat(curPath, (err, stats) => {
          if (err) throw err;

          if (stats.isDirectory()) {
            emptyDirectory(curPath);
            fs.rmdirSync(curPath);
          } else {
            fs.unlinkSync(curPath);
          }
        });
      }
    }
  });
}

emptyDirectory(targetDir);

const openApiGeneratorCommand = 'openapi-generator-cli generate';

exec(openApiGeneratorCommand, (err, stdout, stderr) => {
  if (err) {
    console.error(`exec error: ${err}`);
    return;
  }
  console.log(stdout);

  //cleanDirectoryExceptModelAndApi(targetDir);
});
