const CropOverview = ({ crop }) => {
  return (
    <div className="bg-white rounded-3xl shadow-md p-8">

      <h2 className="text-2xl font-bold mb-4">
        Crop Overview
      </h2>

      <p className="text-gray-600 leading-9 text-lg">
        {crop.overview}
      </p>

    </div>
  );
};

export default CropOverview;