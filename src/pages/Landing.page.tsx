import { FC, useState } from 'react';
import ShellyLogin from '../components/ShellyLogin/ShellyLogin';
import { useAuthContext } from '../context/auth.context';
import ConsumptionPage from './Consumption.page';
import MonthPicker from '../components/MonthPicker/MonthPicker';

const LandingPage: FC = () => {
  const { loggedIntoShelly } = useAuthContext();

  const [month, setMonth] = useState<number>(new Date().getMonth());
  const [year, setYear] = useState<number>(new Date().getFullYear());

  if (!loggedIntoShelly) return <ShellyLogin />;

  return (
    <>
      <ConsumptionPage month={month} year={year} />
      <MonthPicker month={month} setMonth={setMonth} year={year} setYear={setYear} />
    </>
  );
};

export default LandingPage;
