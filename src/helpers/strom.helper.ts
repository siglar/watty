export const calculateElectricitySupport = (averagePrice: number, totalConsumption: number, totalPrice: number) => {
  if (averagePrice > 87.5) {
    const withSupport = Number.parseFloat(((averagePrice - 87.5) * 0.9).toFixed(2));

    const withSupportKWhPrice = withSupport * (totalConsumption / 100);
    return totalPrice - withSupportKWhPrice;
  }
  return totalPrice;
};
