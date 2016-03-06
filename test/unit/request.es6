import Request from '../../lib/request';
import Headers from '../../lib/headers';
import FormData from 'isomorphic-form-data';
import { default as chai, expect } from 'chai';
import { default as chaiAsPromised } from 'chai-as-promised';
import { default as _ } from 'lodash';

chai.use(chaiAsPromised);

describe('Request', () => {

  describe('constructor', () => {

    // https://github.com/whatwg/fetch/blob/010dd7ad85d9bb893c7bbb03e2cbb800068da18e/Overview.html#L3805
    it('should throw a TypeError if the input is an instance of Request and input.bodyUsed is true', () => {

      const testRequestInstance = new Request('http://example.com');
      testRequestInstance.bodyUsed = true;

      expect(() => new Request(testRequestInstance))
        .to.throw(TypeError, 'Request body already used');

    });

    // https://github.com/whatwg/fetch/blob/010dd7ad85d9bb893c7bbb03e2cbb800068da18e/Overview.html#L4009
    it('should set this.headers to a new instance of Headers with input.headers if the input is an ' +
      'instance of Request and init.headers is not set', () => {

        const testHeadersObject = {
          'Content-Length': 100,
          'Accept': '*/*',
          'Connection': 'keep-alive',
          'User-Agent': 'farfetched/0.0.1',
        };
        const testHeadersInstance = new Headers(testHeadersObject);
        const testRequestInstance = new Request('http://example.com', { headers: testHeadersObject });

        expect(new Request(testRequestInstance))
          .to.have.property('headers')
          .that.eqls(testHeadersInstance);

      });

    // https://github.com/whatwg/fetch/blob/010dd7ad85d9bb893c7bbb03e2cbb800068da18e/Overview.html#L4013
    it('should set this.headers to a new instance of Headers with init.headers if init.headers is ' +
      'not undefined', () => {

        const testHeadersObject = { 'Content-Length': 333 };

        expect(new Request('http://example.com', { headers: testHeadersObject }))
          .to.have.deep.property('headers.map')
          .that.has.property('content-length')
          .that.eqls([ '333' ]);

      });

    // https://github.com/whatwg/fetch/blob/010dd7ad85d9bb893c7bbb03e2cbb800068da18e/Overview.html#L4102
    it('should set this.headers to a new instance of Headers with no arguments if none of the ' +
      'preceding conditions are met', () => {

        expect(new Request('http://example.com'))
          .to.have.property('headers')
          .that.is.an.instanceOf(Headers);

      });

    // https://github.com/whatwg/fetch/blob/010dd7ad85d9bb893c7bbb03e2cbb800068da18e/Overview.html#L4086
    it('should set the input bodyUsed property to true if the input is an instance of Request and ' +
      'init.body is falsy', () => {

        const testRequestInstance = new Request('http://example.com');
        new Request(testRequestInstance);

        expect(testRequestInstance)
          .to.have.property('bodyUsed')
          .that.eqls(true);

      });

    // https://github.com/whatwg/fetch/blob/010dd7ad85d9bb893c7bbb03e2cbb800068da18e/Overview.html#L3892
    it('should set this.url to input if input is a string', () => {

      const testUrl = 'http://example.com';

      expect(new Request(testUrl))
        .to.have.property('url')
        .that.eqls(testUrl);
      
    });

    // https://github.com/whatwg/fetch/blob/010dd7ad85d9bb893c7bbb03e2cbb800068da18e/Overview.html#L3700
    it('should throw a TypeError if input is neither a string nor an instance of Request', () => {

      expect(() => new Request(new Request('http://example.com')))
        .to.not.throw();
      expect(() => new Request('http://example.com'))
        .to.not.throw();
      expect(() => new Request(true))
        .to.throw(TypeError);

    });

    // https://github.com/whatwg/fetch/blob/010dd7ad85d9bb893c7bbb03e2cbb800068da18e/Overview.html#L4041
    it('should throw a TypeError if the method is either HEAD or GET and a body is set', () => {
    
      expect(() => new Request('http://example.com', {
        method: 'GET',
        body: 'test',
      }))
        .to.throw(TypeError);
      expect(() => new Request('http://example.com', {
        method: 'POST',
        body: 'test',
      }))
        .to.not.throw();
      
    });

    // https://github.com/whatwg/fetch/blob/010dd7ad85d9bb893c7bbb03e2cbb800068da18e/Overview.html#L833
    it('should throw a TypeError is init.mode is not \'navigate\', \'same-origin\', \'no-cors\', or \'cors\'', () => {
    
      expect(() => new Request('http://example.com', {
        mode: true,
      }))
        .to.throw(TypeError);
      expect(() => new Request('http://example.com', {
        mode: 'test',
      }))
        .to.throw(TypeError);
      expect(() => new Request('http://example.com', {
        mode: 'navigate',
      }))
        .to.not.throw();
      
    });

    // https://github.com/whatwg/fetch/blob/010dd7ad85d9bb893c7bbb03e2cbb800068da18e/Overview.html#L847
    it('should throw a TypeError is init.credentialsMode is not \'omit\', \'same-origin\', or \'include\'', () => {

      expect(() => new Request('http://example.com', {
        credentialsMode: true,
      }))
        .to.throw(TypeError);
      expect(() => new Request('http://example.com', {
        credentialsMode: 'test',
      }))
        .to.throw(TypeError);
      expect(() => new Request('http://example.com', {
        credentialsMode: 'omit',
      }))
        .to.not.throw();

    });

    // https://github.com/whatwg/fetch/blob/010dd7ad85d9bb893c7bbb03e2cbb800068da18e/Overview.html#L861
    it('should throw a TypeError is init.cache is not \'default\', \'no-store\', \'reload\', \'no-cache\', or \'force-cache\'', () => {

      expect(() => new Request('http://example.com', {
        cacheMode: true,
      }))
        .to.throw(TypeError);
      expect(() => new Request('http://example.com', {
        cacheMode: 'test',
      }))
        .to.throw(TypeError);
      expect(() => new Request('http://example.com', {
        cacheMode: 'reload',
      }))
        .to.not.throw();

    });

    // https://github.com/whatwg/fetch/blob/010dd7ad85d9bb893c7bbb03e2cbb800068da18e/Overview.html#L2529
    it.only(`should default the 'Content-Length' header to the body length`, () => {

      const testPayload = new FormData();
      testPayload.append('id', '5');
      testPayload.append('name', 'charmeleon');

      expect(new Request('http://example.com', {
        method: 'POST',
        body: 'test',
      }))
        .to.have.deep.property('headers.map')
        .to.have.property('content-length')
        .that.eqls([ '4' ]);

      // Only test content length header in supported contexts
      if (typeof testPayload.getLengthSync === 'function')
        expect(new Request('http://example.com', {
          method: 'POST',
          body: testPayload,
        }))
          .to.have.deep.property('headers.map')
          .to.have.property('content-length')
          .that.eqls([ '271' ]);
      
    });

    // https://github.com/whatwg/fetch/blob/010dd7ad85d9bb893c7bbb03e2cbb800068da18e/Overview.html#L1698
    it(`should default the 'Accept' header to '*/*'`, () => {

      expect(new Request('http://example.com'))
        .to.have.deep.property('headers.map')
        .to.have.property('accept')
        .that.eqls([ '*/*' ]);

    });

    // https://github.com/whatwg/fetch/blob/010dd7ad85d9bb893c7bbb03e2cbb800068da18e/Overview.html#L2557
    it(`should default the 'User-Agent' header to 'farfetched/${ require('../../package.json').version }'`, () => {

      expect(new Request('http://example.com'))
        .to.have.deep.property('headers.map')
        .to.have.property('user-agent')
        .that.eqls([ `farfetched/${ require('../../package.json').version }` ]);
      
    });

    it(`should default the 'Connection' header to 'keep-alive'`, () => {

      expect(new Request('http://example.com'))
        .to.have.deep.property('headers.map')
        .to.have.property('connection')
        .that.eqls([ 'keep-alive' ]);

    });

    // https://github.com/whatwg/fetch/blob/010dd7ad85d9bb893c7bbb03e2cbb800068da18e/Overview.html#L3551
    it(`it should default the 'Content-Type' header to 'multipart/form-data;boundary=' when body is
     an instance of FormData`);

    // https://github.com/whatwg/fetch/blob/010dd7ad85d9bb893c7bbb03e2cbb800068da18e/Overview.html#L3573
    it(`it should default the 'Content-Type' header to 'text/plain;charset=UTF-8' when body is
     a string`);

  });

  describe('clone', () => {

    // https://github.com/whatwg/fetch/blob/010dd7ad85d9bb893c7bbb03e2cbb800068da18e/Overview.html#L4154
    it('should return a new instance of Request', () => {

      const testUrl = 'http://example.com';
      const testRequestInstanceA = new Request(testUrl);
      const testRequestInstanceB = testRequestInstanceA.clone();
      testRequestInstanceA.test = true;

      expect(testRequestInstanceB)
        .to.be.an.instanceOf(Request)
        .that.not.has.property('test');
      expect(testRequestInstanceB)
        .to.be.an.instanceOf(Request)
        .that.has.property('url')
        .that.eqls(testUrl);
      
    });

  });

});

