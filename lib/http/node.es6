import { http, https } from 'follow-redirects';
import { default as zlib } from 'zlib';
import { Promise } from 'es6-promise';
import { default as parseUrl } from 'url-parse';
import { default as _ } from 'lodash';
import Response from '../response';
import Headers from '../headers';

/**
 @module http/node
 */

const contentEncodings = [
  'gzip',
  'compress',
  'deflate',
];

const getHeaders = (request) => {

  return _(request.headers.map)
    .mapValues((values) => _.join(values, ', '))
    .mapKeys((value, key) => key.toLowerCase())
    .thru((headers) => _.isUndefined(request._bodyFormData) ? headers : _.assign({}, headers, request._bodyFormData.getHeaders()))
    .value()

};

const getBody = (headers, data) => {

  const buffer = Buffer.concat(data);

  if (_.has(headers.map, 'content-encoding') && _.intersection(contentEncodings, headers.map['content-encoding']).length > 0)
    return zlib.unzipSync(buffer).toString();

  return buffer.toString();

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
  const path = pathname + query + hash;
  const options = {
    method: request.method,
    protocol,
    hostname,
    port,
    auth,
    pathname: path,
    path,
    headers: getHeaders(request),
  };

  return new Promise((resolve, reject) => {

    let data = [];
    let timer;
    const req = client.request(options, (res) => {

      res.on('data', (chunk) => data.push(new Buffer(chunk)));

      res.on('end', () => {

        const headers = new Headers(res.headers);
        const body = getBody(headers, data);

        if (request.timeout)
          clearTimeout(timer);

        return resolve(new Response(body, {
          urlList: _.reverse(res.fetchedUrls),
          status: res.statusCode,
          statusText: res.statusMessage,
          headers,
        }))

      });

    });

    if (!_.isUndefined(request._bodyFormData))
      request._bodyFormData.pipe(req);

    req.on('error', (error) => reject(error));

    req.end(request._bodyText);

    if (request.timeout) {

      timer = setTimeout(() => {

        req.abort();

        return reject(new Error('Fetch timeout exceeded'))

      }, request.timeout);
    }

  })

};

export default httpNode;