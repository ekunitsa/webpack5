// only for develop. Needed for twig watcher:
if (process.env.NODE_ENV === 'development') {
    require('../index.twig');
    require('../index2.twig');
}

// Utils
import './utils/avif-webp';

// Plugins
import slick from 'slick-carousel';  // eslint-disable-line

// global style file
import '../scss/style.scss';

// other scripts
import './components/common';
