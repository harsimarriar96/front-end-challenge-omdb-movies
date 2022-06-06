export const SearchBar = ({ onChange, value }) => {
  return (
    <div className="w-8/12 mx-auto border-2 rounded-full mt-20 flex items-center pl-8 bg-white shadow-lg">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-8 w-8 text-cyan-800"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
      <input
        type="text"
        placeholder="Enter your favourite movie name..."
        className="rounded-full w-full px-6 py-8 focus:outline-none font-semibold text-2xl tracking-wider text-cyan-800"
        onChange={onChange}
        value={value}
        autoFocus
      />
    </div>
  );
};
