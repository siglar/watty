import { Button, Switch } from '@mantine/core';
import { IconArrowBack } from '@tabler/icons';
import { FC } from 'react';
import { useAuthContext } from '../../context/auth.context';
import { useOptionsContext } from '../../context/options.context';

const NavigationRow: FC = () => {
  const { setLoggedIntoShelly } = useAuthContext();
  const { withElectricitySupport, setWithElectricitySupport } = useOptionsContext();

  const backToLogin = () => {
    setLoggedIntoShelly(false);
  };

  return (
    <>
      <div className="button-row">
        <Button onClick={() => backToLogin()} leftIcon={<IconArrowBack />} variant="subtle">
          Back to login
        </Button>
        <Switch
          label="With electricity support"
          checked={withElectricitySupport}
          onChange={(e) => setWithElectricitySupport(e.currentTarget.checked)}
        />
      </div>
    </>
  );
};

export default NavigationRow;
