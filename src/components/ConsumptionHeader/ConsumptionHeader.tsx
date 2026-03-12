import { Switch } from '@mantine/core';
import { FC } from 'react';
import { useOptionsContext } from '../../context/options.context';
import styles from './ConsumptionHeader.module.css';

interface ConsumptionHeaderProps {
  showCost: boolean;
  setShowCost: (state: boolean) => void;
  showConsumption: boolean;
  setShowConsumption: (state: boolean) => void;
}

const ConsumptionHeader: FC<ConsumptionHeaderProps> = (props: ConsumptionHeaderProps) => {
  const { showCost, setShowCost, setShowConsumption, showConsumption } = props;

  const { useNorgespris, setUseNorgespris } = useOptionsContext();

  return (
    <div className={styles.consumptionHeader}>
      <Switch
        label="Use Norgespris"
        checked={useNorgespris}
        onChange={(e) => setUseNorgespris(e.currentTarget.checked)}
      />
      <Switch label="Show cost (kr)" checked={showCost} onChange={(e) => setShowCost(e.target.checked)} />
      <Switch label="Show consumption (kWh)" checked={showConsumption} onChange={(e) => setShowConsumption(e.target.checked)} />
    </div>
  );
};

export default ConsumptionHeader;
