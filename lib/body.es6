import FormData from 'form-data';
import * as _ from 'lodash';

const consumed = (body) => {

  if (body.bodyUsed)
    return Promise.reject(new TypeError('Already read'));

  body.bodyUsed = true;

};

class Body {

  constructor(body = '') {

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

        body.trim().split('&').forEach((bytes) => {

          if (bytes) {

            const split = bytes.split('=');
            const name = split.shift().replace(/\+/g, ' ');
            const value = split.join('=').replace(/\+/g, ' ');

            form.append(decodeURIComponent(name), decodeURIComponent(value))

          }

        });

        return form

      });

  }

}

export default Body;