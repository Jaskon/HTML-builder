const path = require('path');
const fs = require('fs/promises');

function copyEntitiesRecursively(from, to) {
  // Read all entities to copy
  fs.readdir(from, { withFileTypes: true }).then(entities => {
    for (const one of entities) {
      const fromPath = path.resolve(from, one.name);
      const toPath = path.resolve(to, one.name);

      // Copy files
      if (one.isFile()) {
        fs.copyFile(fromPath, toPath).then(() => {
          console.log(`Copied '${one.name}' -> '${toPath}'`);
        });
      }
      // Copy directories recursively
      if (one.isDirectory()) {
        fs.mkdir(toPath, { recursive: true }).then(() => {
          copyEntitiesRecursively(fromPath, toPath);
        });
      }
    }

    // Remove unwanted files (in case folder existed before)
    fs.readdir(to, { withFileTypes: true }).then(newDirEntities => {
      for (const one of newDirEntities) {
        if (one.isFile() && !entities.map(ent => ent.name).includes(one.name)) {
          fs.rm(path.resolve(to, one.name)).then(() => {
            console.log(`Deleted '${one.name}' <- '${from}'`);
          });
        }
      }
    });
  });
}

function copyDirectory(from, to) {
  fs.mkdir(to, {recursive: true}).then(() => {
    copyEntitiesRecursively(from, to);
  });
}


copyDirectory(
  path.resolve(__dirname, './files'),
  path.resolve(__dirname, './files-copy')
);


module.exports = copyDirectory;
