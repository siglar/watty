import { Loader } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { FC } from "react";
import { useShellyEndpoint } from "../api/shelly.service";
import { useTibberEndpoint } from "../api/tibber.service";
import ConsumptionView from "../components/ConsumptionView/ConsumptionView";
import { useAuthContext } from "../context/auth.context";
import { Direction } from "../enums/direction.enum";

interface ConsumptionPageProps {
  month: number;
  direction: Direction;
}

const ConsumptionPage: FC<ConsumptionPageProps> = (
  props: ConsumptionPageProps
) => {
  const { month, direction } = props;

  const { homeId } = useAuthContext();
  const { getConsumption } = useShellyEndpoint();
  const { getTibberConsumption } = useTibberEndpoint();

  const { data: shellyConsumption, isRefetching: shellyLoading } = useQuery(
    ["SHELLY, CONSUMPTION", month, homeId],
    async () => await getConsumption(month),
    {
      keepPreviousData: true,
    }
  );

  const { data: tibberData, isRefetching: tibberLoading } = useQuery(
    ["TIBBER, CONSUMPTION", month, homeId],
    async () => await getTibberConsumption(month, direction),
    {
      keepPreviousData: true,
    }
  );

  if (!shellyConsumption || !tibberData) return <Loader />;

  if (
    shellyConsumption.data.total <= 0 ||
    !tibberData.data.viewer.home.consumption
  )
    return <p>No data for selected period</p>;

  return (
    <>
      <ConsumptionView
        loading={shellyLoading || tibberLoading}
        tibberData={tibberData}
        shellyConsumption={shellyConsumption}
      />
    </>
  );
};

export default ConsumptionPage;
