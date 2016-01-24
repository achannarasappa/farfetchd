import { default as fetch, Request, Response, Body, Headers } from '../../lib/fetch';
import { default as chai, expect } from 'chai';
import { default as chaiAsPromised } from 'chai-as-promised';

describe('fetch', () => {

  it('should make a GET request to the input url', () => {

    return expect(fetch('http://localhost:3000/posts/1'))
      .to.be.fulfilled.then((response) => {

        expect(response)
          .to.be.an.instanceof(Response);

        return expect(response.json())
          .to.eventually
          .eql({
            id: 1,
            title: 'help computer',
            author: 'charmander',
          })

      });

  });

  it('should make a POST request to the input url with a payload');

  it('should make a PUT request to the input url with a payload');

  it('should make a PATCH request to the input url with a payload');

  it('should make a HEAD request to the input url');

  it('should make a DELETE request to the input url');

  it('should return a list of urls visited through redirects');

});