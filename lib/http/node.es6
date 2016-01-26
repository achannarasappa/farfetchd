import { http, https } from 'follow-redirects';
import { Promise } from 'es6-promise';
import { default as parseUrl } from 'url-parse';
import Response from '../response';

const httpNode = (request) => {

  const {
    method
  } = request;
  const {
    protocol,
    hostname,
    port,
    auth,
    pathname,
  } = parseUrl(request.url);
  const client = protocol === 'https:' ? https : http;
  const options = {
    method,
    protocol,
    hostname,
    port,
    auth,
    path: pathname,
  };

  return new Promise((resolve, reject) => {

    let data = '';
    const req = client.request(options, (res) => {

      res.on('data', (chunk) => (data += chunk));

      res.on('end', () => resolve(new Response(data)));

    });

    req.on('error', (error) => reject(error));

    req.end();

  })

};

export default httpNode;