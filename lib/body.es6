import FormData from 'isomorphic-form-data';
import { default as _ } from 'lodash';

const consumed = (body) => {

  if (body.bodyUsed)
    return Promise.reject(new TypeError('Already read'));

  body.bodyUsed = true;

};

class Body {

  constructor(body = '') {

    this.bodyUsed = false;
    this._bodyInit = body;

    if (_.isString(body)) {

      this._bodyText = body;

    } else if (body instanceof FormData) {

      this._bodyFormData = body;

    } else {

      throw new Error('unsupported body type');

    }

  }

  text() {

    const rejected = consumed(this);

    return rejected ? rejected : Promise.resolve(this._bodyText)

  }

  json() {

    return this.text()
      .then(JSON.parse)

  }

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

  blob() {

    return Promise.reject(new Error('Method has not been implemented by farfetchd yet'));

  }

  arrayBuffer() {

    return Promise.reject(new Error('Method has not been implemented by farfetchd yet'));

  }

}

export default Body;