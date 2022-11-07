import React from "react";
import { FC } from "react";

const CustomDot: FC<{
  cx: number;
  cy: number;
  value: number;
}> = ({ cx, cy, value }) => {
  return (
    <React.Fragment key={cx}>
      <circle
        cx={cx}
        cy={cy}
        r={8}
        strokeWidth={7}
        fill="#ffffff"
        width={20}
        height={20}
      />
      <text
        x={cx}
        y={cy}
        textAnchor="middle"
        stroke="#000000"
        dy=".3em"
        fontSize={"14px"}
      >
        {value.toFixed(0)}
      </text>
    </React.Fragment>
  );
};

export default CustomDot;
