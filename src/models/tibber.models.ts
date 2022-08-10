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
  nodes: Node[];
}

export interface Home {
  timeZone: string;
  consumption: Consumption;
}

export interface Viewer {
  homes: Home[];
}

export interface Data {
  viewer: Viewer;
}

export interface TibberRoot {
  data: Data;
}
