# farfetched
Isomorphic implementation of the [Fetch standard](https://fetch.spec.whatwg.org/).

* Does not modify global with `fetch`
* Consistent API across client and server

## Installation
#### NPM
`npm install farfetched --save`
#### Bower
`bower install farfetched --save`
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