import Headers from '../../lib/headers';
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const expect = chai.expect;

chai.use(sinonChai);
chai.use(chaiAsPromised);

describe('Headers', () => {

  const moduleHeadersObject = {
    'Content-Length': 100,
    'Content-Type': 'application/x-www-form-urlencoded',
  };
  const moduleHeadersInstance = new Headers(moduleHeadersObject);

  describe('constructor', () => {

    it('should call this.append for each property in headers.map if headers is an instance of Headers', () => {

      const testHeaders = new Headers(moduleHeadersInstance);
      const spiedAppend = sinon.spy(testHeaders, 'append');

      expect(spiedAppend)
        .to.have.callCount(2);
      expect(spiedAppend.firstCall)
        .to.be.calledWith('Content-Length', 100);
      expect(spiedAppend.secondCall)
        .to.be.calledWith('Content-Type', 'application/x-www-form-urlencoded');

    });

    it('should call this.append for each property in headers if headers is a plain object', () => {

      const testHeaders = new Headers(moduleHeadersObject);
      const spiedAppend = sinon.spy(testHeaders, 'append');

      expect(spiedAppend)
        .to.have.callCount(2);
      expect(spiedAppend.firstCall)
        .to.be.calledWith('Content-Length', 100);
      expect(spiedAppend.secondCall)
        .to.be.calledWith('Content-Type', 'application/x-www-form-urlencoded');

    });

  });

  describe('append', () => {

    it('should cast the header name to a string if it is not a string', () => {

      const testHeadersInstance = new Headers();
      testHeadersInstance.append(true, 100);

      expect(testHeadersInstance)
        .to.have.property('map.true')
        .that.eqls(100);

    });

    it('should convert the header name to lowercase', () => {

      expect(moduleHeadersInstance)
        .to.have.property('map.[\'content-type\']');

    });

    it('should throw an error is the header name contains invalid characters', () => {

      const testHeadersInstance = new Headers();
      testHeadersInstance.append('@@Content-Type', 100);

      expect(testHeadersInstance)
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

    it('should append the header values to this.map[name] if this.map[name] is not undefined', () => {

      const testHeadersObject = {
        'Content-Type': 'application/x-www-form-urlencoded',
      };
      const testHeadersInstance = new Headers(testHeadersObject);
      testHeadersInstance.append('Cookie', 'testcookie');

      expect(testHeadersInstance)
        .to.have.deep.property('map.cookie')
        .and.to.have.deep.property('map.[\'content-type\']');

    });

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

    it('should throw an error', () => {

      return expect(moduleHeadersInstance.entries())
        .to.throw(Error, /Method has not been implemented/);

    });

  });

  describe('keys', () => {

    it('should throw an error', () => {

      return expect(moduleHeadersInstance.keys())
        .to.throw(Error, /Method has not been implemented/);

    });

  });

  describe('values', () => {

    it('should throw an error', () => {

      return expect(moduleHeadersInstance.values())
        .to.throw(Error, /Method has not been implemented/);

    });

  });

});