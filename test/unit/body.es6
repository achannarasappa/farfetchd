import FormData from 'isomorphic-form-data';
import Body from '../../lib/body.es6';
import { default as chai, expect } from 'chai';
import { default as chaiAsPromised } from 'chai-as-promised';

chai.use(chaiAsPromised);

describe('Body', () => {

  describe('constructor', () => {

    it('should set the _bodyText property to body if body is a string', () => {

      const testString = 'test';

      expect(new Body(testString))
        .to.have.property('_bodyText')
        .that.eqls(testString);

    });

    it('should set the _bodyFormData property to body if body is an instance of FormData', () => {

      const testFormData = new FormData();

      expect(new Body(testFormData))
        .to.have.property('_bodyFormData')
        .that.eqls(testFormData);

    });

    it('should set the _bodyText property to an empty string if body is undefined', () => {

      expect(new Body())
        .to.have.property('_bodyText')
        .that.eqls('');

    });

    it('should throw an Error if none of the conditions are met', () => {

      expect(() => new Body(true))
        .to.throw(Error);

    });

  });

  describe('text', () => {

    it('should set this.bodyUsed to true if the body has not been used', () => {

      const testBody = new Body();

      return expect(testBody.text())
        .to.be.fulfilled.then(() => {

          expect(testBody)
            .have.property('bodyUsed')
            .that.eqls(true);

        });

    });

    it('should return a resolved promise if the body has not been used', () => {

      const testBody = new Body();

      return expect(testBody.text())
        .to.eventually
        .eql('');

    });

    it('should return a rejected promise with a TypeError if the body has been used', () => {

      const testBody = new Body();

      return expect(testBody.text().then(() => testBody.text()))
        .to.eventually
        .be.rejectedWith(TypeError);

    });

  });

  describe('formData', () => {

    it('should return an instance of FormData', () => {

      const testBody = new Body('key1=val1&key2=val2');

      return expect(testBody.formData())
        .to.eventually
        .be.an.instanceOf(FormData);

    });

  });

  describe('json', () => {

    it('should parse json bodies', () => {

      const expectedBody = { key: 'value' };
      const testBody = new Body(JSON.stringify(expectedBody));

      return expect(testBody.json())
        .to.eventually
        .eql(expectedBody);

    });

  });

  describe('blob', () => {

    it('should return a rejected promise', () => {

      const testBody = new Body();

      return expect(testBody.blob())
        .to.eventually
        .be.rejectedWith(Error, /Method has not been implemented/);

    });

  });

  describe('arrayBuffer', () => {

    it('should return a rejected promise', () => {

      const testBody = new Body();

      return expect(testBody.arrayBuffer())
        .to.eventually
        .be.rejectedWith(Error, /Method has not been implemented/);

    });

  });

});