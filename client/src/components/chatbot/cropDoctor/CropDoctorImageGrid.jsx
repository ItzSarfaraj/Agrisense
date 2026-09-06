import { FileImage, Plus, X } from "lucide-react";

const CropDoctorImageGrid = ({
  images,
  onRemove,
  onAdd,
  maxImages = 5,
}) => {
  if (!images.length) return null;

  return (
    <div>
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-gray-800 dark:text-gray-100">
              Your photos
            </h2>

            <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400">
              {images.length}/{maxImages}
            </span>
          </div>

          <p className="mt-0.5 text-[10px] text-gray-400">
            Use different angles when possible
          </p>
        </div>

        {images.length < maxImages && (
          <button
            type="button"
            onClick={onAdd}
            className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-white px-3 py-2 text-[11px] font-semibold text-emerald-700 transition hover:bg-emerald-50 dark:border-emerald-900/60 dark:bg-gray-800 dark:text-emerald-400 dark:hover:bg-emerald-950/30"
          >
            <Plus size={13} />
            Add photo
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {images.map((item, index) => (
          <div key={item.id} className="group min-w-0">
            <div className="relative aspect-square overflow-hidden rounded-2xl border border-gray-200 bg-gray-100 dark:border-gray-700 dark:bg-gray-800">
              <img
                src={item.preview}
                alt={`Crop photo ${index + 1}`}
                className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
              />

              <div className="absolute left-2 top-2 flex h-6 min-w-6 items-center justify-center rounded-lg bg-black/60 px-1.5 text-[10px] font-bold text-white backdrop-blur-sm">
                {index + 1}
              </div>

              <button
                type="button"
                onClick={() => onRemove(item.id)}
                aria-label={`Remove crop photo ${index + 1}`}
                className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white opacity-100 backdrop-blur-sm transition hover:bg-red-600 focus:opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
              >
                <X size={14} />
              </button>
            </div>

            <div className="mt-1.5 flex min-w-0 items-center gap-1 px-1">
              <FileImage size={11} className="shrink-0 text-emerald-500" />

              <p className="truncate text-[10px] text-gray-400" title={item.file.name}>
                {item.file.name}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CropDoctorImageGrid;