import { Promise } from 'es6-promise';
import { parse as parseHeaders } from 'get-headers'
import Response from '../response';
import Headers from '../headers';

const httpBrowser = (request) => {

  return new Promise((resolve, reject) => {

    const req = new XMLHttpRequest();

    req.open(request.method, request.url, true);

    _.map(request.headers.map, (value, key) => {

      req.setRequestHeader(key, value.join(','))

    });

    req.send(request._bodyInit);

    req.addEventListener('load', () => {

      const headers = new Headers(parseHeaders(req.getAllResponseHeaders()));

      return resolve(new Response(req.responseText, {
        urlList: [ request.url, req.responseURL ],
        status: req.status,
        statusText: req.statusText,
        headers,
      }));

    });

  })

};

export default httpBrowser;