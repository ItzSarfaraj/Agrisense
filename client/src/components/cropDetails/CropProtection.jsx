const CropProtection = ({ crop }) => {
  return (
    <div className="bg-white rounded-3xl shadow-md p-8">

      <div className="mb-8">
        <p className="text-red-600 font-semibold uppercase tracking-wider text-sm">
          Crop Protection
        </p>

        <h2 className="text-3xl font-bold text-gray-800 mt-2">
          Diseases & Pests Management
        </h2>

        <p className="text-gray-500 mt-2">
          Common threats affecting crop health and their recommended
          management practices.
        </p>
      </div>

      {/* Diseases */}
      <div className="mb-10">

        <h3 className="text-2xl font-bold mb-5">
          🦠 Major Diseases
        </h3>

        <div className="grid lg:grid-cols-2 gap-5">

          {crop.majorDiseases?.map((disease) => (
            <div
              key={disease.name}
              className="border border-red-100 bg-red-50 rounded-2xl p-5"
            >

              <h4 className="font-bold text-xl text-red-700">
                {disease.name}
              </h4>

              <div className="mt-4">
                <p className="font-semibold text-gray-700">
                  Symptoms
                </p>

                <p className="text-gray-600 mt-1">
                  {disease.symptoms}
                </p>
              </div>

              <div className="mt-4">
                <p className="font-semibold text-gray-700">
                  Management
                </p>

                <p className="text-gray-600 mt-1">
                  {disease.management}
                </p>
              </div>

            </div>
          ))}

        </div>

      </div>

      {/* Pests */}
      <div>

        <h3 className="text-2xl font-bold mb-5">
          🐛 Major Pests
        </h3>

        <div className="grid lg:grid-cols-2 gap-5">

          {crop.pests?.map((pest) => (
            <div
              key={pest.name}
              className="border border-amber-100 bg-amber-50 rounded-2xl p-5"
            >

              <h4 className="font-bold text-xl text-amber-700">
                {pest.name}
              </h4>

              <div className="mt-4">
                <p className="font-semibold text-gray-700">
                  Damage
                </p>

                <p className="text-gray-600 mt-1">
                  {pest.damage}
                </p>
              </div>

              <div className="mt-4">
                <p className="font-semibold text-gray-700">
                  Control
                </p>

                <p className="text-gray-600 mt-1">
                  {pest.control}
                </p>
              </div>

            </div>
          ))}

        </div>

      </div>

    </div>
  );
};

export default CropProtection;