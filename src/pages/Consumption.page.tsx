import { Loader, LoadingOverlay } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { FC } from "react";
import { useShellyEndpoint } from "../api/shelly.service";
import { useTibberEndpoint } from "../api/tibber.service";
import ConsumptionView from "../components/ConsumptionView/ConsumptionView";

const ConsumptionPage: FC = () => {
  const { getConsumption } = useShellyEndpoint();
  const { getAveragePrice } = useTibberEndpoint();

  const {
    data: shellyConsumption,
    refetch: refetchShelly,
    isRefetching: shellyFetching,
  } = useQuery(["SHELLY, CONSUMPTION"], async () => await getConsumption());

  var today = new Date();
  var days = Number.parseInt(String(today.getDate()).padStart(2, "0"));

  const {
    data: averagePrice,
    refetch: refetchTibber,
    isRefetching: tibberFetching,
  } = useQuery(
    ["TIBBER, CONSUMPTION"],
    async () => await getAveragePrice(days)
  );

  const refetch = () => {
    refetchShelly();
    refetchTibber();
  };

  if (!shellyConsumption || !averagePrice) return <Loader />;

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
