import Response from '../../lib/response';
import Headers from '../../lib/headers';
import { default as chai, expect } from 'chai';
import { default as chaiAsPromised } from 'chai-as-promised';

chai.use(chaiAsPromised);

describe('Response', () => {

  describe('constructor', () => {

    it('should set this.ok to true if init.status is between 199 and 300', () => {

      expect(new Response('', {
        status: 200,
      }))
        .to.have.property('ok', true);
      expect(new Response('', {
        status: 300,
      }))
        .to.have.property('ok', false);

    });

    it('should set this.headers to an instance of Headers if it not one already', () => {

      const testHeadersInstance = new Headers({
        Cookie: 'test',
      });

      expect(new Response())
        .to.have.property('headers')
        .that.is.an.instanceof(Headers);
      expect(new Response('', {
        headers: testHeadersInstance
      }))
        .to.have.property('headers')
        .that.is.an.instanceof(Headers);

    });

    it('should set this.headerList to an this.headers.map if this.headers is an instance of Headers', () => {

      expect(new Response())
        .to.have.property('headerList')
        .that.eqls({});

    });

    it('should set this.url to init.url if init.url is a string', () => {

      const testUrl = 'http://example.com';

      expect(new Response('', {
        url: testUrl,
      }))
        .to.have.property('url')
        .that.eqls(testUrl);

    });

    it('should set this.url to the last url in init.urlList if init.urlList is an array', () => {

      const testUrlList = [
        'http://example.com',
        'http://example.com?redirect=true',
      ];

      expect(new Response('', {
        url: 'http://google.com',
        urlList: testUrlList,
      }))
        .to.have.property('url')
        .that.eqls(testUrlList[1]);

    });

    it('should throw an error if init is defined but not an object', () => {

      expect(() => new Response('', true))
        .to.throw(Error, 'Response init must be an object');

    });

    it('should throw an error if init.status is not a number or undefined', () => {

      expect(() => new Response('', {
        status: true,
      }))
        .to.throw(Error, 'Response init.status must be a number');
      expect(() => new Response('', {
        status: 400,
      }))
        .to.not.throw();

    });

    it('should throw an error if init.type is not a string or undefined', () => {

      expect(() => new Response('', {
        type: true,
      }))
        .to.throw(Error, 'Response init.type must be a string');
      expect(() => new Response('', {
        type: 'default',
      }))
        .to.not.throw();

    });

    it('should throw an error if init.statusMessage is not a string or undefined', () => {

      expect(() => new Response('', {
        statusMessage: true,
      }))
        .to.throw(Error, 'Response init.statusMessage must be a string');
      expect(() => new Response('', {
        statusMessage: 'OK',
      }))
        .to.not.throw();

    });

    it('should throw an error if init.urlList is not an array or undefined', () => {

      expect(() => new Response('', {
        urlList: true,
      }))
        .to.throw(Error, 'Response init.urlList must be an array');
      expect(() => new Response('', {
        urlList: [
          'http://example.com'
        ],
      }))
        .to.not.throw();

    });

    it('should throw an error if init.terminationReason is not a string or undefined', () => {

      expect(() => new Response('', {
        terminationReason: true,
      }))
        .to.throw(Error, 'Response init.terminationReason must be a string');
      expect(() => new Response('', {
        terminationReason: 'timeout',
      }))
        .to.not.throw();

    });

    it('should throw an error if init.cacheState is not a string or undefined', () => {

      expect(() => new Response('', {
        cacheState: true,
      }))
        .to.throw(Error, 'Response init.cacheState must be a string');
      expect(() => new Response('', {
        cacheState: 'local',
      }))
        .to.not.throw();

    });0

    it('should throw an error if init.httpsState is not a string or undefined', () => {

      expect(() => new Response('', {
        httpsState: true,
      }))
        .to.throw(Error, 'Response init.httpsState must be a string');
      expect(() => new Response('', {
        httpsState: 'local',
      }))
        .to.not.throw();

    });

  });0

  describe('clone', () => {

    it('should return a new instance of Response with the same init', () => {

      const testResponse = new Response('', {
        status: 201,
        statusMessage: 'Created',
      });

      expect(testResponse.clone())
        .to.be.an.instanceOf(Response)
        .that.has.property('status', 201);

    });

  });

  describe('error', () => {

    it('should return a new Response representing an error', () => {

      const testResponse = new Response();

      expect(testResponse.error())
        .to.be.an.instanceOf(Response)
        .that.has.property('type', 'error');

    });

  });

  describe('redirect', () => {

    it('should throw an error', () => {

      const testResponse = new Response();

      expect(() => testResponse.redirect())
        .to.throw(Error, /Method has not been implemented/)

    });

  });

});