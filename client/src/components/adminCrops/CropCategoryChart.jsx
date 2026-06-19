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
    <div className="bg-white rounded-3xl shadow-xl border border-green-100 p-6 mb-8">
      <h2 className="text-2xl font-bold mb-6">Crop Categories Distribution</h2>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="category" />

            <YAxis />

            <Tooltip />

            <Bar dataKey="count" fill="#16a34a" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CropCategoryChart;
