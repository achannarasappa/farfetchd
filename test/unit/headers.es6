import Headers from '../../lib/headers.es6';
import { default as chai, expect } from 'chai';
import { default as chaiAsPromised } from 'chai-as-promised';
import { default as sinon } from 'sinon';
import { default as sinonChai } from 'sinon-chai';

chai.use(sinonChai);
chai.use(chaiAsPromised);

describe('Headers', () => {

  const moduleHeadersObject = {
    'Content-Length': 100,
    'Content-Type': 'application/x-www-form-urlencoded',
  };
  const moduleHeadersInstance = new Headers(moduleHeadersObject);

  describe('constructor', () => {

    it('should append each property in headers.map if headers is an instance of Headers', () => {

      const testHeaders = new Headers(moduleHeadersInstance);

      expect(testHeaders)
        .have.property('map')
        .with.all.keys('content-length', 'content-type');

    });

    it('should append each property in headers if headers is a plain object', () => {

      const testHeaders = new Headers(moduleHeadersObject);

      expect(testHeaders)
        .have.property('map')
        .with.all.keys('content-length', 'content-type');

    });

  });

  describe('append', () => {

    it('should cast the header name to a string if it is not a string', () => {

      const testHeadersInstance = new Headers();
      testHeadersInstance.append(true, 100);

      expect(testHeadersInstance)
        .to.have.deep.property('map.true');

    });

    it('should convert the header name to lowercase', () => {

      expect(moduleHeadersInstance)
        .to.have.property('map')
        .that.has.property('content-type');

    });

    it('should throw an error is the header name contains invalid characters', () => {

      const testHeadersInstance = new Headers();

      expect(() => testHeadersInstance.append('☃Content-Type', 100))
        .to.throw(TypeError);

    });

    it('should cast the header value to a string if it is not a string', () => {

      const testHeadersInstance = new Headers();
      testHeadersInstance.append('Cookie', true);

      expect(testHeadersInstance)
        .to.have.deep.property('map.cookie[0]')
        .that.eqls('true');

    });

    it('should set this.map[name] to be an array with the header value if this.map[name] is undefined', () => {

      const testHeadersInstance = new Headers();
      testHeadersInstance.append('Cookie');

      expect(testHeadersInstance)
        .to.have.deep.property('map.cookie')
        .that.is.an('array');

    });

    it('should append the header value to this.map[name] and cast the value to a string if this.map[name] is not an array', () => {

      const testHeadersObject = {
        'Content-Type': 'application/x-www-form-urlencoded',
      };
      const testHeadersInstance = new Headers(testHeadersObject);
      testHeadersInstance.append('Cookie', 'testcookie');

      expect(testHeadersInstance)
        .to.have.deep.property('map.cookie');
      expect(testHeadersInstance)
        .to.have.property('map')
        .that.has.property('content-type');

    });

    it('should append all header values to this.map[name] and cast each value to a string if this.map[name] is an array', () => {

      const testHeadersObject = {
        'Content-Type': 'application/x-www-form-urlencoded',
      };
      const testHeadersInstanceA = new Headers(testHeadersObject);
      testHeadersInstanceA.map[true] = 'test';
      const testHeadersInstanceB = new Headers(testHeadersInstanceA);

      expect(testHeadersInstanceB)
        .to.have.property('map')
        .that.has.property('content-type');
      expect(testHeadersInstanceB)
        .to.have.deep.property('map.true');

    });

    it('should split header values on commas', () => {

      const testHeadersInstance = new Headers();
      testHeadersInstance.append('Content-Encoding', 'gzip,deflate');

      expect(testHeadersInstance)
        .to.have.property('map')
        .to.have.property('content-encoding')
        .that.eqls([
          'gzip',
          'deflate',
        ]);

    })

  });

  describe('delete', () => {

    it('should remove the header from this.map', () => {

      const testHeadersObject = {
        'Content-Type': 'application/x-www-form-urlencoded',
      };
      const testHeadersInstance = new Headers(testHeadersObject);
      testHeadersInstance.delete('Content-Type');

      expect(testHeadersInstance)
        .to.not.have.deep.property('map.[\'content-type\']');

    });

  });

  describe('get', () => {

    it('should return the first header value if the header name exists in this.map', () => {

      expect(moduleHeadersInstance.get('Content-Type'))
        .to.eql('application/x-www-form-urlencoded');

    });

    it('should return null if the header name does not exist in this.map', () => {

      expect(moduleHeadersInstance.get('Content-Type-A'))
        .to.eql(null);

    });

  });

  describe('getAll', () => {

    it('should return all header values if the header name exists in this.map', () => {

      expect(moduleHeadersInstance.getAll('Content-Type'))
        .to.eql([ 'application/x-www-form-urlencoded' ]);

    });

    it('should return an empty array if the header name does not exist in this.map', () => {

      expect(moduleHeadersInstance.getAll('Content-Type-A'))
        .to.eql([]);

    });

  });

  describe('has', () => {

    it('should return true if the header exists in this.map', () => {

      expect(moduleHeadersInstance.has('Content-Type'))
        .to.be.true;

    });

    it('should return false if the header does not exist in this.map', () => {

      expect(moduleHeadersInstance.has('Content-Type-A'))
        .to.be.false;

    });

  });

  describe('set', () => {

    it('should set the header name to an empty array containing the the header value', () => {

      const testHeadersInstance = new Headers();
      testHeadersInstance.set('Cookie', 'testcookie');

      expect(testHeadersInstance)
        .to.have.deep.property('map.cookie[0]')
        .that.eqls('testcookie');

    });

  });

  describe('entries', () => {

    it('should throw an error', () =>

      expect(() => moduleHeadersInstance.entries())
        .to.throw(Error, /Method has not been implemented/)

    );

  });

  describe('keys', () => {

    it('should throw an error', () =>

      expect(() => moduleHeadersInstance.keys())
        .to.throw(Error, /Method has not been implemented/)

    );

  });

  describe('values', () => {

    it('should throw an error', () =>

      expect(() => moduleHeadersInstance.values())
        .to.throw(Error, /Method has not been implemented/)

    );

  });

});