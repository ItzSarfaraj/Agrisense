import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

const RelatedCrops = ({ cropName }) => {
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    if (!cropName) return;

    fetchRelated();
  }, [cropName]);

  const fetchRelated = async () => {
    try {
      setLoading(true);

      const response = await api.get(
        `/crops/${cropName}/related`
      );

      setRelated(response.data.related || []);
    } catch (error) {
      console.error(
        "Related Crops Error:",
        error
      );

      setRelated([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 dark:border dark:border-gray-700 rounded-3xl shadow-md dark:shadow-none p-8">
        <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100">
          Related Crops
        </h2>

        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-5">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="border dark:border-gray-700 rounded-2xl overflow-hidden animate-pulse"
            >
              <div className="h-40 bg-gray-200 dark:bg-gray-700"></div>

              <div className="p-4">
                <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded mb-3"></div>

                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!related.length) {
    return (
      <div className="bg-white dark:bg-gray-800 dark:border dark:border-gray-700 rounded-3xl shadow-md dark:shadow-none p-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-800 dark:text-gray-100">
          Related Crops
        </h2>

        <p className="text-gray-500 dark:text-gray-400">
          No related crops available.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 dark:border dark:border-gray-700 rounded-3xl shadow-md dark:shadow-none p-8">

      <div className="mb-6">
        <p className="text-green-600 dark:text-green-400 font-semibold uppercase tracking-wider text-sm">
          Explore More
        </p>

        <h2 className="text-3xl font-bold mt-2 text-gray-800 dark:text-gray-100">
          Related Crops
        </h2>

        <p className="text-gray-500 dark:text-gray-400 mt-2">
          Similar crops from the same category.
        </p>
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-5">

        {related.map((crop) => (
          <div
            key={crop._id}
            onClick={() =>
              navigate(
                `/crops/${crop.name.toLowerCase()}`
              )
            }
            className="cursor-pointer bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-2xl overflow-hidden hover:shadow-xl dark:hover:border-gray-600 hover:-translate-y-1 transition-all duration-300"
          >

            <img
              src={
                crop.image ||
                "/crops/default.png"
              }
              alt={crop.name}
              onError={(e) => {
                e.target.src =
                  "/crops/default.png";
              }}
              className="h-48 w-full object-cover"
            />

            <div className="p-4">

              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                {crop.name}
              </h3>

              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {crop.category}
              </p>

              <button className="mt-4 text-green-600 dark:text-green-400 font-semibold text-sm">
                View Details →
              </button>

            </div>

          </div>
        ))}

      </div>

    </div>
  );
};

export default RelatedCrops;