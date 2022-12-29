import React from 'react';
import { FC } from 'react';
import { Bar, ComposedChart, LabelList, Line, ResponsiveContainer, Tooltip, TooltipProps, XAxis } from 'recharts';
import { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';
import { ChartData } from '../../models/chart.models';
import CustomDot from './CustomDot';

interface ConsumptionChartProps {
  data: ChartData[];
  showCost: boolean;
  showConsumption: boolean;
}

const ConsumptionChart: FC<ConsumptionChartProps> = (props: ConsumptionChartProps) => {
  const { data, showConsumption, showCost } = props;

  const renderTooltip = (content: TooltipProps<ValueType, NameType>) => {
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
              backgroundColor: 'white',
              borderBottom: '#bbb 1.5px solid'
            }}
          >
            {content.payload[0].payload.date}
          </p>
          <p
            style={{
              margin: '0 0',
              padding: '3px 7.5px',
              backgroundColor: 'white',
              color: '#ff7300'
            }}
          >
            Cost: {content.payload[0].payload.cost.toFixed(2)} kr
          </p>
          <p
            style={{
              margin: '0 0',
              padding: '3px 7.5px',
              backgroundColor: 'white',
              color: '#413ea0'
            }}
          >
            Consumption: {content.payload[0].payload.consumption.toFixed(2)} kWh
          </p>
          <p
            style={{
              margin: '0 0',
              padding: '3px 7.5px',
              backgroundColor: 'white'
            }}
          >
            Kilowatt price: {(content.payload[0].payload.kWPrice * 100).toFixed(1)} øre
          </p>
        </article>
      );
    }
    return null;
  };

  const labelFormatter = (value: number) => {
    return value.toFixed(0);
  };

  return (
    <ResponsiveContainer width="100%" height={290}>
      <ComposedChart height={400} data={data}>
        <XAxis dataKey="date" />
        <Tooltip content={(content) => renderTooltip(content)} />

        <Bar animationDuration={250} hide={!showConsumption} dataKey="consumption" barSize={20} fill="#413ea0">
          {!showCost && (
            <LabelList style={{ fontSize: '90%' }} fill={'#ffffff'} dataKey="consumption" position="insideTop" formatter={labelFormatter} />
          )}
        </Bar>
        <Line
          animationDuration={250}
          hide={!showCost}
          type="monotone"
          dataKey="cost"
          stroke="#ff7300"
          dot={showConsumption ? undefined : (CustomDot as any)}
          activeDot={showConsumption}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
};

export default React.memo(ConsumptionChart);
