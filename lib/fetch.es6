import { default as _ } from 'lodash';
import Body from './body';
import Headers from './headers';
import Request from './request';
import Response from './response';
import { isNode } from './util';
import httpNode from './http/node';
import httpBrowser from './http/browser';

/**
 @module fetch
 */

const fetch = (input, init) => {

  const request = new Request(input, init);
  const http = isNode() ? httpNode : httpBrowser;
  
  return http(request)

};

export { fetch as default, Body, Headers, Request, Response };