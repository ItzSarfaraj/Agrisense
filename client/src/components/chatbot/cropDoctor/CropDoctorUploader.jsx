import { ImagePlus, Plus, Upload } from "lucide-react";

const CropDoctorUploader = ({
  inputRef,
  dragActive,
  imageCount,
  onFiles,
  onDragEnter,
  onDragLeave,
  onDragOver,
  onDrop,
}) => {
  const canAddMore = imageCount < 5;

  return (
    <div
      onClick={() => inputRef.current?.click()}
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDragOver={onDragOver}
      onDrop={onDrop}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          inputRef.current?.click();
        }
      }}
      className={`group relative flex min-h-[250px] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-[1.5rem] border-2 border-dashed px-5 py-8 text-center transition-all duration-200 ${
        dragActive
          ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30"
          : "border-emerald-200 bg-gradient-to-br from-emerald-50/70 via-white to-cyan-50/40 hover:border-emerald-400 hover:shadow-md dark:border-emerald-900/60 dark:from-emerald-950/20 dark:via-gray-900 dark:to-cyan-950/10"
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        onChange={(event) => {
          onFiles(event.target.files);
          event.target.value = "";
        }}
        className="hidden"
      />

      <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-emerald-300/10 blur-2xl" />

      <div
        className={`relative flex h-14 w-14 items-center justify-center rounded-2xl border bg-white text-emerald-600 shadow-sm transition-all duration-200 group-hover:scale-105 dark:bg-gray-800 dark:text-emerald-400 ${
          dragActive
            ? "border-emerald-400 shadow-emerald-500/20"
            : "border-emerald-100 dark:border-emerald-900/60"
        }`}
      >
        {dragActive ? (
          <Upload size={24} />
        ) : (
          <ImagePlus size={24} />
        )}
      </div>

      <h2 className="relative mt-4 text-sm font-bold text-gray-800 dark:text-gray-100 sm:text-base">
        {dragActive ? "Drop your photos here" : "Add crop photos"}
      </h2>

      <p className="relative mt-1 text-xs text-gray-500 dark:text-gray-400">
        Drag & drop or click to browse
      </p>

      <p className="relative mt-2 text-[10px] text-gray-400 dark:text-gray-500">
        JPG, PNG or WebP · 5 MB each · Maximum 5 photos
      </p>

      {canAddMore && (
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            inputRef.current?.click();
          }}
          className="relative mt-4 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-emerald-600/20 transition hover:-translate-y-0.5 hover:bg-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
        >
          <Plus size={15} />
          Select photos
        </button>
      )}
    </div>
  );
};

export default CropDoctorUploader;