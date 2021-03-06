# threejs-experiment

[![David](https://david-dm.org/RatJuggler/threejs-experiment/dev-status.svg)](https://david-dm.org/RatJuggler/threejs-experiment?type=dev)
[![David](https://david-dm.org/RatJuggler/threejs-experiment/status.svg)](https://david-dm.org/RatJuggler/threejs-experiment)
![GitHub](https://img.shields.io/github/package-json/v/RatJuggler/threejs-experiment)


A project to explore the basics of three.js. See it running [here](https://ratjuggler.github.io/threejs-experiment/).

## Building the experiment

Assuming you already have Node/npm installed.

Checkout the source code from here:
```
$ git clone https://github.com/RatJuggler/threejs-experiment
$ cd threejs-experiment
```
Then install the dependencies:
```
$ npm install
```
Start a development server with:
```
$ npm run start
```
Then view the output at: http://localhost:8080/

To build and preview the code for deployment use:
```
$ npm run preview
```
This will result in a "dist" folder containing all the required files bundled and minified CSS.

## Screenshot

![Screenshot](https://raw.githubusercontent.com/RatJuggler/threejs-experiment/master/screenshot.png)

## Credits

Webpack build based on:

https://github.com/ivarprudnikov/webpack-static-html-pages
