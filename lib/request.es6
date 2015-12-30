import * as _ from 'lodash';
import Body from './body';
import Headers from './headers';

class Request extends Body{

  constructor(input, init = {}) {

    const isInputRequestInstance = input instanceof Request;
    const isInputUrl = _.isString(input) && /\b((?:https?:\/\/|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'".,<>?«»“”‘’]))/i.test(input);
    const methods = [ 'DELETE', 'GET', 'HEAD', 'OPTIONS', 'POST', 'PUT' ];
    const body = (isInputRequestInstance && !init.body) ? input._bodyInit : init.body;
    const defaults = {
      credentials: 'omit',
      method: 'GET',
      mode: 'cors',
      referrer: 'client',
      redirect: 'manual',
      cache: 'default',
    };

    super(body);

    if (!isInputRequestInstance && !isInputUrl)
      throw new TypeError('Invalid input');

    if (isInputRequestInstance && input.bodyUsed)
      throw new TypeError('Body already read');

    if (isInputRequestInstance && !init.body)
      input.bodyUsed = true;

    if (isInputRequestInstance && !init.headers)
      this.headers = new Headers(input.headers);

    if (init.headers)
      this.headers = new Headers(init.headers);

    if (!_.has(this, 'headers'))
      this.headers = new Headers();

    if (isInputUrl)
      this.url = input;

    if (isInputRequestInstance)
      _.extend(this, defaults, _.pick(input, _.keys(defaults).concat('url')));

    if (isInputUrl)
      _.extend(this, defaults, _.pick(init, _.keys(defaults)));

    this.method = this.method.toUpperCase();

    if (!_.includes(methods, this.method))
      throw new Error('Invalid http method');

    if (_.includes([ 'GET', 'HEAD' ], this.method) && !_.isEmpty(body))
      throw new Error('Body not allowed for GET or HEAD requests');

  }

  clone() {

    return new Request(this);

  }

}

export default Request;