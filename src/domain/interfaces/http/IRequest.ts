export interface IRequest {
  body: any;
  params: Record<string, string>;
  query: Record<string, string | string[]>;
  headers: Record<string, string | string[] | undefined>;
}
