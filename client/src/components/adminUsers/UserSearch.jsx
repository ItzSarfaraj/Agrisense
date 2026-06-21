const UserSearch = ({
  search,
  setSearch,
}) => {
  return (
    <div className="mb-6">
      <input
        type="text"
        placeholder="Search users by name or email..."
        value={search}
        onChange={(e) =>
          setSearch(e.target.value)
        }
        className="w-full md:w-96 border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
      />
    </div>
  );
};

export default UserSearch;