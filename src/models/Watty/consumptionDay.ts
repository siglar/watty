import { Consumption } from './consumption';

export interface ConsumptionDay {
  date: string;
  consumption: Consumption[];
  priceForDay: number;
}
