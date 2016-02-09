import { http, https } from '../../../follow-redirects';
import { Promise } from 'es6-promise';
import { default as parseUrl } from 'url-parse';
import FormData from 'isomorphic-form-data';
import { default as _ } from 'lodash';
import Response from '../response';

const getHeaders = (request) => {

  return _(request.headers.map)
    .mapValues((values) => _.join(values, ', '))
    .mapKeys((value, key) => key.toLowerCase())
    .thru((headers) => _.isUndefined(request._bodyFormData) ? headers : _.assign({}, headers, request._bodyFormData.getHeaders()))
    .value()

};

const httpNode = (request) => {

  const {
    protocol,
    hostname,
    port,
    auth,
    pathname,
    query,
    hash,
  } = parseUrl(request.url);
  const client = protocol === 'https:' ? https : http;
  const options = {
    method: request.method,
    protocol,
    hostname,
    port,
    auth,
    path: pathname + query + hash,
    headers: getHeaders(request),
  };

  return new Promise((resolve, reject) => {

    let data = [];
    const req = client.request(options, (res) => {

      res.on('data', (chunk) => data.push(new Buffer(chunk)));

      res.on('end', () => {

        const body = Buffer.concat(data).toString();

        return resolve(new Response(body, {
          urlList: _.reverse(res.fetchedUrls),
          status: res.statusCode,
          statusText: res.statusMessage,
          headers: res.headers,
        }))

      });

    });

    if (!_.isUndefined(request._bodyFormData))
      request._bodyFormData.pipe(req);

    req.on('error', (error) => reject(error));

    req.end(request._bodyText);

  })

};

export default httpNode;