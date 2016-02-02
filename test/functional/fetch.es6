import { default as fetch, Request, Response, Body, Headers } from '../../lib/fetch';
import FormData from 'isomorphic-form-data';
import { default as mockServer } from 'mockserver-grunt';
import { mockServerClient } from 'mockserver-client';
import { default as chai, expect } from 'chai';
import { default as chaiAsPromised } from 'chai-as-promised';

const MOCK_SERVER_HOST = 'localhost';
const MOCK_SERVER_PORT = 1080;

chai.use(chaiAsPromised);

describe('fetch', function() {

  this.timeout(0);

  const client = mockServerClient(MOCK_SERVER_HOST, MOCK_SERVER_PORT);

  before(() => {

    return mockServer.start_mockserver({
      serverPort: 1080,
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
      },
    ]);

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

        return expect(fetch(`http://${MOCK_SERVER_HOST}:${MOCK_SERVER_PORT}/users`))
          .to.be.fulfilled.then((response) => {

            expect(response)
              .to.be.an.instanceof(Response);
            expect(response._bodyText)
              .to.eql(expectedResponseBody);

            return expect(client
              .verify({
                method: 'GET',
                path: '/users',
                headers: [
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

  it('should make a PUT request to the input url with a payload');

  it('should make a PATCH request to the input url with a payload');

  it('should make a HEAD request to the input url');

  it('should make a DELETE request to the input url');

  it('should return a list of urls visited through redirects');

  it('should use the native promise implementation if one exists');

  it('should send any user headers with a request');

});