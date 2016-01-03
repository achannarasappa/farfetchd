import * as _ from 'lodash';
import Body from './body';
import Headers from './headers';

class Response extends Body {

  constructor(body = '', init = {}) {

    super(body);

  }

  clone() {}

  error() {}

}