import { TibberRoot } from "../models/tibber.models";

export const calculateAveragePrice = (tibberRoot: TibberRoot) => {
  const consumption = tibberRoot.data.viewer.home.consumption;
  const priceArray = consumption.nodes
    .filter((n) => n.unitPrice !== null)
    .map((n) => n.unitPrice);

  const priceTotal = priceArray.reduce((partialSum, a) => partialSum + a, 0);
  const averagePrice = priceTotal / priceArray.length;

  return averagePrice;
};

export const getDays = (year: number, month: number) => {
  return new Date(year, month, 0).getDate();
};
