import { Loader, LoadingOverlay } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { FC } from "react";
import { useShellyEndpoint } from "../api/shelly.service";
import { useTibberEndpoint } from "../api/tibber.service";
import ConsumptionView from "../components/ConsumptionView/ConsumptionView";
import { Direction } from "../enums/direction.enum";

interface ConsumptionPageProps {
  month: number;
  direction: Direction;
}

const ConsumptionPage: FC<ConsumptionPageProps> = (
  props: ConsumptionPageProps
) => {
  const { month, direction } = props;

  const { getConsumption } = useShellyEndpoint();
  const { getTibberConsumption } = useTibberEndpoint();

  const { data: shellyConsumption, isRefetching: shellyFetching } = useQuery(
    ["SHELLY, CONSUMPTION", month],
    async () => await getConsumption(month)
  );

  const { data: tibberData, isRefetching: tibberFetching } = useQuery(
    ["TIBBER, CONSUMPTION", month],
    async () => await getTibberConsumption(month, direction)
  );

  if (!shellyConsumption || !tibberData) return <Loader />;

  if (shellyConsumption.data.total <= 0)
    return <p>No data for selected period</p>;

  return (
    <>
      <LoadingOverlay
        visible={shellyFetching || tibberFetching}
        overlayBlur={1}
      />

      <ConsumptionView
        tibberData={tibberData}
        shellyConsumption={shellyConsumption}
      />
    </>
  );
};

export default ConsumptionPage;
