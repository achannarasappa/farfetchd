import * as _ from 'lodash';
import Body from './body';
import Headers from './headers';

const validMethods = [
  'DELETE',
  'GET',
  'HEAD',
  'OPTIONS',
  'POST',
  'PUT'
];
const validModes = [
  'navigate',
  'same-origin',
  'no-cors',
  'cors'
];
const validCredentialsModes = [
  'omit',
  'same-origin',
  'include'
];
const validCacheModes = [
  'default',
  'no-store',
  'reload',
  'no-cache',
  'force-cache'
];
const defaults = {
  credentialsMode: 'omit',
  method: 'GET',
  mode: 'cors',
  referrer: 'client',
  redirect: 'manual',
  cacheMode: 'default',
};

const getBody = (input, init) => {

  if (input instanceof Request && !init.body)
    return input._bodyInit;

  return init.body;

};

class Request extends Body {

  constructor(input, init = {}) {

    const isInputRequestInstance = input instanceof Request;

    if (!isInputRequestInstance && !_.isString(input))
      throw new TypeError('Invalid request input');

    if (isInputRequestInstance && input.bodyUsed)
      throw new TypeError('Request body already used');

    super(getBody(input, init));

    if (isInputRequestInstance && !init.body)
      input.bodyUsed = true;

    if (isInputRequestInstance && !init.headers)
      this.headers = new Headers(input.headers);

    if (init.headers)
      this.headers = new Headers(init.headers);

    if (!_.has(this, 'headers'))
      this.headers = new Headers();

    if (_.isString(input))
      this.url = input;

    if (isInputRequestInstance)
      _.extend(this, defaults, _.pick(input, _.keys(defaults).concat('url')));

    if (_.isString(input))
      _.extend(this, defaults, _.pick(init, _.keys(defaults)));

    this.method = this.method.toUpperCase();

    if (!_.includes(validMethods, this.method))
      throw new TypeError('Invalid http method');

    if (_.includes([ 'GET', 'HEAD' ], this.method) && !_.isEmpty(body))
      throw new TypeError('Body not allowed for GET or HEAD requests');

    if (!_.includes(validModes, this.mode))
      throw new TypeError('Invalid request mode');

    if (!_.includes(validCredentialsModes, this.credentialsMode))
      throw new TypeError('Invalid request credentialsMode');

    if (!_.includes(validCacheModes, this.cacheMode))
      throw new TypeError('Invalid request cacheMode');

  }

  clone() {

    return new Request(this);

  }

}

export default Request;