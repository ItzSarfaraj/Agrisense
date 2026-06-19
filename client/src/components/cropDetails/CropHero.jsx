const CropHero = ({ crop }) => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-green-700 via-green-600 to-emerald-500 rounded-3xl p-8 text-white shadow-xl">

      <div className="absolute -top-10 -right-10 w-48 h-48 bg-white/10 rounded-full"></div>
      <div className="absolute bottom-0 left-1/2 w-32 h-32 bg-white/10 rounded-full"></div>

      <div className="relative flex flex-col lg:flex-row items-center gap-8">

        <img
          src={crop.image}
          alt={crop.name}
          className="w-40 h-40 object-cover rounded-3xl border-4 border-white shadow-lg"
          onError={(e) => {
            e.target.src = "/crops/default.png";
          }}
        />

        <div className="flex-1">

          <p className="uppercase tracking-wider text-green-100 text-sm">
            {crop.category}
          </p>

          <h1 className="text-5xl font-bold mt-2">
            {crop.name}
          </h1>

          <p className="text-xl text-green-100 italic mt-2">
            {crop.scientificName}
          </p>

          <div className="flex flex-wrap gap-3 mt-6">

            <span className="bg-white/20 px-4 py-2 rounded-full text-sm">
              🌱 {crop.season}
            </span>

            <span className="bg-white/20 px-4 py-2 rounded-full text-sm">
              ⏳ {crop.cropDuration}
            </span>

            <span className="bg-white/20 px-4 py-2 rounded-full text-sm">
              📈 High Demand
            </span>

          </div>

        </div>

      </div>

    </div>
  );
};

export default CropHero;