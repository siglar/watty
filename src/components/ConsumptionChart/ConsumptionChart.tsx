// import { format } from "date-fns";
import { FC } from "react";
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  TooltipProps,
  XAxis,
} from "recharts";
import {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";
import { ChartData } from "../../models/chart.models";
import "./ConsumptionChart.css";

interface ConsumptionChartProps {
  data: ChartData[];
}

const ConsumptionChart: FC<ConsumptionChartProps> = (
  props: ConsumptionChartProps
) => {
  const { data } = props;

  // const dateFormatter = (date: string) => {
  //   return format(new Date(date), "dd.MMM");
  // };

  const renderTooltip = (content: TooltipProps<ValueType, NameType>) => {
    if (content.payload && content.payload.length > 0) {
      return (
        <article
          style={{
            border: "#bbb 1.5px solid",
          }}
        >
          <p
            style={{
              margin: "0 0",
              padding: "3px 7.5px",
              backgroundColor: "white",
              borderBottom: "#bbb 1.5px solid",
            }}
          >
            {content.payload[0].payload.date}
          </p>
          <p
            style={{
              margin: "0 0",
              padding: "3px 7.5px",
              backgroundColor: "white",
              color: "#ff7300",
            }}
          >
            Cost: {content.payload[0].payload.cost} kr
          </p>
          <p
            style={{
              margin: "0 0",
              padding: "3px 7.5px",
              backgroundColor: "white",
              color: "#413ea0",
            }}
          >
            Consumption: {content.payload[0].payload.consumption} kW
          </p>
          <p
            style={{
              margin: "0 0",
              padding: "3px 7.5px",
              backgroundColor: "white",
            }}
          >
            Kilowatt price: {content.payload[0].payload.kWPrice} kr
          </p>
        </article>
      );
    }
    return null;
  };

  return (
    <div className="consumption-wrapper">
      <ResponsiveContainer width="100%" height={400}>
        <ComposedChart height={400} data={data}>
          {/* <XAxis dataKey="date" tickFormatter={dateFormatter} /> */}
          <XAxis dataKey="date" />
          <Tooltip content={(content) => renderTooltip(content)} />
          <Legend
            align="left"
            verticalAlign="top"
            formatter={(value) => value[0].toUpperCase() + value.slice(1)}
          />
          <CartesianGrid stroke="#f5f5f5" />
          <Bar dataKey="consumption" barSize={20} fill="#413ea0" />
          <Line type="monotone" dataKey="cost" stroke="#ff7300" />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ConsumptionChart;
