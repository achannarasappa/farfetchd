import { default as fetch, Request, Response, Body, Headers } from '../../lib/fetch';
import FormData from 'isomorphic-form-data';
import qs from 'qs';
import { default as mockServer } from 'mockserver-grunt';
import { mockServerClient } from 'mockserver-client';
import { default as chai, expect } from 'chai';
import { default as chaiAsPromised } from 'chai-as-promised';
import { default as express } from 'express';
import { default as zlib } from 'zlib';

const MOCK_SERVER_HOST = 'localhost';
const MOCK_SERVER_PORT = 1080;
const EXPRESS_SERVER_PORT = 1081;

chai.use(chaiAsPromised);

describe('fetch', function() {

  this.timeout(0);

  const client = mockServerClient(MOCK_SERVER_HOST, MOCK_SERVER_PORT);

  before(() => {

    return mockServer.start_mockserver({
      serverPort: MOCK_SERVER_PORT,
    })

  });

  beforeEach(() => {

    return client.reset();

  });

  after(() => {

    return mockServer.stop_mockserver();

  });

  it('should make a GET request to the input url', () => {

    const expectedResponseBody = JSON.stringify([
      {
        id: 4,
        name: 'charmander',
        type: 'fire',
      },
    ]);
    const testUrl = `http://${MOCK_SERVER_HOST}:${MOCK_SERVER_PORT}/users?include=["type"]#title`;

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
          }
        }))
          .to.be.fulfilled.then((response) => {

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
                headers: [
                  {
                    name: 'Accept-Charset',
                    values: [ 'utf-8' ],
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
                ],
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
                ],
                body: {
                  type: 'STRING',
                  value: `--${testPayload.getBoundary()}\r\nContent-Disposition: form-data; name=\"id\"\r\n\r\n5\r\n--${testPayload.getBoundary()}\r\nContent-Disposition: form-data; name=\"name\"\r\n\r\ncharmeleon\r\n--${testPayload.getBoundary()}--\r\n`,
                },
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
                  {
                    name: 'user-agent',
                    values: [ `farfetched/${ require('../../package.json').version }` ],
                  },
                  {
                    name: 'host',
                    values: [ `${MOCK_SERVER_HOST}:${MOCK_SERVER_PORT}` ],
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
              {
                name: 'user-agent',
                values: [ `farfetched/${ require('../../package.json').version }` ],
              },
              {
                name: 'host',
                values: [ `${MOCK_SERVER_HOST}:${MOCK_SERVER_PORT}` ],
              },
            ],
            keepAlive: true,
            secure: false,
          })).to.be.fulfilled

      });
    
  });

  it('should return a list of urls visited through redirects', () => {

    const expectedResponseBody = 'end redirect';
    const redirect = (count) => [ `/url${ count }`, (req, res) => res.redirect(`/url${ count + 1 }`) ];
    const app = express();

    app.get(...redirect(1));
    app.get(...redirect(2));
    app.get(...redirect(3));
    app.get('/url4', (req, res) => {

      res.send(expectedResponseBody);
      
    });
    const server = app.listen(EXPRESS_SERVER_PORT);

    return expect(fetch(`http://localhost:${ EXPRESS_SERVER_PORT }/url1`))
      .to.be.fulfilled.then((response) => {

        expect(response.urlList)
          .to.eql([
            `http://localhost:${ EXPRESS_SERVER_PORT }/url1`,
            `http://localhost:${ EXPRESS_SERVER_PORT }/url2`,
            `http://localhost:${ EXPRESS_SERVER_PORT }/url3`,
            `http://localhost:${ EXPRESS_SERVER_PORT }/url4`,
          ]);
        expect(response._bodyInit)
          .to.eql(expectedResponseBody);
        return server.close();

      })

  });

  it('should decompress a response based on the content-encoding header', () => {

    const expectedResponseBody = 'test compressed body';
    const gzippedBody = zlib.gzipSync(expectedResponseBody);
    const app = express();
    app.get('/compressed', (req, res) => {

      res.set('Content-Encoding', 'gzip,deflate');
      res.send(gzippedBody);

    });
    const server = app.listen(EXPRESS_SERVER_PORT);

    return expect(fetch(`http://localhost:${ EXPRESS_SERVER_PORT }/compressed`))
      .to.be.fulfilled.then((response) => {

        expect(response._bodyInit)
          .to.eql(expectedResponseBody);

        return server.close();

      })

  });

  // PROPOSAL: https://github.com/whatwg/fetch/issues/180
  it('should timeout with a termination reason of timeout');

});