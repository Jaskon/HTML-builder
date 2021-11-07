const path = require('path');
const fs = require('fs/promises');
const copyDirectory = require('../04-copy-directory');
const bundleCss = require('../05-merge-styles');


fs.mkdir(path.resolve(__dirname, './project-dist'), { recursive: true }).then(() => {

  copyDirectory(
    path.resolve(__dirname, './assets'),
    path.resolve(__dirname, './project-dist/assets')
  );

  bundleCss(
    path.resolve(__dirname, './styles'),
    path.resolve(__dirname, './project-dist/style.css')
  );

  fs.readFile(path.resolve(__dirname, './template.html')).then(buf => {
    fs.readdir(path.resolve(__dirname, './components'), { withFileTypes: true }).then(entities => {
      const componentNames = entities
        .filter(entity => entity.isFile() && path.extname(entity.name) === '.html')
        .map(entity => path.basename(entity.name, '.html'));

      // Match the '{{...}}' expressions
      const matched = [...buf.toString().matchAll(/{{(.+)}}/g)];
      const promises = matched.reverse().map(one => {
        if (componentNames.includes(one[1])) {
          return fs.readFile(path.resolve(__dirname, `./components/${one[1]}.html`)).then(component => {
            // Write component's content into template
            buf = `${buf.slice(0, one.index)}${component}${buf.slice(one.index + one[0].length)}`;
          });
        }
      });
      Promise.all(promises).then(() => {
        fs.writeFile(path.resolve(__dirname, './project-dist/index.html'), buf);
      });
    });
  });

});
