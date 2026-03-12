export interface Consumption {
  timeStart: Date;
  timeEnd: Date;
  nokPerKWh: number;
  nettleieNokPerKWh: number;
  kwh: number;
  spotPriceCost: number;
  nettleieCost: number;
  totalCost: number;
}
