import { useMantineColorScheme } from '@mantine/core';
import React, { FC } from 'react';
import { ChartData } from '../../models/chart.models';

const TOTAL_COLOR = '#EA580C';

export interface CustomDotProps {
  cx?: number;
  cy?: number;
  value?: number;
  payload?: ChartData;
}

const CustomDot: FC<CustomDotProps> = (props) => {
  const { cx = 0, cy = 0, value, payload } = props;

  const { colorScheme } = useMantineColorScheme();
  const dark = colorScheme === 'dark';

  const rawValue = payload?.cost ?? value;
  if (typeof rawValue === 'number' && rawValue === 0) {
    return null;
  }

  const displayValue =
    typeof rawValue === 'number' && !isNaN(rawValue) ? rawValue.toFixed(0) : '';

  const pillWidth = Math.max(28, displayValue.length * 9);
  const pillHeight = 20;
  const pillY = cy - pillHeight - 6;

  return (
    <g key={cx}>
      <defs>
        <filter id="dot-shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx={0} dy={1} stdDeviation={2} floodOpacity={0.15} />
        </filter>
      </defs>
      <circle
        cx={cx}
        cy={cy}
        r={3.5}
        fill={TOTAL_COLOR}
        opacity={0.85}
      />
      <rect
        x={cx - pillWidth / 2}
        y={pillY}
        width={pillWidth}
        height={pillHeight}
        rx={pillHeight / 2}
        fill={TOTAL_COLOR}
        fillOpacity={0.92}
        stroke={dark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.08)'}
        strokeWidth={1}
        filter="url(#dot-shadow)"
      />
      <text
        x={cx}
        y={pillY + pillHeight / 2}
        textAnchor="middle"
        dominantBaseline="central"
        fill="rgba(255,255,255,0.95)"
        fontSize={12}
        fontWeight={600}
      >
        {displayValue}
      </text>
    </g>
  );
};

export default CustomDot;
