export interface Node {
  from: string;
  to: string;
  cost: number;
  unitPrice: number;
  unitPriceVAT: number;
  consumption: number;
  consumptionUnit: string;
}

export interface Consumption {
  pageInfo: PageInfo;
  nodes: Node[];
}

export interface PageInfo {
  startCursor: string;
  endCursor: string;
}

export interface Home {
  timeZone: string;
  consumption: Consumption;
  address: Address;
  id: string;
}

export interface Viewer {
  home: Home;
  homes: Home[];
}

export interface Data {
  viewer: Viewer;
}

export interface Error {
  message: string;
  locations: Location[];
  path: string[];
  extensions: Extensions;
}

export interface Extensions {
  code: string;
}

export interface TibberRoot {
  data: Data;
  errors?: Error[];
}

export interface Address {
  address1: string;
}

export interface HomeId {
  address: string;
  id: string;
}
