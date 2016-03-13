import { Promise } from 'es6-promise';

const httpBrowser = (request) => {

  return new Promise((resolve, reject) => {

    return resolve('browser test');

  })

};

export default httpBrowser;