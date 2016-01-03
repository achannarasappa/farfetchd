import Response from '../../lib/response ';
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const expect = chai.expect;

chai.use(chaiAsPromised);

describe('Response', () => {

  describe('constructor', () => {

    it('should set this.ok to true if init.status is between 199 and 300');

    it('should set this.headers to an instance of Headers if it not one already');

    it('should set this.url to an empty string if one is not present in init');

    it('should throw an error if body is defined but not an object');

    it('should throw an error if init is defined but not an object');

    it('should throw an error if init.status is undefined or not a number');

    it('should throw an error if init.type is not a string');

    it('should throw an error if init.statusText is not a string');

    it('should throw an error if init.url is not a string');

  });

  describe('clone', () => {

    it('should return a new instance of Response with the same init');

  });

  describe('error', () => {

    it('should return a new Response representing a redirect');

    it('should throw an error if an invalid status code is passed as an argument');

    it('should throw an error if no url is passed');

    it('should throw an error if url is not a string');

  });

});