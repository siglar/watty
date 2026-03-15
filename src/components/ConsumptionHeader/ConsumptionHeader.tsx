import { Switch } from '@mantine/core';
import { FC } from 'react';
import { useOptionsContext } from '../../context/options.context';
import styles from './ConsumptionHeader.module.css';

const ConsumptionHeader: FC = () => {
  const { useNorgespris, setUseNorgespris } = useOptionsContext();

  return (
    <div className={styles.consumptionHeader}>
      <Switch
        label="Use Norgespris"
        checked={useNorgespris}
        onChange={(e) => setUseNorgespris(e.currentTarget.checked)}
      />
    </div>
  );
};

export default ConsumptionHeader;
