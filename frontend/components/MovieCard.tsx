export const MovieCard = ({ name }) => {
  return (
    <div className="relative h-36 w-96 flex flex-col items-center justify-center shadow-sm ">
      <div className="bg-white w-full flex-grow flex items-center justify-center">
        <p className="px-8">{name}</p>
      </div>
      <div className="bg-cyan-800 w-full py-2 text-center font-bold uppercase text-white hover:bg-cyan-900 cursor-pointer">
        Nominate
      </div>
    </div>
  );
};
