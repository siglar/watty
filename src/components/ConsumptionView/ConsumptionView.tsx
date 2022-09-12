import { Button } from "@mantine/core";
import { IconArrowBack, IconRefresh } from "@tabler/icons";
import { FC } from "react";
import { useAuthContext } from "../../context/auth.context";
import ConsumptionChart from "../ConsumptionChart/ConsumptionChart";
import "./ConsumptionView.css";
import { format } from "date-fns";
import { ShellyRoot } from "../../models/shelly.models";

interface ConsumptionViewProps {
  shellyConsumption: ShellyRoot;
  averagePrice: number;
  refetch: () => void;
}

const ConsumptionView: FC<ConsumptionViewProps> = (
  props: ConsumptionViewProps
) => {
  const { shellyConsumption, averagePrice, refetch } = props;

  const { setLoggedIntoShelly } = useAuthContext();

  const consumedKw = shellyConsumption.data.total ?? 0;

  const priceForDevice = shellyConsumption.data.total * averagePrice;

  const chartData = shellyConsumption.data.history
    .filter((h) => h.consumption > 0)
    .map((h) => {
      return {
        date: format(new Date(h.datetime), "dd.MMM"),
        cost: Number.parseFloat(
          ((h.consumption / 1000) * averagePrice).toFixed(2)
        ),
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
