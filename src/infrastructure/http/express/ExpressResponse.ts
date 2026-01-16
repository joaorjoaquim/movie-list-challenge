import { Response as ExpressResponse } from 'express';
import { IResponse } from '../../../domain/interfaces/http/IResponse';

export class ExpressResponseAdapter implements IResponse {
  constructor(private expressResponse: ExpressResponse) {}

  status(code: number): IResponse {
    this.expressResponse.status(code);
    return this;
  }

  json(data: any): IResponse {
    this.expressResponse.json(data);
    return this;
  }

  send(data: any): IResponse {
    this.expressResponse.send(data);
    return this;
  }
}
