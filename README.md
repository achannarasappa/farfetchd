# farfetched
[![Build Status](https://travis-ci.org/achannarasappa/farfetchd.svg?branch=master)](https://travis-ci.org/achannarasappa/farfetchd) [![Coverage Status](https://coveralls.io/repos/github/achannarasappa/farfetchd/badge.svg?branch=master)](https://coveralls.io/github/achannarasappa/farfetchd?branch=master) [![dependencies](https://david-dm.org/achannarasappa/farfetchd.svg)](https://david-dm.org/achannarasappa/farfetchd.svg) [![npm version](https://badge.fury.io/js/farfetchd.svg)](https://badge.fury.io/js/farfetchd)

Isomorphic implementation of the [Fetch standard](https://fetch.spec.whatwg.org/).

* Does not modify global with `fetch`
* Consistent API across client and server

## Installation
#### NPM
`npm install farfetched --save`
#### CDN
`<script src="https://npmcdn.com/farfetchd/dist/fetch.js"></script>`
## Usage
```js
import fetch from 'farfetched';

fetch('https://news.ycombinator.com/')
    .then((response) => response.text())
    .then(console.log);
```
## Alternatives
* [bitinn/node-fetch](https://github.com/bitinn/node-fetch) - NodeJS fetch implementation
* [github/fetch](https://github.com/github/fetch) - Browser fetch polyfill
* [matthew-andrews/isomorphic-fetch](https://github.com/matthew-andrews/isomorphic-fetch) - Isomorphic fetch based on bitinn/node-fetch and github/fetch