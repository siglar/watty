import React, { FC } from 'react';
import {
  Bar,
  ComposedChart,
  LabelList,
  Line,
  ResponsiveContainer,
  Tooltip,
  TooltipContentProps,
  XAxis
} from 'recharts';
import type { RenderableText } from 'recharts';
import { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';
import { ChartData } from '../../models/chart.models';
import CustomDot from './CustomDot';
import { useMantineColorScheme } from '@mantine/core';

interface ConsumptionChartProps {
  data: ChartData[];
  showCost: boolean;
  showConsumption: boolean;
}

const SPOT_COLOR = '#2563EB';
const NETTLEIE_COLOR = '#059669';
const TOTAL_COLOR = '#EA580C';

const ConsumptionChart: FC<ConsumptionChartProps> = (props: ConsumptionChartProps) => {
  const { data, showConsumption, showCost } = props;

  const { colorScheme } = useMantineColorScheme();
  const dark = colorScheme === 'dark';

  const renderTooltip = (content: TooltipContentProps<ValueType, NameType>) => {
    if (content.payload && content.payload.length > 0) {
      return (
        <article
          style={{
            border: '#bbb 1.5px solid'
          }}
        >
          <p
            style={{
              margin: '0 0',
              padding: '3px 7.5px',
              backgroundColor: dark ? '#2E2E2E' : 'white',
              borderBottom: '#bbb 1.5px solid'
            }}
          >
            {content.payload[0].payload.date}
          </p>
          <p
            style={{
              margin: '0 0',
              padding: '3px 7.5px',
              backgroundColor: dark ? '#2E2E2E' : 'white',
              color: SPOT_COLOR
            }}
          >
            Spot: {content.payload[0].payload.spotPriceCost.toFixed(2)} kr
          </p>
          <p
            style={{
              margin: '0 0',
              padding: '3px 7.5px',
              backgroundColor: dark ? '#2E2E2E' : 'white',
              color: NETTLEIE_COLOR
            }}
          >
            Nettleie: {content.payload[0].payload.nettleieCost.toFixed(2)} kr
          </p>
          <p
            style={{
              margin: '0 0',
              padding: '3px 7.5px',
              backgroundColor: dark ? '#2E2E2E' : 'white',
              color: TOTAL_COLOR
            }}
          >
            Total: {content.payload[0].payload.cost.toFixed(2)} kr
          </p>
          <p
            style={{
              margin: '0 0',
              padding: '3px 7.5px',
              backgroundColor: dark ? '#2E2E2E' : 'white',
              color: '#1971C2'
            }}
          >
            Consumption: {content.payload[0].payload.consumption.toFixed(2)} kWh
          </p>
          <p
            style={{
              margin: '0 0',
              padding: '3px 7.5px',
              backgroundColor: dark ? '#2E2E2E' : 'white',
              color: SPOT_COLOR
            }}
          >
            Kilowatt price (spot): {(content.payload[0].payload.spotKwhPrice * 100).toFixed(1)} øre
          </p>
          <p
            style={{
              margin: '0 0',
              padding: '3px 7.5px',
              backgroundColor: dark ? '#2E2E2E' : 'white',
              color: NETTLEIE_COLOR
            }}
          >
            Kilowatt price (nettleie): {(content.payload[0].payload.nettleieKwhPrice * 100).toFixed(1)} øre
          </p>
          <p
            style={{
              margin: '0 0',
              padding: '3px 7.5px',
              backgroundColor: dark ? '#2E2E2E' : 'white',
              color: TOTAL_COLOR
            }}
          >
            Kilowatt price (total): {(content.payload[0].payload.totalKwhPrice * 100).toFixed(1)} øre
          </p>
        </article>
      );
    }
    return null;
  };

  const labelFormatter = (label: RenderableText): RenderableText => {
    if (typeof label === 'number') {
      return label.toFixed(0);
    }
    return label;
  };

  return (
    <ResponsiveContainer width="100%" height={240}>
      <ComposedChart height={400} data={data}>
        <XAxis dataKey="date" />
        <Tooltip content={(content) => renderTooltip(content)} />

        <Bar animationDuration={250} hide={!showConsumption} dataKey="consumption" barSize={20} fill="#413ea0">
          {!showCost && (
            <LabelList
              style={{ fontSize: '12px' }}
              fill={'#ffffff'}
              dataKey="consumption"
              position="insideTop"
              formatter={labelFormatter}
            />
          )}
        </Bar>
        <Line
          animationDuration={250}
          hide={!showCost}
          type="monotone"
          dataKey="spotPriceCost"
          name="Spot"
          stroke={SPOT_COLOR}
          dot={showConsumption ? undefined : <CustomDot />}
          activeDot={showConsumption}
        />
        <Line
          animationDuration={250}
          hide={!showCost}
          type="monotone"
          dataKey="nettleieCost"
          name="Nettleie"
          stroke={NETTLEIE_COLOR}
          dot={showConsumption ? undefined : <CustomDot />}
          activeDot={showConsumption}
        />
        <Line
          animationDuration={250}
          hide={!showCost}
          type="monotone"
          dataKey="cost"
          name="Total"
          stroke={TOTAL_COLOR}
          dot={showConsumption ? undefined : <CustomDot />}
          activeDot={showConsumption}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
};

export default React.memo(ConsumptionChart);
