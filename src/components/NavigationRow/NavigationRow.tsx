import { Button } from '@mantine/core';
import { IconArrowBack } from '@tabler/icons';
import { FC } from 'react';
import { useAuthContext } from '../../context/auth.context';

const NavigationRow: FC = () => {
  const { setLoggedIntoShelly } = useAuthContext();

  const backToLogin = () => {
    setLoggedIntoShelly(false);
  };

  return (
    <>
      <div className="button-row">
        <Button onClick={() => backToLogin()} leftIcon={<IconArrowBack />} variant="subtle">
          Back to login
        </Button>
      </div>
    </>
  );
};

export default NavigationRow;
