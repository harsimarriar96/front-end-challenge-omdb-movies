import Image from 'next/image';

type Props = {
  title: string;
  year: string;
  posterURI: string;
  isNominated: boolean;
  hasReachedNominationLimit: boolean;
  onClickNominate?: () => void;
  onClickDenominate: () => void;
};

export const MovieCard = ({
  title,
  year,
  posterURI,
  isNominated,
  hasReachedNominationLimit,
  onClickNominate,
  onClickDenominate,
}: Props) => {
  return (
    <div className="relative h-36 flex-grow w-96 flex flex-col items-center justify-center shadow-sm ">
      <div className="bg-white w-full flex-grow flex items-center">
        {posterURI !== 'N/A' && (
          <Image src={posterURI} alt={title} height="100" width="100" />
        )}
        <p className="px-8 text-lg font-bold">
          {title} ({year})
        </p>
      </div>
      <div
        className={`${
          isNominated
            ? 'bg-cyan-600 hover:bg-cyan-700'
            : hasReachedNominationLimit
            ? 'bg-gray-300 text-gray-400'
            : 'bg-cyan-800 hover:bg-cyan-900'
        } w-full py-2 text-center font-bold uppercase text-white cursor-pointer`}
        onClick={!isNominated ? onClickNominate : onClickDenominate}
      >
        {isNominated ? 'De-Nominate' : 'Nominate'}
      </div>
    </div>
  );
};
