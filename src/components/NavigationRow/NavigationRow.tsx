import { Button } from '@mantine/core';
import { IconArrowBack } from '@tabler/icons';
import { FC } from 'react';
import { useNavigate } from 'react-router';

const NavigationRow: FC = () => {
  const navigate = useNavigate();

  const backToLogin = () => {
    navigate('/');
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
