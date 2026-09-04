const CropDoctorListSection = ({
  title,
  items = [],
  icon,
}) => {
  if (!items.length) return null;

  return (
    <div className="rounded-[1.4rem] border border-gray-100 bg-white/85 p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900/85 sm:p-5">
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gray-50 dark:bg-gray-800">
          {icon}
        </div>

        <h3 className="text-sm font-bold text-gray-900 dark:text-white">
          {title}
        </h3>
      </div>

      <ul className="mt-4 space-y-3">
        {items.map((item, index) => (
          <li
            key={`${item}-${index}`}
            className="flex items-start gap-3 text-xs leading-5 text-gray-600 dark:text-gray-300"
          >
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />

            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CropDoctorListSection;