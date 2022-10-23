import { FC, useState } from "react";
import ConsumptionChart from "../ConsumptionChart/ConsumptionChart";
import "./ConsumptionView.css";
import { format } from "date-fns";
import { ShellyDataRoot } from "../../models/Shelly/data.models";
import { TibberRoot } from "../../models/tibber.models";
import {
  calculateAveragePrice,
  calculateElectricitySupport,
} from "../../helpers/tibber.helper";
import { ChartData } from "../../models/chart.models";
import SummaryList from "../SummaryList/SummaryList";
import NavigationRow from "../NavigationRow/NavigationRow";
import ConsumptionHeader from "../ConsumptionHeader/ConsumptionHeader";
import { LoadingOverlay } from "@mantine/core";
import { useOptionsContext } from "../../context/options.context";
import React from "react";

interface ConsumptionViewProps {
  shellyConsumption: ShellyDataRoot;
  tibberData: TibberRoot;
  loading: boolean;
}

const ConsumptionView: FC<ConsumptionViewProps> = (
  props: ConsumptionViewProps
) => {
  const { shellyConsumption, tibberData, loading } = props;

  const { withElectricitySupport } = useOptionsContext();

  const [showCost, setShowCost] = useState<boolean>(true);
  const [showConsumption, setShowConsumption] = useState<boolean>(false);

  const averagePrice = calculateAveragePrice(tibberData);

  const consumedKw = shellyConsumption.data.total ?? 0;

  const dayPrices = tibberData.data.viewer.home.consumption.nodes.map((n) => {
    return {
      date: format(new Date(n.from), "dd.MMM"),
      cost: n.unitPrice,
    };
  });

  const chartData: ChartData[] = shellyConsumption.data.history
    .filter((history) => history.consumption > 0)
    .map((history) => {
      const shellyDate = format(new Date(history.datetime), "dd.MMM");

      const dayConsumption = history.consumption / 1000;

      const dayPrice =
        dayPrices.find((dp) => dp.date === shellyDate)?.cost ?? averagePrice;

      const dayCost = withElectricitySupport
        ? calculateElectricitySupport(
            dayPrice * 100,
            dayConsumption,
            dayConsumption * dayPrice
          )
        : dayConsumption * dayPrice;

      return {
        date: shellyDate,
        cost: dayCost,
        kWPrice: dayPrice,
        consumption: dayConsumption,
      };
    });

  const getTotal = () => {
    const allCosts = chartData.map((c) => c.cost);
    return allCosts.reduce((pv, cv) => pv + cv, 0);
  };

  const priceForDevice = getTotal();

  return (
    <>
      <div className="options-container">
        <LoadingOverlay visible={loading} overlayBlur={1} />
        <NavigationRow />

        <SummaryList
          averagePrice={averagePrice}
          consumedKw={consumedKw}
          priceForDevice={priceForDevice}
        />

        <ConsumptionHeader
          setShowConsumption={setShowConsumption}
          setShowCost={setShowCost}
          showConsumption={showConsumption}
          showCost={showCost}
        />
      </div>

      <div className="consumption-wrapper">
        <ConsumptionChart
          data={chartData}
          showConsumption={showConsumption}
          showCost={showCost}
        />
      </div>
    </>
  );
};

export default React.memo(ConsumptionView);
