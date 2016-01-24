import { http, https } from 'follow-redirects';
import { Promise } from 'es6-promise';
import { default as parseUrl } from 'url-parse';
import Response from '../response';

const httpNode = (request) => {

  const {
    protocol,
    hostname,
    port,
    auth,
    pathname,
  } = parseUrl(request.url);
  const client = protocol === 'https' ? https : http;
  const options = {
    protocol,
    hostname,
    port,
    auth,
    path: pathname,
  };

  return new Promise((resolve, reject) => {

    client.request(options, (res) => {



    })

  })

};

export default httpNode;