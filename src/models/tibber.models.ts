export interface Node {
  from: Date;
  to: Date;
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
}

export interface Viewer {
  home: Home;
}

export interface Data {
  viewer: Viewer;
}

export interface TibberRoot {
  data: Data;
}
