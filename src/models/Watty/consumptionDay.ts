import { Consumption } from './consumption';

export interface ConsumptionDay {
  date: string;
  consumption: Consumption[];
  totalPriceForDay: number;
  averageKwhPrice: number;
  totalConsumptionInKwh: number;
}
