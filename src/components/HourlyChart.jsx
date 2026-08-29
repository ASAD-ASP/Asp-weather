import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { convertTemp, tempUnitSymbol } from "../utils/units";
import { useSettings } from "../context/SettingsContext";

function HourlyChart({ weather }) {
  const { settings, t } = useSettings();

  if (!weather) return null;

  const { time, temperature_2m } = weather.hourly;
  const unit = tempUnitSymbol(settings.tempUnit);

  const chartData = time.slice(0, 24).map((tm, i) => ({
    hour: new Date(tm).getHours() + ":00",
    temp: convertTemp(temperature_2m[i], settings.tempUnit),
  }));

  return (
    <div className="hourly-chart">
      <h3>{t.hourlyTitle}</h3>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart
          data={chartData}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <defs>
            <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ffffff" stopOpacity={0.5} />
              <stop offset="100%" stopColor="#ffffff" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="hour"
            stroke="rgba(255,255,255,0.6)"
            fontSize={12}
            interval={2}
            tickLine={false}
          />
          <YAxis hide domain={["dataMin - 3", "dataMax + 3"]} />
          <Tooltip
            contentStyle={{
              background: "rgba(0,0,0,0.7)",
              border: "none",
              borderRadius: "8px",
              color: "#fff",
            }}
            labelStyle={{ color: "#fff" }}
            formatter={(value) => [`${value}${unit}`, ""]}
          />
          <Area
            type="monotone"
            dataKey="temp"
            stroke="#ffffff"
            strokeWidth={2}
            fill="url(#tempGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export default HourlyChart;
