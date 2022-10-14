import { FC, useState } from "react";
import ConsumptionChart from "../ConsumptionChart/ConsumptionChart";
import "./ConsumptionView.css";
import { format, parse } from "date-fns";
import { ShellyRoot } from "../../models/shelly.models";
import { TibberRoot } from "../../models/tibber.models";
import { calculateAveragePrice } from "../../helpers/tibber.helper";
import { ChartData } from "../../models/chart.models";
import SummaryList from "../SummaryList/SummaryList";
import NavigationRow from "../NavigationRow/NavigationRow";
import ConsumptionHeader from "../ConsumptionHeader/ConsumptionHeader";
import { LoadingOverlay } from "@mantine/core";

interface ConsumptionViewProps {
  shellyConsumption: ShellyRoot;
  tibberData: TibberRoot;
  loading: boolean;
}

const ConsumptionView: FC<ConsumptionViewProps> = (
  props: ConsumptionViewProps
) => {
  const { shellyConsumption, tibberData, loading } = props;

  const [showCost, setShowCost] = useState<boolean>(true);
  const [showConsumption, setShowConsumption] = useState<boolean>(false);

  const averagePrice = calculateAveragePrice(tibberData);

  const consumedKw = shellyConsumption.data.total ?? 0;

  const priceForDevice = shellyConsumption.data.total * averagePrice;

  const dayPrices = tibberData.data.viewer.home.consumption.nodes.map((n) => {
    return {
      date: format(new Date(n.to), "dd.MMM"),
      cost: n.unitPrice,
    };
  });

  const chartData: ChartData[] = shellyConsumption.data.history
    .filter((h) => h.consumption > 0)
    .map((h) => {
      const shellyDate = format(new Date(h.datetime), "dd.MMM");

      const dayPrice =
        dayPrices.find((dp) => dp.date === shellyDate)?.cost ?? averagePrice;

      return {
        date: shellyDate,
        cost: Number.parseFloat(((h.consumption / 1000) * dayPrice).toFixed(2)),
        kWPrice: Number.parseFloat(dayPrice.toFixed(2)),
        consumption: Number.parseFloat((h.consumption / 1000).toFixed(2)),
      };
    });

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

export default ConsumptionView;
