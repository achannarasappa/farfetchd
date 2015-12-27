const chai = require('chai');
const expect = chai.expect;

describe('Body', () => {

  describe('constructor', () => {

    it('should set the _bodyText property to body if body is a string');

    it('should set the _bodyFormData property to body if body is an instance of FormData');

    it('should set the _bodyText property to an empty string if body is undefined');

    it('should throw an Error if none of the conditions are met');

  });

  describe('text', () => {

    it('should set this.bodyUsed to true if the body has not been used');

    it('should return a resolved promise if the body has not been used');

    it('should return a rejected promise with a TypeError if the body has been used');

  });

});