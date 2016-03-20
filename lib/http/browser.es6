import { Promise } from 'es6-promise';
import Response from '../response';

const httpBrowser = (request) => {

  return new Promise((resolve, reject) => {

    const req = new XMLHttpRequest();

    req.open(request.method, request.url, true);

    req.send();

    req.addEventListener('load', function() {

      console.log(this.responseText);

      return resolve(new Response(this.responseText));

    });

  })

};

export default httpBrowser;