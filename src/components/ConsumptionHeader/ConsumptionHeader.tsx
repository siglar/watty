import { Switch } from '@mantine/core';
import { FC } from 'react';
import { useOptionsContext } from '../../context/options.context';
import './ConsumptionHeader.css';

interface ConsumptionHeaderProps {
  showCost: boolean;
  setShowCost: (state: boolean) => void;
  showConsumption: boolean;
  setShowConsumption: (state: boolean) => void;
}

const ConsumptionHeader: FC<ConsumptionHeaderProps> = (props: ConsumptionHeaderProps) => {
  const { showCost, setShowCost, setShowConsumption, showConsumption } = props;

  const { withElectricitySupport, setWithElectricitySupport } = useOptionsContext();

  return (
    <div className="consumption-header">
      <Switch
        label="With electricity support"
        checked={withElectricitySupport}
        onChange={(e) => setWithElectricitySupport(e.currentTarget.checked)}
      />
      <Switch label="Show cost (kr)" checked={showCost} onChange={(e) => setShowCost(e.target.checked)} />
      <Switch label="Show consumption (kWh)" checked={showConsumption} onChange={(e) => setShowConsumption(e.target.checked)} />
    </div>
  );
};

export default ConsumptionHeader;
