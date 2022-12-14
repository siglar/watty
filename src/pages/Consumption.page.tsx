import { Loader } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import { FC, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useShellyEndpoint } from '../api/shelly.service';
import { useTibberEndpoint } from '../api/tibber.service';
import ConsumptionView from '../components/ConsumptionView/ConsumptionView';
import MonthPicker from '../components/MonthPicker/MonthPicker';
import { useAuthContext } from '../context/auth.context';

const ConsumptionPage: FC = () => {
  const navigate = useNavigate();
  const { deviceId } = useParams();

  const [month, setMonth] = useState<number>(new Date().getMonth());
  const [year, setYear] = useState<number>(new Date().getFullYear());

  const { homeId } = useAuthContext();
  const { getConsumption } = useShellyEndpoint();
  const { getTibberConsumption } = useTibberEndpoint();

  if (!deviceId) {
    navigate('/');
    return null;
  }

  const { data: shellyConsumption, isRefetching: shellyLoading } = useQuery(
    ['SHELLY, CONSUMPTION', year, month, homeId, deviceId],
    async () => await getConsumption(deviceId, year, month),
    {
      keepPreviousData: true
    }
  );

  const { data: tibberData, isRefetching: tibberLoading } = useQuery(
    ['TIBBER, CONSUMPTION', year, month, homeId, deviceId],
    async () => await getTibberConsumption(year, month),
    {
      keepPreviousData: true
    }
  );

  if (!shellyConsumption || !tibberData) return <Loader />;

  localStorage.setItem('device', deviceId);

  return (
    <>
      {shellyConsumption.data.total <= 0 || !tibberData.data.viewer.home.consumption ? (
        <p>No data for selected period</p>
      ) : (
        <ConsumptionView loading={shellyLoading || tibberLoading} tibberData={tibberData} shellyConsumption={shellyConsumption} />
      )}

      <MonthPicker month={month} setMonth={setMonth} year={year} setYear={setYear} />
    </>
  );
};

export default ConsumptionPage;
