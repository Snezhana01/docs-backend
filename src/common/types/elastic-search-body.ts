/* eslint-disable @typescript-eslint/no-explicit-any */
export class ElasticSearchBody {
  size?: number;

  from?: number;

  query: any;

  constructor(query: any, size?: number, from?: number) {
    this.query = query;
    this.size = size ?? 10_000;
    this.from = from;
  }
}
