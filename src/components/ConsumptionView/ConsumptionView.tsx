import { Button } from "@mantine/core";
import { IconArrowBack, IconRefresh } from "@tabler/icons";
import { FC } from "react";
import { useAuthContext } from "../../context/auth.context";
import ConsumptionChart from "../ConsumptionChart/ConsumptionChart";
import "./ConsumptionView.css";
import { format } from "date-fns";
import { ShellyRoot } from "../../models/shelly.models";
import { TibberRoot } from "../../models/tibber.models";
import { calculateAveragePrice } from "../../helpers/tibber.helper";
import { ChartData } from "../../models/chart.models";

interface ConsumptionViewProps {
  shellyConsumption: ShellyRoot;
  tibberData: TibberRoot;
  refetch: () => void;
}

const ConsumptionView: FC<ConsumptionViewProps> = (
  props: ConsumptionViewProps
) => {
  const { shellyConsumption, tibberData, refetch } = props;

  const { setLoggedIntoShelly } = useAuthContext();

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
      <div className="button-row">
        <Button
          onClick={() => setLoggedIntoShelly(false)}
          leftIcon={<IconArrowBack />}
          variant="subtle"
        >
          Back to login
        </Button>
        <Button
          onClick={() => refetch()}
          leftIcon={<IconRefresh />}
          variant="subtle"
        >
          Refresh
        </Button>
      </div>

      <article>
        <p>Consumed kilowatts: {consumedKw} kW</p>
        <p>Average kilowatt price: {averagePrice.toFixed(2)} kr</p>
        <p>Price for device {priceForDevice.toFixed(2)} kr</p>
      </article>

      <ConsumptionChart data={chartData} />
    </>
  );
};

export default ConsumptionView;
