import { default as fetch, Request, Response, Body, Headers } from '../../lib/fetch';
import { default as chai, expect } from 'chai';
import { default as chaiAsPromised } from 'chai-as-promised';
import { spawn } from 'child_process';

describe('fetch', () => {

  let server;

  before(() => {

    server = spawn('./node_modules/.bin/json-server', [ './test/functional/db.json' ], {
      detached: true,
      stdio: 'inherit',
    });

  });

  it('should make a GET request to to the input url with all init options');

  it('should make a POST request to to the input url with all init options');

  it('should make a PUT request to to the input url with all init options');

  it('should make a PATCH request to to the input url with all init options');

  it('should make a HEAD request to to the input url with all init options');

  it('should make a DELETE request to to the input url with all init options');

  after(() => {

    server.kill();

  })

});