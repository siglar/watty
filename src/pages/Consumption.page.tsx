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

  const { data: consumption, isLoading: consumptionLoading } = useQuery(
    ['WATTY', 'CONSUMPTION', 'NO5', 'Day', deviceId, year, month],
    async () => await getConsumption('NO5', 'Day', deviceId, year, month),
    { enabled: Boolean(tokens.wattyToken) }
  );

  if (!consumption || consumptionLoading) return <Loader />;

  localStorage.setItem('device', deviceId);

  return (
    <>
      {consumption.length <= 0 ? (
        <p>No data for selected period</p>
      ) : (
        <ConsumptionView loading={consumptionLoading} consumption={consumption} />
      )}

      <MonthPicker month={month} setMonth={setMonth} year={year} setYear={setYear} />
    </>
  );
};

export default ConsumptionPage;
