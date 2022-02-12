// only for develop
// need for twig watcher:
if (process.env.NODE_ENV == 'development') {
  require('../index.twig');
  require('../index2.twig');
}

// scrips to prod
// global style file
import '../sass/style.sass'

// other scripts
import './test/test'

// global js
console.log('test main.js')