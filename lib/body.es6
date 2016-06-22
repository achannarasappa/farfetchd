import FormData from 'isomorphic-form-data';
import { default as _ } from 'lodash';
import { Promise } from 'es6-promise';

/**
 @module body
 */

const consumed = (body) => {

  if (body.bodyUsed)
    return Promise.reject(new TypeError('Already read'));

  body.bodyUsed = true;

};

/**
 * [Body mixin](https://fetch.spec.whatwg.org/#body-mixin) representing the body of a request or response. A body can be used through one of the class methods after which is can not be used again.
 * @alias module:body
 */
class Body {
  /**
   * @param {(String|FormData)} [body='']
   * @returns {Object} Body instance
   */
  constructor(body = '') {

    this._bodyInit = body;
    this.bodyUsed = false;

    if (_.isString(body)) {

      this._bodyText = body;

    } else if (body instanceof FormData) {

      this._bodyFormData = body;

    } else {

      throw new Error('unsupported body type');

    }

  }

  /**
   * Uses body and returns a Promise that resolves the body.
   * @returns {Promise.<String>}
   */
  text() {

    const rejected = consumed(this);

    return rejected ? rejected : Promise.resolve(this._bodyText)

  }

  /**
   * Uses body and returns a Promise that resolves a parsed JSON object from the body.
   * @returns {Promise.<Object>}
   */
  json() {

    return this.text()
      .then(JSON.parse)

  }

  /**
   * Uses body and returns a Promise that resolves an instance of FormData.
   * @returns {Promise.<FormData>}
   */
  formData() {

    return this.text()
      .then((body) => {

        const form = new FormData();
        const pairs = body.trim().replace(/\+/g, '').split('&');

        _.forEach(pairs, (pair) => form.append(..._(pair)
            .thru(decodeURIComponent)
            .split('=')
            .value()));

        return form;

      });

  }

  /**
   * Uses body and returns a Promise that resolves a Blob. Note this is not implemented yet.
   * @ignore
   * @returns {Promise.<Blob>}
   */
  blob() {

    return Promise.reject(new Error('Method has not been implemented by farfetchd yet'));

  }

  /**
   * Uses body and returns a Promise that resolves an ArrayBuffer. Note this is not implemented yet.
   * @ignore
   * @returns {Promise.<ArrayBuffer>}
   */
  arrayBuffer() {

    return Promise.reject(new Error('Method has not been implemented by farfetchd yet'));

  }

}

export default Body;