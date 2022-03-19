# webpack5
My webpack5 config

### Installation:
Run "npm i" at the root of the directory

### Usage:
npm run build - to build the final result

npm run start - for development

### Implemented in assembly:
- twig
- babel
- compress png and jpg images
- minify svg \ js \ css
- sass
- fonts
- cleaning all comments in the final assembly
- auto-cleaning the dist directory before the build
- automatic generation of avif \ webp formats from images (by default all images + "?as=..." syntax for sass)
- url path to images from the current sass file (not from style.sass)

### The final build looks like a directory tree:
- css 
  - style.css
- fonts
  - all fonts
- img
  - all images
- js 
  - main.js
- index.html
- ... other .html files

### Feature:
In order for twig to work correctly in watch mode, new pages need to be added in two places
1) webpack.config.js - line 11
2) src\js\main.js - require('../index.twig')

Automatic page refresh in watch mode occurs after clicking on "ctrl+s" in the IDE

### ToDo:
- Remove duplicate images used in sass (now they are generated separately in the "img/insass" directory)