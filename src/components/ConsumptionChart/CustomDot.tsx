import { useMantineColorScheme } from '@mantine/core';
import React from 'react';
import { FC } from 'react';

const CustomDot: FC<any> = (props: any) => {
  const { cx, cy, value } = props;

  const { colorScheme } = useMantineColorScheme();
  const dark = colorScheme === 'dark';

  return (
    <React.Fragment key={cx}>
      <circle cx={cx} cy={cy} r={8} strokeWidth={7} fill={dark ? '#2E2E2E' : '#ffffff'} width={20} height={20} />
      <text x={cx} y={cy} textAnchor="middle" stroke={dark ? '#C1C2C5' : '#000000'} dy=".3em" fontSize={'14px'}>
        {value.toFixed(0)}
      </text>
    </React.Fragment>
  );
};

export default CustomDot;
