import { FC, useState } from 'react';
import ConsumptionChart from '../ConsumptionChart/ConsumptionChart';
import { NORGESPRIS_NOK_PER_KWH } from '../../helpers/strom.helper';
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

  const { useNorgespris } = useOptionsContext();

  const chartData: ChartData[] = consumption.map((c) => {
    const consumptionKwh = c.totalConsumptionInKwh;
    const spotPriceCost = useNorgespris
      ? consumptionKwh * NORGESPRIS_NOK_PER_KWH
      : c.totalSpotPriceCost;
    const totalCost = spotPriceCost + c.totalNettleieCost;
    const spotKwhPrice = useNorgespris
      ? NORGESPRIS_NOK_PER_KWH
      : c.averageSpotPricePerKwh;
    const totalKwhPrice = consumptionKwh > 0 ? totalCost / consumptionKwh : 0;

    return {
      consumption: consumptionKwh,
      spotPriceCost,
      nettleieCost: c.totalNettleieCost,
      cost: totalCost,
      date: format(new Date(c.date), 'dd.MMM'),
      spotKwhPrice,
      nettleieKwhPrice: c.averageNettleiePricePerKwh,
      totalKwhPrice
    } as ChartData;
  });

  const [showCost, setShowCost] = useState<boolean>(true);
  const [showConsumption, setShowConsumption] = useState<boolean>(false);

  const consumedKw = Number(consumption.reduce((pv, cv) => pv + cv.totalConsumptionInKwh, 0).toFixed(2));
  const priceForDevice = Number(chartData.reduce((pv, cv) => pv + cv.cost, 0).toFixed(2));
  const averagePrice =
    chartData.length > 0
      ? Number(
          (
            (chartData.reduce((pv, cv) => pv + cv.totalKwhPrice, 0) / chartData.length) *
            100
          ).toFixed(2)
        )
      : 0;

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
