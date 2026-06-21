const CropProtection = ({ crop }) => {
  return (
    <div className="bg-white dark:bg-gray-800 dark:border dark:border-gray-700 rounded-3xl shadow-md dark:shadow-none p-8">

      <div className="mb-8">
        <p className="text-red-600 dark:text-red-400 font-semibold uppercase tracking-wider text-sm">
          Crop Protection
        </p>

        <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mt-2">
          Diseases & Pests Management
        </h2>

        <p className="text-gray-500 dark:text-gray-400 mt-2">
          Common threats affecting crop health and their recommended
          management practices.
        </p>
      </div>

      {/* Diseases */}
      <div className="mb-10">

        <h3 className="text-2xl font-bold mb-5 text-gray-800 dark:text-gray-100">
          🦠 Major Diseases
        </h3>

        <div className="grid lg:grid-cols-2 gap-5">

          {crop.majorDiseases?.map((disease) => (
            <div
              key={disease.name}
              className="border border-red-100 dark:border-red-900 bg-red-50 dark:bg-red-900/20 rounded-2xl p-5"
            >

              <h4 className="font-bold text-xl text-red-700 dark:text-red-400">
                {disease.name}
              </h4>

              <div className="mt-4">
                <p className="font-semibold text-gray-700 dark:text-gray-300">
                  Symptoms
                </p>

                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  {disease.symptoms}
                </p>
              </div>

              <div className="mt-4">
                <p className="font-semibold text-gray-700 dark:text-gray-300">
                  Management
                </p>

                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  {disease.management}
                </p>
              </div>

            </div>
          ))}

        </div>

      </div>

      {/* Pests */}
      <div>

        <h3 className="text-2xl font-bold mb-5 text-gray-800 dark:text-gray-100">
          🐛 Major Pests
        </h3>

        <div className="grid lg:grid-cols-2 gap-5">

          {crop.pests?.map((pest) => (
            <div
              key={pest.name}
              className="border border-amber-100 dark:border-amber-900 bg-amber-50 dark:bg-amber-900/20 rounded-2xl p-5"
            >

              <h4 className="font-bold text-xl text-amber-700 dark:text-amber-400">
                {pest.name}
              </h4>

              <div className="mt-4">
                <p className="font-semibold text-gray-700 dark:text-gray-300">
                  Damage
                </p>

                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  {pest.damage}
                </p>
              </div>

              <div className="mt-4">
                <p className="font-semibold text-gray-700 dark:text-gray-300">
                  Control
                </p>

                <p className="text-gray-600 dark:text-gray-400 mt-1">
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