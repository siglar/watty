import { Loader } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import { FC } from 'react';
import { useShellyEndpoint } from '../api/shelly.service';
import { useTibberEndpoint } from '../api/tibber.service';
import ConsumptionView from '../components/ConsumptionView/ConsumptionView';
import { useAuthContext } from '../context/auth.context';

interface ConsumptionPageProps {
  month: number;
  year: number;
}

const ConsumptionPage: FC<ConsumptionPageProps> = (props: ConsumptionPageProps) => {
  const { month, year } = props;

  const { homeId, device } = useAuthContext();
  const { getConsumption } = useShellyEndpoint();
  const { getTibberConsumption } = useTibberEndpoint();

  const { data: shellyConsumption, isRefetching: shellyLoading } = useQuery(
    ['SHELLY, CONSUMPTION', year, month, homeId, device],
    async () => await getConsumption(year, month),
    {
      keepPreviousData: true
    }
  );

  const { data: tibberData, isRefetching: tibberLoading } = useQuery(
    ['TIBBER, CONSUMPTION', year, month, homeId, device],
    async () => await getTibberConsumption(year, month),
    {
      keepPreviousData: true
    }
  );

  if (!shellyConsumption || !tibberData) return <Loader />;

  if (shellyConsumption.data.total <= 0 || !tibberData.data.viewer.home.consumption) return <p>No data for selected period</p>;

  return (
    <>
      <ConsumptionView loading={shellyLoading || tibberLoading} tibberData={tibberData} shellyConsumption={shellyConsumption} />
    </>
  );
};

export default ConsumptionPage;
