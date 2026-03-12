import { Consumption } from './consumption';

export interface ConsumptionDay {
  date: string;
  consumption: Consumption[];
  totalSpotPriceCost: number;
  totalNettleieCost: number;
  totalPriceForDay: number;
  averageKwhPrice: number;
  averageSpotPricePerKwh: number;
  averageNettleiePricePerKwh: number;
  totalConsumptionInKwh: number;
}
