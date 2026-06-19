const CropStorage = ({ crop }) => {
  return (
    <div className="bg-white rounded-3xl shadow-md p-8">

      <p className="text-blue-600 font-semibold uppercase tracking-wider text-sm">
        Post Harvest
      </p>

      <h2 className="text-3xl font-bold mt-2">
        Storage Guidelines
      </h2>

      <div className="mt-6 bg-blue-50 border border-blue-100 rounded-2xl p-6">

        <p className="text-gray-700 leading-8">
          {crop.storageGuidelines}
        </p>

      </div>

    </div>
  );
};

export default CropStorage;