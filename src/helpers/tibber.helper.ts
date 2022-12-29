import { TibberRoot } from '../models/tibber.models';

export const calculateAveragePrice = (tibberRoot: TibberRoot) => {
  const consumption = tibberRoot.data.viewer.home.consumption;
  const priceArray = consumption.nodes.filter((n) => n.unitPrice !== null).map((n) => n.unitPrice);

  const priceTotal = priceArray.reduce((partialSum, a) => partialSum + a, 0);
  const averagePrice = priceTotal / priceArray.length;

  return Number.parseFloat((averagePrice * 100).toFixed(1));
};

export const calculateElectricitySupport = (averagePrice: number, totalConsumption: number, totalPrice: number) => {
  if (averagePrice > 87.5) {
    const withSupport = Number.parseFloat(((averagePrice - 87.5) * 0.9).toFixed(2));

    const withSupportKWhPrice = withSupport * (totalConsumption / 100);
    return totalPrice - withSupportKWhPrice;
  }
  return totalPrice;
};

export const getCursor = (year: number, month: number) => {
  const firstDayOfNextMonth = new Date(year, month, 1).toISOString();
  return btoa(firstDayOfNextMonth);
};
