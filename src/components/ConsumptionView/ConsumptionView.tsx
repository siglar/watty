import { FC, useState } from 'react';
import ConsumptionChart from '../ConsumptionChart/ConsumptionChart';
import './ConsumptionView.css';
import { calculateAveragePrice, calculateElectricitySupport } from '../../helpers/tibber.helper';
import { ChartData } from '../../models/chart.models';
import SummaryList from '../SummaryList/SummaryList';
import ConsumptionHeader from '../ConsumptionHeader/ConsumptionHeader';
import { LoadingOverlay } from '@mantine/core';
import { useOptionsContext } from '../../context/options.context';
import React from 'react';
import { DrawerContextProvider } from '../../context/drawer.context';
import { ConsumptionDay } from '../../models/Watty/consumptionDay';
import { Consumption } from '../../models/Watty/consumption';
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
      consumption: c.consumption.reduce((partialSum, a) => partialSum + a.kwh, 0),
      cost: c.priceForDay,
      date: format(new Date(c.date), 'dd.MMM'),
      kWPrice: c.consumption.reduce((partialSum, a) => partialSum + a.nokPerKWh, 0) / c.consumption.length
    } as ChartData;
  });

  const [showCost, setShowCost] = useState<boolean>(true);
  const [showConsumption, setShowConsumption] = useState<boolean>(false);

  // const averagePrice = calculateAveragePrice(tibberData);

  // const consumedKw = shellyConsumption.data.total ?? 0;

  // const dayPrices = tibberData.data.viewer.home.consumption.nodes.map((n) => {
  //   return {
  //     date: format(new Date(n.from), 'dd.MMM'),
  //     cost: n.unitPrice
  //   };
  // });

  // const chartData: ChartData[] = shellyConsumption.data.history
  //   .filter((history) => history.consumption > 0)
  //   .map((history) => {
  //     const shellyDate = format(new Date(history.datetime), 'dd.MMM');

  //     const dayConsumption = history.consumption / 1000;

  //     const dayPrice = dayPrices.find((dp) => dp.date === shellyDate)?.cost ?? averagePrice / 100;

  //     const dayCost = withElectricitySupport
  //       ? calculateElectricitySupport(dayPrice * 100, dayConsumption, dayConsumption * dayPrice)
  //       : dayConsumption * dayPrice;

  //     return {
  //       date: shellyDate,
  //       cost: dayCost,
  //       kWPrice: dayPrice,
  //       consumption: dayConsumption
  //     };
  //   });

  // const getTotal = () => {
  //   const allCosts = chartData.map((c) => c.cost);
  //   return allCosts.reduce((pv, cv) => pv + cv, 0);
  // };

  // const priceForDevice = getTotal();

  return (
    <>
      <DrawerContextProvider>
        <div className="options-container">
          <LoadingOverlay visible={loading} overlayBlur={1} />

          {/* <SummaryList averagePrice={averagePrice} consumedKw={consumedKw} priceForDevice={priceForDevice} /> */}

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
