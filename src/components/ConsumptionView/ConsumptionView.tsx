import { Button, List, ThemeIcon, Title } from "@mantine/core";
import {
  IconArrowBack,
  IconCurrencyKroneDanish,
  IconDevices,
  IconRefresh,
  IconSun,
} from "@tabler/icons";
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

      <div>
        <Title order={4}>This month</Title>
        <List title="This month" spacing="xs" size="sm">
          <List.Item
            icon={
              <ThemeIcon color="blue" size={24} radius="md">
                <IconSun size={16} />
              </ThemeIcon>
            }
          >
            Consumed: <b>{consumedKw} kW</b>
          </List.Item>
          <List.Item
            icon={
              <ThemeIcon color="blue" size={24} radius="md">
                <IconCurrencyKroneDanish size={16} />
              </ThemeIcon>
            }
          >
            Average kilowatt price: <b>{averagePrice.toFixed(2)} kr</b>
          </List.Item>
          <List.Item
            icon={
              <ThemeIcon color="blue" size={24} radius="md">
                <IconDevices size={16} />
              </ThemeIcon>
            }
          >
            Price for device <b>{priceForDevice.toFixed(2)} kr</b>
          </List.Item>
        </List>
      </div>

      <ConsumptionChart data={chartData} />
    </>
  );
};

export default ConsumptionView;
