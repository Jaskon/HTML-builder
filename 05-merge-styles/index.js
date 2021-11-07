const path = require('path');
const fs = require('fs');
const fsPromises = require('fs/promises');


function bundleCss(sourcesPath, destFilePath) {
  const destFileStream = fs.createWriteStream(destFilePath);
  // Wait these before closing the write stream
  const promisesToWait = [];

  fsPromises.readdir(sourcesPath, {withFileTypes: true}).then(entities => {
    for (const one of entities) {
      if (one.isFile() && path.extname(one.name) === '.css') {
        promisesToWait.push(
          fsPromises.readFile(path.resolve(sourcesPath, one.name)).then(buf => {
            destFileStream.write(buf);
            destFileStream.write('\n');
          })
        );
      }
    }
  }).finally(() => {
    Promise.all(promisesToWait).then(() => {
      destFileStream.close();
    });
  });
}


bundleCss(
  path.resolve(__dirname, './styles'),
  path.resolve(__dirname, './project-dist/bundle.css')
);


module.exports = bundleCss;
