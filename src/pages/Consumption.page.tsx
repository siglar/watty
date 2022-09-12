import { Loader, LoadingOverlay } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { FC } from "react";
import { useShellyEndpoint } from "../api/shelly.service";
import { useTibberEndpoint } from "../api/tibber.service";
import ConsumptionView from "../components/ConsumptionView/ConsumptionView";

interface ConsumptionPageProps {
  month: number;
}

const ConsumptionPage: FC<ConsumptionPageProps> = (
  props: ConsumptionPageProps
) => {
  const { month } = props;

  const { getConsumption } = useShellyEndpoint();
  const { getAveragePrice } = useTibberEndpoint();

  const {
    data: shellyConsumption,
    refetch: refetchShelly,
    isRefetching: shellyFetching,
  } = useQuery(
    ["SHELLY, CONSUMPTION", month],
    async () => await getConsumption(month)
  );

  const {
    data: averagePrice,
    refetch: refetchTibber,
    isRefetching: tibberFetching,
  } = useQuery(
    ["TIBBER, CONSUMPTION", month],
    async () => await getAveragePrice(month)
  );

  const refetch = () => {
    refetchShelly();
    refetchTibber();
  };

  if (!shellyConsumption || !averagePrice) return <Loader />;

  if (shellyConsumption.data.total <= 0)
    return <p>No data for selected period</p>;

  return (
    <>
      <LoadingOverlay
        visible={shellyFetching || tibberFetching}
        overlayBlur={1}
      />

      <ConsumptionView
        averagePrice={averagePrice}
        shellyConsumption={shellyConsumption}
        refetch={refetch}
      />
    </>
  );
};

export default ConsumptionPage;
