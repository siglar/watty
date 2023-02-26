import { FC, useState } from 'react';
import ConsumptionChart from '../ConsumptionChart/ConsumptionChart';
import './ConsumptionView.css';
import { calculateElectricitySupport } from '../../helpers/strom.helper';
import { ChartData } from '../../models/chart.models';
import SummaryList from '../SummaryList/SummaryList';
import ConsumptionHeader from '../ConsumptionHeader/ConsumptionHeader';
import { LoadingOverlay } from '@mantine/core';
import { useOptionsContext } from '../../context/options.context';
import React from 'react';
import { DrawerContextProvider } from '../../context/drawer.context';
import { ConsumptionDay } from '../../models/Watty/consumptionDay';
import { format } from 'date-fns';

interface ConsumptionViewProps {
  consumption: ConsumptionDay[];
  loading: boolean;
}

const ConsumptionView: FC<ConsumptionViewProps> = (props: ConsumptionViewProps) => {
  const { consumption, loading } = props;

  const { withElectricitySupport } = useOptionsContext();

  const chartData: ChartData[] = consumption.map((c) => {
    return {
      consumption: c.totalConsumptionInKwh,
      cost: withElectricitySupport
        ? calculateElectricitySupport(c.averageKwhPrice * 100, c.totalConsumptionInKwh, c.totalPriceForDay)
        : c.totalPriceForDay,
      date: format(new Date(c.date), 'dd.MMM'),
      kWPrice: c.averageKwhPrice
    } as ChartData;
  });

  const [showCost, setShowCost] = useState<boolean>(true);
  const [showConsumption, setShowConsumption] = useState<boolean>(false);

  const consumedKw = Number(consumption.reduce((pv, cv) => pv + cv.totalConsumptionInKwh, 0).toFixed(2));
  const priceForDevice = Number(consumption.reduce((pv, cv) => pv + cv.totalPriceForDay, 0).toFixed(2));
  const averagePrice = Number(((consumption.reduce((pv, cv) => pv + cv.averageKwhPrice, 0) / consumption.length) * 100).toFixed(2));

  return (
    <>
      <DrawerContextProvider>
        <div className="options-container">
          <LoadingOverlay visible={loading} overlayBlur={1} />

          <SummaryList averagePrice={averagePrice} consumedKw={consumedKw} priceForDevice={priceForDevice} />

          <ConsumptionHeader
            setShowConsumption={setShowConsumption}
            setShowCost={setShowCost}
            showConsumption={showConsumption}
            showCost={showCost}
          />
        </div>

        <div className="consumption-wrapper">
          <ConsumptionChart data={chartData} showConsumption={showConsumption} showCost={showCost} />
        </div>
      </DrawerContextProvider>
    </>
  );
};

export default React.memo(ConsumptionView);
