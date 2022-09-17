import { format } from "date-fns";
import { FC } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
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

  const dateFormatter = (date: string) => {
    return format(new Date(date), "dd.MMM");
  };

  const renderTooltip = (content: TooltipProps<ValueType, NameType>) => {
    if (content.payload && content.payload.length > 0) {
      return (
        <div
          style={{
            border: "#bbb 1.5px solid",
          }}
        >
          <p
            style={{
              margin: "0 0",
              padding: "3px 7.5px",
              backgroundColor: "white",
            }}
          >
            Date: {content.payload[0].payload.date}
          </p>
          <p
            style={{
              margin: "0 0",
              padding: "3px 7.5px",
              backgroundColor: "white",
            }}
          >
            Cost: {content.payload[0].payload.costData.cost} kr
          </p>
          <p
            style={{
              margin: "0 0",
              padding: "3px 7.5px",
              backgroundColor: "white",
            }}
          >
            Kilowatt price: {content.payload[0].payload.costData.kWPrice} kr
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="consumption-wrapper">
      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          data={data}
          margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
        >
          <XAxis dataKey="date" tickFormatter={dateFormatter} />
          <Tooltip content={(content) => renderTooltip(content)} />
          <CartesianGrid stroke="#f5f5f5" />
          <Legend align="left" verticalAlign="top" formatter={() => "Cost"} />
          <Line
            type="monotone"
            dataKey="costData.cost"
            stroke="green"
            yAxisId={0}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ConsumptionChart;
