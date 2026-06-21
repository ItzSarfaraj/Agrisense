const CropSearch = ({
  search,
  setSearch,
}) => {
  return (
    <div className="mb-6">
      <input
        type="text"
        placeholder="Search crops..."
        value={search}
        onChange={(e) =>
          setSearch(e.target.value)
        }
        className="w-full md:w-96 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-600"
      />
    </div>
  );
};

export default CropSearch;