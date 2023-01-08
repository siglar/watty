import { Button, Switch } from '@mantine/core';
import { GoogleLogin } from '@react-oauth/google';
import { IconArrowBack } from '@tabler/icons';
import { FC } from 'react';
import { useAuthContext } from '../../context/auth.context';
import { useOptionsContext } from '../../context/options.context';
import './NavigationRow.css';

const NavigationRow: FC = () => {
  const { setLoggedIntoShelly } = useAuthContext();
  const { withElectricitySupport, setWithElectricitySupport } = useOptionsContext();

  const backToLogin = () => {
    setLoggedIntoShelly(false);
  };

  return (
    <>
      <div className="button-row">
        <div className="button-row-left">
          <Button onClick={() => backToLogin()} leftIcon={<IconArrowBack />} variant="subtle">
            Back to login
          </Button>
          <Switch
            label="With electricity support"
            checked={withElectricitySupport}
            onChange={(e) => setWithElectricitySupport(e.currentTarget.checked)}
          />
        </div>
        <div className="button-row-right">
          <GoogleLogin
            onSuccess={(credentialResponse) => {
              console.log(credentialResponse);
            }}
            onError={() => {
              console.log('Login Failed');
            }}
          />
        </div>
      </div>
    </>
  );
};

export default NavigationRow;
