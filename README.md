# webpack5

My webpack5 config

> [!NOTE]
> 05.08.2025: LEGACY | This Webpack config was built when version 5 was ONLY released. Over time, it was slightly corrected\modernized, but no more than that. I highly recommend **NOT** to use it now in production projects, here it is rather for history :)

### Installation:

A suitable version of node.js - 20.9.0

Run "npm i" at the root of the project

### Usage:

npm run build - to build the final result

npm run watch - for development

### Implemented in assembly:

-   Twig;
-   JQuery;
-   Babel;
-   Compress PNG and JPG images;
-   Minify SVG \ JS \ CSS;
-   SCSS or SASS;
-   Fonts;
-   Cleaning all comments in the final assembly;
-   Auto-cleaning the dist directory before the build;
-   Automatic generation of AVIF \ WEBP formats from images (by default all images + "?as=..." syntax for SCSS);
-   Url path to images from the current SCSS file (not from style.scss) after @import;
-   SVG sprites generation (settings.sprite.active: true | false in webpack.config.js);
-   ESlint and stylelint (SCSS);
-   Prettier;
-   Pre-commit with ESlint and stylelint.

### The final build looks like a directory tree:

-   css
    -   style.css
-   fonts
    -   all fonts
-   img
    -   all images
    -   sprite.svg
-   js
    -   main.js
-   index.html
-   ... other .html files

### Feature:

In order for twig to work correctly in watch mode, new pages need to be added in two places

1. webpack.config.js - line 11
2. src\js\main.js - require('../index.twig')

Automatic page refresh in watch mode occurs after clicking on "ctrl+s" keys in the IDE

### ToDo:

-   Remove duplicate images used in scss (now they are generated separately in the "img/inscss" directory)
