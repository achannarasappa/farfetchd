import Request from '../../lib/request';
import Headers from '../../lib/headers';
import FormData from 'form-data';
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const expect = chai.expect;

chai.use(chaiAsPromised);

describe('Request', () => {

  describe('constructor', () => {

    it('should throw a TypeError if the input is an instance of Request and input.bodyUsed is true', () => {

      const testRequestInstance = new Request('http://example.com');
      testRequestInstance.bodyUsed = true;

      expect(() => new Request(testRequestInstance))
        .to.throw(TypeError, 'Body already read');

    });

    it('should set this.headers to a new instance of Headers with input.headers if the input is an ' +
      'instance of Request and init.headers is not set', () => {

        const testHeadersObject = { 'Content-Length': 100 };
        const testHeadersInstance = new Headers(testHeadersObject);
        const testRequestInstance = new Request('http://example.com', { headers: testHeadersObject });

        expect(new Request(testRequestInstance))
          .to.have.property('headers')
          .that.eqls(testHeadersInstance);

      });

    it('should set this.headers to a new instance of Headers with init.headers if init.headers is ' +
      'not undefined', () => {

        const testHeadersObject = { 'Content-Length': 333 };

        expect(new Request('http://example.com', { headers: testHeadersObject }))
          .to.have.deep.property('headers.map')
          .that.has.property('content-length')
          .that.eqls([ '333' ]);

      });

    it('should set this.headers to a new instance of Headers with no arguments if none of the ' +
      'preceding conditions are met', () => {

        expect(new Request('http://example.com'))
          .to.have.property('headers')
          .that.is.an.instanceOf(Headers);

      });

    it('should set the input bodyUsed property to true if the input is an instance of Request and ' +
      'init.body is falsy', () => {

        const testRequestInstance = new Request('http://example.com');
        new Request(testRequestInstance);

        expect(testRequestInstance)
          .to.have.property('bodyUsed')
          .that.eqls(true);

      });

    it('should set this.url to input if input is an url', () => {

      const testUrl = 'http://example.com';

      expect(new Request(testUrl))
        .to.have.property('url')
        .that.eqls(testUrl);
      
    });

    it('should throw an TypeError if input is neither a url nor an instance of Request', () => {

      expect(() => new Request(new Request('http://example.com')))
        .to.not.throw();
      expect(() => new Request('http://example.com'))
        .to.not.throw();
      expect(() => new Request('hello'))
        .to.throw(TypeError);

    });

    it('should throw a Error if the method is either HEAD or GET and a body is set', () => {
    
      expect(() => new Request('http://example.com', {
        method: 'GET',
        body: 'test',
      }))
      .to.throw(Error);
      expect(() => new Request('http://example.com', {
        method: 'POST',
        body: 'test',
      }))
      .to.not.throw();
      
    });

  });

  describe('clone', () => {

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

