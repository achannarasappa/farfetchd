import { default as _ } from 'lodash';
import Body from './body';
import Headers from './headers';
import Request from './request';
import Response from './response';
import httpNode from './http/node';
import httpBrowser from './http/browser';

const fetch = (input, init) => {

  const request = new Request(input, init = {});
  const {
    http = _.isUndefined(typeof XMLHttpRequest) ? httpNode : httpBrowser,
  } = init;

  return http(request)

};

export { fetch as default, Body, Headers, Request, Response };