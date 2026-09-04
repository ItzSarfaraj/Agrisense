import { useEffect, useState } from "react";

const TreatmentReportImages = ({ images = [], title }) => {
  const [urls, setUrls] = useState([]);

  useEffect(() => {
    const nextUrls = images.map((image, index) => ({
      key: `${image.name}-${image.size}-${image.lastModified}-${index}`,
      url: URL.createObjectURL(image),
    }));

    setUrls(nextUrls);

    return () => {
      nextUrls.forEach((item) => {
        URL.revokeObjectURL(item.url);
      });
    };
  }, [images]);

  if (!images.length) {
    return null;
  }

  return (
    <div className="w-full">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          {title && (
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">
              {title}
            </h3>
          )}

          <p className="mt-1 text-[10px] text-gray-400">
            {images.length} image{images.length !== 1 ? "s" : ""} used for the
            analysis
          </p>
        </div>

        <span className="shrink-0 rounded-full bg-emerald-50 px-2.5 py-1 text-[9px] font-bold text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400">
          Crop Evidence
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {urls.map((item, index) => (
          <div
            key={item.key}
            className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-gray-100 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md dark:border-gray-800 dark:bg-gray-950 print:break-inside-avoid"
          >
            <img
              src={item.url}
              alt={`Crop analysis image ${index + 1}`}
              className="aspect-[4/3] w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />

            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent px-3 pb-2 pt-6">
              <span className="text-[9px] font-semibold text-white">
                Image {index + 1}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TreatmentReportImages;
