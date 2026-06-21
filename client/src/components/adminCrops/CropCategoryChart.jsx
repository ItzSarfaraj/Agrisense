import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const CropCategoryChart = ({ crops }) => {
  const categoryCounts = {};

  crops.forEach((crop) => {
    categoryCounts[crop.category] = (categoryCounts[crop.category] || 0) + 1;
  });

  const data = Object.entries(categoryCounts).map(([category, count]) => ({
    category,
    count,
  }));

  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl dark:shadow-black/30 border border-green-100 dark:border-gray-700 p-6 mb-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">
        Crop Categories Distribution
      </h2>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" />

            <XAxis dataKey="category" stroke="var(--chart-axis)" tick={{ fill: "var(--chart-axis)" }} />

            <YAxis stroke="var(--chart-axis)" tick={{ fill: "var(--chart-axis)" }} />

            <Tooltip
              contentStyle={{
                backgroundColor: "var(--chart-tooltip-bg)",
                border: "1px solid var(--chart-tooltip-border)",
                borderRadius: "12px",
                color: "var(--chart-tooltip-text)",
              }}
              labelStyle={{ color: "var(--chart-tooltip-text)" }}
              itemStyle={{ color: "var(--chart-tooltip-text)" }}
            />

            <Bar dataKey="count" fill="#16a34a" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CropCategoryChart;