import { format } from "date-fns";
import { FC } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
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

  return (
    <div className="consumption-wrapper">
      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          data={data}
          margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
        >
          <XAxis dataKey="date" tickFormatter={dateFormatter} />
          <Tooltip formatter={(value: string) => `${value} kr`} />
          <CartesianGrid stroke="#f5f5f5" />
          <Line type="monotone" dataKey="cost" stroke="green" yAxisId={0} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ConsumptionChart;
