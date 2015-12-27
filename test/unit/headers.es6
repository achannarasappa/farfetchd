import Headers from '../../lib/headers';
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const expect = chai.expect;

chai.use(chaiAsPromised);

describe('Headers', () => {

  describe('constructor', () => {

    it('should call this.append for each property in headers.map if headers is an instance of Headers');

    it('should call this.append for each property in headers if headers is a plain object');

  });

  describe('append', () => {

    it('should cast the header name to a string if it is not a string');

    it('should convert the header name to lowercase');

    it('should throw an error is the header name contains invalid characters');

    it('should cast the header value to a string if it is not a string');

    it('should set this.map[name] to an array with the header value if this.map[name] is undefined');

    it('should append the header values to this.map[name] if this.map[name] is not undefined');

  });

  describe('delete', () => {

    it('should remove the header from this.map');

  });

  describe('get', () => {

    it('should return the first header value if the header name exists in this.map');

    it('should return null if the header name does not exist in this.map');

  });

  describe('getAll', () => {

    it('should return all header values if the header name exists in this.map');

    it('should return an empty array if the header name does not exist in this.map');

  });

  describe('has', () => {

    it('should return true if the header exists in this.map');

    it('should return false if the header does not exist in this.map');

  });

  describe('set', () => {

    it('should set the header name to an empty array containing the the header value');

  });

  describe('entries', () => {

    it('should return a rejected promise');

  });

  describe('keys', () => {

    it('should return a rejected promise');

  });

  describe('values', () => {

    it('should return a rejected promise');

  });

});