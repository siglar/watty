import { TibberRoot } from "../models/tibber.models";

export const calculateAveragePrice = (tibberRoot: TibberRoot) => {
  const consumptions = tibberRoot.data.viewer.homes.map((h) => h.consumption);
  const priceArray = consumptions.flatMap((c) =>
    c.nodes.filter((n) => n.unitPrice !== null).map((n) => n.unitPrice)
  );
  const priceTotal = priceArray.reduce((partialSum, a) => partialSum + a, 0);
  const averagePrice = priceTotal / priceArray.length;

  return averagePrice;
};
