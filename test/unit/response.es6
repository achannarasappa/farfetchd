import Response from '../../lib/response ';
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const expect = chai.expect;

chai.use(chaiAsPromised);

describe('Response', () => {

  describe('constructor', () => {

    it('should set this.ok to true if init.status is between 199 and 300', () => {

      expect(new Response('', {
        status: 200,
      }))

    });

    it('should set this.headers to an instance of Headers if it not one already');

    it('should set this.headerList to an object of containing headers');

    it('should set this.url to init.url if init.url is a string');

    it('should set this.url to the first url in init.urlList if init.urlList is an array');

    it('should throw an error if body is defined but not an object');

    it('should throw an error if init is defined but not an object');

    it('should throw an error if init.status is not a number or undefined');

    it('should throw an error if init.type is not a string or undefined');

    it('should throw an error if init.statusMessage is not a string or undefined');

    it('should throw an error if init.urlList is not an array or undefined');

    it('should throw an error if init.terminationReason is not a string or undefined');

    it('should throw an error if init.cacheState is not a string or undefined');

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