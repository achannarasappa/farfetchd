import Request from '../../lib/request';
import Headers from '../../lib/headers';
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
      'not undefined');

    it('should set this.headers to a new instance of Headers with no arguments if none of the ' +
      'preceding conditions are met');

    it('should set the input bodyUsed property to true if the input is an instance of Request and ' +
      'init.body is undefined');

    it('should set this.url to input if input is an url');

    it('should throw an Error if input is neither a url nor an instance of Request');

    it('should throw a TypeError if the method is either HEAD or GET and a body is set');

  });

  describe('clone', () => {

    it('should return a new instance of Request');

  });

});

