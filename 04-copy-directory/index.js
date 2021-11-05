const path = require('path');
const fs = require('fs/promises');

const dirPath = path.resolve('./04-copy-directory/files');
const dirPathNew = path.resolve('./04-copy-directory/files-copy');

fs.mkdir(dirPathNew, { recursive: true }).then(() => {
  // Read all entities to copy
  fs.readdir(dirPath, { withFileTypes: true }).then(entities => {
    for (const one of entities) {
      if (one.isFile()) {
        fs.stat(path.resolve(dirPath, one.name)).then(oneStat => {
          const parsed = path.parse(one.name);
          // There should be used 'path.extname(one.name)' according to the task, but I think I found a better solution
          console.log(`${parsed.name} - ${parsed.ext} - ${oneStat.size / 1000}kb`);
        });
      }
    }
  });
});
