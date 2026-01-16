export interface IResponse {
  status(code: number): IResponse;
  json(data: any): IResponse;
  send(data: any): IResponse;
}
