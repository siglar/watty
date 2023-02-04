import { FC, useState } from 'react';
import LogIn from '../components/LogIn/LogIn';
import ShellyLogin from '../components/ShellyLogin/ShellyLogin';
import LoginHeader from '../components/LogIn/LogInHeader/LoginHeader';

const LandingPage: FC = () => {
  const [skipLogin, setSkipLogin] = useState(false);

  return <LoginHeader>{skipLogin ? <ShellyLogin /> : <LogIn />}</LoginHeader>;
};

export default LandingPage;
