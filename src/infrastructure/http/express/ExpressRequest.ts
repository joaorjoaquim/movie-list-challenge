import { Request as ExpressRequest } from 'express';
import { IRequest } from '../../../domain/interfaces/http/IRequest';

export class ExpressRequestAdapter implements IRequest {
  constructor(private expressRequest: ExpressRequest) {}

  get body() {
    return this.expressRequest.body;
  }

  get params() {
    return this.expressRequest.params as Record<string, string>;
  }

  get query() {
    return this.expressRequest.query as Record<string, string | string[]>;
  }

  get headers() {
    return this.expressRequest.headers as Record<string, string | string[] | undefined>;
  }
}
