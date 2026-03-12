import { FC, useState } from 'react';
import ConsumptionChart from '../ConsumptionChart/ConsumptionChart';
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
import styles from './ConsumptionView.module.css';

interface ConsumptionViewProps {
  consumption: ConsumptionDay[];
  loading: boolean;
  fastleddKrPerMonth: number;
}

const ConsumptionView: FC<ConsumptionViewProps> = (props: ConsumptionViewProps) => {
  const { consumption, loading, fastleddKrPerMonth } = props;

  const { withElectricitySupport } = useOptionsContext();

  const chartData: ChartData[] = consumption.map((c) => {
    const totalCost = withElectricitySupport
      ? calculateElectricitySupport(c.averageKwhPrice * 100, c.totalConsumptionInKwh, c.totalPriceForDay)
      : c.totalPriceForDay;
    const consumptionKwh = c.totalConsumptionInKwh;
    const totalKwhPrice = consumptionKwh > 0 ? totalCost / consumptionKwh : 0;
    return {
      consumption: consumptionKwh,
      spotPriceCost: c.totalSpotPriceCost,
      nettleieCost: c.totalNettleieCost,
      cost: totalCost,
      date: format(new Date(c.date), 'dd.MMM'),
      spotKwhPrice: c.averageSpotPricePerKwh,
      nettleieKwhPrice: c.averageNettleiePricePerKwh,
      totalKwhPrice
    } as ChartData;
  });

  const [showCost, setShowCost] = useState<boolean>(true);
  const [showConsumption, setShowConsumption] = useState<boolean>(false);

  const consumedKw = Number(consumption.reduce((pv, cv) => pv + cv.totalConsumptionInKwh, 0).toFixed(2));
  const priceForDevice = Number(chartData.reduce((pv, cv) => pv + cv.cost, 0).toFixed(2));
  const averagePrice = Number(((consumption.reduce((pv, cv) => pv + cv.averageKwhPrice, 0) / consumption.length) * 100).toFixed(2));

  return (
    <>
      <DrawerContextProvider>
        <div className={styles.optionsContainer}>
          <LoadingOverlay visible={loading} overlayProps={{ blur: 1 }} />

          <SummaryList
            averagePrice={averagePrice}
            consumedKw={consumedKw}
            priceForDevice={priceForDevice}
            fastleddKrPerMonth={fastleddKrPerMonth}
          />

          <ConsumptionHeader
            setShowConsumption={setShowConsumption}
            setShowCost={setShowCost}
            showConsumption={showConsumption}
            showCost={showCost}
          />
        </div>

        <div className={styles.consumptionWrapper}>
          <ConsumptionChart data={chartData} showConsumption={showConsumption} showCost={showCost} />
        </div>
      </DrawerContextProvider>
    </>
  );
};

export default React.memo(ConsumptionView);
