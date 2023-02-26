import { Loader } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import { FC, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useWattyEndpoint } from '../api/watty.service';
import ConsumptionView from '../components/ConsumptionView/ConsumptionView';
import MonthPicker from '../components/MonthPicker/MonthPicker';
import { useAuthContext } from '../context/auth.context';

const ConsumptionPage: FC = () => {
  const navigate = useNavigate();
  const { deviceId } = useParams();

  const [month, setMonth] = useState<number>(new Date().getMonth());
  const [year, setYear] = useState<number>(new Date().getFullYear());

  const { tokens } = useAuthContext();
  const { getConsumption } = useWattyEndpoint();

  if (!deviceId) {
    navigate('/');
    return null;
  }

  const {
    data: consumption,
    isLoading: consumptionLoading,
    isRefetching: consumptionRefetching
  } = useQuery(
    ['WATTY', 'CONSUMPTION', 'NO5', 'Hour', deviceId, year, month],
    async () => await getConsumption('NO5', 'Hour', deviceId, year, month),
    { enabled: Boolean(tokens.wattyToken), keepPreviousData: true }
  );

  localStorage.setItem('device', deviceId);

  if (consumptionLoading) return <Loader />;

  return (
    <>
      {!consumption ? <p>No data for selected period</p> : <ConsumptionView loading={consumptionRefetching} consumption={consumption} />}

      <MonthPicker month={month} setMonth={setMonth} year={year} setYear={setYear} />
    </>
  );
};

export default ConsumptionPage;
