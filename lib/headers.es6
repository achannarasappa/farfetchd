import * as _ from 'lodash';

const castString = (value) =>  _.isString(value) ? value : String(value);

const normalizeName = (name) => {

  const string = castString(name);

  if (/[^a-z0-9\-#$%&'*+.\^_`|~]/i.test(string))
    throw new TypeError('Invalid character in header field name');

  return string.toLowerCase();

};

class Headers {

  constructor(headers) {

    this.map = {};

    if (headers instanceof Headers)
      _.map(headers.map, (value, key) => this.append(key, value));

    if (_.isPlainObject(headers))
      _.map(headers, (value, key) => this.append(key, value));

  }

  append(name, value) {

    const normalizedName = normalizeName(name);

    if (!_.has(this.map, normalizedName))
      this.map[normalizedName] = [];

    if (_.isArray(value))
      this.map[normalizedName].push(..._.map(value, castString));

    if (!_.isArray(value))
      this.map[normalizedName].push(castString(value));

  }

  'delete'(name) {

    this.map = _.omit(this.map, name)

  }

  'get'(name) {

    const values = this.map[normalizeName(name)];

    return values ? values[0] : null

  }

  getAll(name) {

    return this.map[normalizeName(name)] || []

  }

  has(name) {

    return _.has(this.map, normalizeName(name));

  }

  'set'(name, value) {

    this.map[normalizeName(name)] = [castString(value)]

  }

  entries() {

    throw new Error('Method has not been implemented by farfetchd yet');

  }

  keys() {

    throw new Error('Method has not been implemented by farfetchd yet');

  }

  values() {

    throw new Error('Method has not been implemented by farfetchd yet');

  }

}

export default Headers;