import { FC } from 'react';
import LogIn from '../components/LogIn/LogIn';
import LoginHeader from '../components/LogIn/LogInHeader/LoginHeader';

const LandingPage: FC = () => {
  return (
    <LoginHeader>
      <LogIn />
    </LoginHeader>
  );
};

export default LandingPage;
