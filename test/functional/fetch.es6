import { default as fetch, Request, Response, Body, Headers } from '../../lib/fetch';
import { isNode } from '../../lib/util';
import FormData from 'isomorphic-form-data';
import qs from 'qs';
import { mockServerClient } from 'mockserver-client';
import { default as chai, expect } from 'chai';
import { default as chaiAsPromised } from 'chai-as-promised';
import { MOCK_SERVER_HOST, MOCK_SERVER_PORT, EXPRESS_SERVER_PORT } from '../configuration';

chai.use(chaiAsPromised);

describe('fetch', function() {

  this.timeout(0);

  const client = mockServerClient(MOCK_SERVER_HOST, MOCK_SERVER_PORT);

  beforeEach(() => {

    return client.reset();

  });

  it('should make a GET request to the input url', () => {

    const expectedResponseBody = JSON.stringify([
      {
        id: 4,
        name: 'charmander',
        type: 'fire',
      },
    ]);
    const testUrl = `http://${MOCK_SERVER_HOST}:${MOCK_SERVER_PORT}/users?include=["type"]&a=1#title`;

    return client
      .mockAnyResponse({
        httpRequest: {
          method: 'GET',
          path: '/users',
        },
        httpResponse: {
          statusCode: 200,
          body: expectedResponseBody,
        },
      })
      .then(() => {

        return expect(fetch(testUrl, {
          headers: {
            'Accept-Charset': 'utf-8',
            'X-Client': 'farfetched',
          }
        }))
          .to.be.fulfilled.then((response) => {

            // Alternate request verification required for browser code since specific headers
            // can not be modified due to security restrictions. See:
            // https://dvcs.w3.org/hg/xhr/raw-file/tip/Overview.html#dom-xmlhttprequest-setrequestheader
            const headers = isNode() ? [
              {
                name: 'Accept-Charset',
                values: [ 'utf-8' ],
              },
              {
                name: 'X-Client',
                values: [ 'farfetched' ],
              },
              {
                name: 'Content-Length',
                values: [ '0' ],
              },
              {
                name: 'Accept',
                values: [ '*/*' ],
              },
              {
                name: 'User-Agent',
                values: [ `farfetched/${ require('../../package.json').version }` ],
              },
              {
                name: 'Host',
                values: [ `${MOCK_SERVER_HOST}:${MOCK_SERVER_PORT}` ],
              },
            ] : [
              {
                name: 'X-Client',
                values: [ 'farfetched' ],
              },
            ];

            expect(response)
              .to.be.an.instanceof(Response);
            expect(response._bodyText)
              .to.eql(expectedResponseBody);
            expect(response.status)
              .to.eql(200);
            expect(response.statusText)
              .to.eql('OK');
            expect(response.ok)
              .to.eql(true);
            expect(response.headers)
              .to.be.an.instanceof(Headers);
            expect(response.headers.map)
              .to.eql({
                connection: [ 'keep-alive' ],
                'content-length': [ '44' ],
                'content-type': [ 'text/plain' ],
              });
            expect(response.url)
              .to.eql(testUrl);
            expect(response.urlList)
              .to.eql([ testUrl ]);

              return expect(client
                .verify({
                  method: 'GET',
                  path: '/users',
                  headers,
                  keepAlive: true,
                  secure: false,
                })).to.be.fulfilled

          });

      })

  });

  it('should make a POST request to the input url with a multipart/form-data payload', () => {

    const expectedResponseBody = JSON.stringify({
      id: '5',
      name: 'charmeleon'
    });
    const testPayload = new FormData();
    testPayload.append('id', '5');
    testPayload.append('name', 'charmeleon');

    return client
      .mockAnyResponse({
        httpRequest: {
          method: 'POST',
          path: '/users',
        },
        httpResponse: {
          statusCode: 200,
          body: expectedResponseBody,
        },
      })
      .then(() => {

        return expect(fetch(`http://${MOCK_SERVER_HOST}:${MOCK_SERVER_PORT}/users`, {
          method: 'POST',
          body: testPayload,
        }))
          .to.be.fulfilled.then((response) => {

            const body = isNode() ? {
              type: 'STRING',
              value: `--${testPayload.getBoundary()}\r\nContent-Disposition: form-data; name=\"id\"\r\n\r\n5\r\n--${testPayload.getBoundary()}\r\nContent-Disposition: form-data; name=\"name\"\r\n\r\ncharmeleon\r\n--${testPayload.getBoundary()}--\r\n`,
            } : undefined;
            const headers = isNode() ? [
              {
                name: 'content-type',
                values: [ `multipart/form-data; boundary=${testPayload.getBoundary()}` ],
              },
              {
                name: 'content-length',
                values: [ '271' ],
              },
              {
                name: 'accept',
                values: [ '*/*' ],
              },
              {
                name: 'user-agent',
                values: [ `farfetched/${ require('../../package.json').version }` ],
              },
              {
                name: 'host',
                values: [ `${MOCK_SERVER_HOST}:${MOCK_SERVER_PORT}` ],
              },
            ] : [
              {
                name: 'content-length',
                values: [ '235' ],
              },
              {
                type: 'REGEX',
                name: 'content-type',
                values: [ `multipart/form-data; boundary=----WebKitFormBoundary([a-zA-Z0-9]{16}+)` ],
              },
            ];

            expect(response)
              .to.be.an.instanceof(Response);
            expect(response._bodyText)
              .to.eql(expectedResponseBody);

            return expect(client
              .verify({
                method: 'POST',
                path: '/users',
                headers,
                body,
                keepAlive: true,
                secure: false,
              })).to.be.fulfilled

          });

      })

  });

  it('should make a POST request to the input url with a application/x-www-form-urlencoded payload', () => {

    const testObject = {
      id: '6',
      name: 'charizard'
    };
    const expectedResponseBody = JSON.stringify(testObject);
    // TODO: Replace with URLSearchParams
    const testPayload = qs.stringify(testObject);

    return client
      .mockAnyResponse({
        httpRequest: {
          method: 'POST',
          path: '/users',
        },
        httpResponse: {
          statusCode: 200,
          body: expectedResponseBody,
        },
      })
      .then(() => {

        return expect(fetch(`http://${MOCK_SERVER_HOST}:${MOCK_SERVER_PORT}/users`, {
          method: 'POST',
          body: testPayload,
          headers: {
            // TODO: Remove when URLSearchParams support is implemented
            'content-type': 'application/x-www-form-urlencoded;charset=UTF-8',
          }
        }))
          .to.be.fulfilled.then((response) => {

            expect(response)
              .to.be.an.instanceof(Response);
            expect(response._bodyText)
              .to.eql(expectedResponseBody);

            return expect(client
              .verify({
                method: 'POST',
                path: '/users',
                headers: [
                  {
                    name: 'content-type',
                    values: [ 'application/x-www-form-urlencoded;charset=UTF-8' ],
                  },
                  {
                    name: 'content-length',
                    values: [ '19' ],
                  },
                ],
                body: {
                  type: 'STRING',
                  value: 'id=6&name=charizard',
                },
                keepAlive: true,
                secure: false,
              })).to.be.fulfilled

          });

      })

  });

  it('should make a HEAD request to the input url', () => {

    return client
      .mockAnyResponse({
        httpRequest: {
          method: 'HEAD',
          path: '/users',
        },
        httpResponse: {
          statusCode: 200,
        },
      })
      .then(() => {

        return expect(fetch(`http://${MOCK_SERVER_HOST}:${MOCK_SERVER_PORT}/users`, {
          method: 'HEAD',
        }))
          .to.be.fulfilled.then((response) => {

            expect(response)
              .to.be.an.instanceof(Response);
            expect(response._bodyText)
              .to.eql('');

            return expect(client
              .verify({
                method: 'HEAD',
                path: '/users',
                headers: [
                  {
                    name: 'content-length',
                    values: [ '0' ],
                  },
                  {
                    name: 'accept',
                    values: [ '*/*' ],
                  },
                ],
                keepAlive: true,
                secure: false,
              })).to.be.fulfilled

          });

      })
    
  });

  it('should handle error responses', () => {

    const testUrl = `http://${MOCK_SERVER_HOST}:${MOCK_SERVER_PORT}/users/6`;

    return expect(fetch(testUrl, {
      method: 'DELETE',
    }))
      .to.be.fulfilled.then((response) => {

        expect(response)
          .to.be.an.instanceof(Response);
        expect(response._bodyText)
          .to.eql('');
        expect(response.status)
          .to.eql(404);
        expect(response.statusText)
          .to.eql('Not Found');
        expect(response.ok)
          .to.eql(false);
        expect(response.headers)
          .to.be.an.instanceof(Headers);
        expect(response.headers.map)
          .to.eql({
            connection: [ 'keep-alive' ],
            'content-length': [ '0' ],
          });
        expect(response.url)
          .to.eql(testUrl);
        expect(response.urlList)
          .to.eql([ testUrl ]);

        return expect(client
          .verify({
            method: 'DELETE',
            path: '/users/6',
            headers: [
              {
                name: 'content-length',
                values: [ '0' ],
              },
              {
                name: 'accept',
                values: [ '*/*' ],
              },
            ],
            keepAlive: true,
            secure: false,
          })).to.be.fulfilled

      });
    
  });

  it('should return a list of urls visited through redirects', () => {

    return expect(fetch(`http://localhost:${ EXPRESS_SERVER_PORT }/redirect_1`))
      .to.be.fulfilled.then((response) => {

        const expectedUrlList = isNode() ? [
          `http://localhost:${ EXPRESS_SERVER_PORT }/redirect_1`,
          `http://localhost:${ EXPRESS_SERVER_PORT }/redirect_2`,
          `http://localhost:${ EXPRESS_SERVER_PORT }/redirect_3`,
          `http://localhost:${ EXPRESS_SERVER_PORT }/redirect_4`,
        ] : [
          `http://localhost:${ EXPRESS_SERVER_PORT }/redirect_1`,
          `http://localhost:${ EXPRESS_SERVER_PORT }/redirect_4`,
        ];

        expect(response.urlList)
          .to.eql(expectedUrlList);
        expect(response._bodyInit)
          .to.eql('end redirect');

      })

  });

  it('should decompress a response based on the content-encoding header', () => {

    return expect(fetch(`http://localhost:${ EXPRESS_SERVER_PORT }/compression`))
      .to.be.fulfilled.then((response) => {

        expect(response._bodyInit)
          .to.eql('test compressed body');

      })

  });

  // PROPOSAL: https://github.com/whatwg/fetch/issues/180
  it('should return a rejected promise if the timeout is exceeded', () => {

    return expect(fetch(`http://localhost:${ EXPRESS_SERVER_PORT }/timeout`, {
      timeout: 500,
    }))
      .to.be.rejected.then((error) => {

        expect(error)
          .to.be.an.instanceof(Error);
        expect(error.message)
          .to.eql('Fetch timeout exceeded');

      })

  });

});