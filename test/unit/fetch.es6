import { default as fetch, Request, Response, Body, Headers } from '../../lib/fetch';
import { default as chai, expect } from 'chai';
import { default as chaiAsPromised } from 'chai-as-promised';
import { default as sinon } from 'sinon';
import { default as sinonChai } from 'sinon-chai';

describe('fetch', () => {

  it('should throw an error if input is not an instance of Request or a string');

  it('should throw an error is init is not an object');

  it('should throw an error is init.method is not a string');

  it('should throw an error is init.headers is not an instance of Headers or an object');

  it('should throw an error is init.body is not a string or an instance of FormData');

  it('should throw an error is init.mode is not a string');

  it('should throw an error is init.credentials is not a string');

  it('should throw an error is init.cache is not a string');

  it('should return a promise that resolves into a Response');

});