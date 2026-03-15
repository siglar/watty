import React, { FC } from 'react';
import { Area, ComposedChart, ResponsiveContainer, Tooltip, TooltipContentProps, XAxis, YAxis } from 'recharts';
import { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';
import { ChartData } from '../../models/chart.models';
import CustomDot from './CustomDot';
import styles from './ConsumptionChart.module.css';

interface ConsumptionChartProps {
  data: ChartData[];
}

const SPOT_COLOR = '#2563EB';
const NETTLEIE_COLOR = '#059669';
const TOTAL_COLOR = '#EA580C';

const CustomDotNoClip = Object.assign(
  (props: Record<string, unknown>) => <CustomDot {...props} />,
  { clipDot: false as const, r: 30 }
);

const ConsumptionChart: FC<ConsumptionChartProps> = (props: ConsumptionChartProps) => {
  const { data } = props;

  const renderTooltip = (content: TooltipContentProps<ValueType, NameType>) => {
    if (content.payload && content.payload.length > 0) {
      const payload = content.payload[0].payload;

      const row = (key: string, label: string, value: string, colorClass?: string) => (
        <div key={key} className={`${styles.tooltipRow} ${colorClass ?? ''}`.trim()}>
          <span>{label}</span>
          <span className={styles.tooltipRowValue}>{value}</span>
        </div>
      );

      return (
        <article className={styles.tooltip}>
          <div className={styles.tooltipHeader}>{payload.date}</div>

          {row('consumption', 'Consumption', `${payload.consumption.toFixed(2)} kWh`)}

          <div className={styles.tooltipDivider} />

          {row('total-kr', 'Total', `${payload.cost.toFixed(2)} kr`, styles.tooltipRowTotal)}
          {row('spot-kr', 'Spot', `${payload.spotPriceCost.toFixed(2)} kr`, styles.tooltipRowSpot)}
          {row('nettleie-kr', 'Nettleie', `${payload.nettleieCost.toFixed(2)} kr`, styles.tooltipRowNettleie)}

          <div className={styles.tooltipDivider} />

          <div className={styles.tooltipSectionLabel}>Per kWh</div>
          {row('total-øre', 'Total', `${(payload.totalKwhPrice * 100).toFixed(1)} øre`, styles.tooltipRowTotal)}
          {row('spot-øre', 'Spot', `${(payload.spotKwhPrice * 100).toFixed(1)} øre`, styles.tooltipRowSpot)}
          {row('nettleie-øre', 'Nettleie', `${(payload.nettleieKwhPrice * 100).toFixed(1)} øre`, styles.tooltipRowNettleie)}
        </article>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={240}>
      <ComposedChart
        height={400}
        data={data}
        stackOffset="none"
        margin={{ top: 36, right: 0, bottom: 0, left: 0 }}
      >
        <XAxis dataKey="date" padding={{ left: 16, right: 16 }} />
        <YAxis hide />
        <Tooltip content={(content) => renderTooltip(content)} />

        <Area
          animationDuration={250}
          type="monotone"
          dataKey="nettleieCost"
          name="Nettleie"
          stackId="cost"
          stroke={NETTLEIE_COLOR}
          fill={NETTLEIE_COLOR}
          fillOpacity={0.8}
          dot={false}
          activeDot={false}
        />
        <Area
          animationDuration={250}
          type="monotone"
          dataKey="spotPriceCost"
          name="Spot"
          stackId="cost"
          stroke={SPOT_COLOR}
          fill={SPOT_COLOR}
          fillOpacity={0.8}
          dot={false}
          activeDot={false}
        />
        <Area
          animationDuration={250}
          type="monotone"
          dataKey="cost"
          name="Total"
          stackId="cost"
          stroke={TOTAL_COLOR}
          fill={TOTAL_COLOR}
          fillOpacity={0.8}
          dot={CustomDotNoClip}
          activeDot={false}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
};

export default React.memo(ConsumptionChart);

