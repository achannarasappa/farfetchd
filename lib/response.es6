import * as _ from 'lodash';
import Body from './body';
import Headers from './headers';

const initKeys = [
  'status',
  'statusText',
  'type',
  'cacheState',
  'httpsState',
  'headers',
  'url',
  'urlList',
  'terminationReason',
];

class Response extends Body {

  constructor(body = '', init = {}) {

    const defaults = {
      status: 200,
      statusText: 'OK',
      type: 'default',
      cacheState: 'none',
      httpsState: 'none',
      headers: {},
    };

    super(body);

    if (!_.isPlainObject(init))
      throw new Error('Response init must be an object');

    if (!_.isNumber(init.status) && !_.isUndefined(init.status))
      throw new Error('Response init.status must be a number');

    if (!_.isString(init.type) && !_.isUndefined(init.type))
      throw new Error('Response init.type must be a string');

    if (!_.isString(init.statusText) && !_.isUndefined(init.statusText))
      throw new Error('Response init.statusText must be a string');

    if (!_.isArray(init.urlList) && !_.isUndefined(init.urlList))
      throw new Error('Response init.urlList must be an array');

    if (!_.isString(init.terminationReason) && !_.isUndefined(init.terminationReason))
      throw new Error('Response init.terminationReason must be a string');

    if (!_.isString(init.cacheState) && !_.isUndefined(init.cacheState))
      throw new Error('Response init.cacheState must be a string');

    if (!_.isString(init.httpsState) && !_.isUndefined(init.httpsState))
      throw new Error('Response init.httpsState must be a string');

    _.extend(this, defaults, _.pick(init, initKeys));

    this._body = body;

    this.ok  = this.status >= 200 && this.status < 300;

    this.headers  = new Headers(init.headers);

    this.headerList  = this.headers.map;

    if (_.isString(init.url))
      this.url = init.url;

    if (_.isArray(init.urlList))
      this.url = _.last(init.urlList);

  }

  clone() {

    return new Response(this._body, _.pick(this, initKeys));

  }

  error() {

    return new Response('', {
      type: 'error',
      status: 0,
      statusText: 'Network Error',
    })

  }

  redirect() {

    throw new Error('Method has not been implemented by farfetchd yet');

  }

}

export default Response;