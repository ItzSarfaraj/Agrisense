import { useEffect, useState } from "react";
import api from "../../api/axios";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  LineChart,
  Line,
} from "recharts";

const PredictionCharts = () => {
  const [cropStats, setCropStats] = useState([]);
  const [monthlyStats, setMonthlyStats] = useState([]);

  useEffect(() => {
    fetchChartsData();
  }, []);

  const fetchChartsData = async () => {
    try {
      const cropResponse = await api.get("/admin/crop-stats");

      const monthlyResponse = await api.get("/admin/monthly-predictions");

      setCropStats(cropResponse.data.data);
      setMonthlyStats(monthlyResponse.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="grid lg:grid-cols-2 gap-6 mt-8">
      {/* Top Crops */}
      <div className="bg-white rounded-3xl shadow-md border border-gray-100 p-6">
        <h2 className="text-2xl font-bold mb-6">Top Recommended Crops</h2>

        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={cropStats}>
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="crop" />

              <YAxis />

              <Tooltip />

              <Bar dataKey="count" fill="#16a34a" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Monthly Trend */}
      <div className="bg-white rounded-3xl shadow-md border border-gray-100 p-6">
        <h2 className="text-2xl font-bold mb-6">Monthly Prediction Trend</h2>

        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyStats}>
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="month" />

              <YAxis />

              <Tooltip />

              <Line
                type="monotone"
                dataKey="count"
                stroke="#16a34a"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default PredictionCharts;
