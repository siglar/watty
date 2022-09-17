export interface ChartData {
  date: string;
  costData: CostData;
}

export interface CostData {
  cost: number;
  kWPrice: string;
}
