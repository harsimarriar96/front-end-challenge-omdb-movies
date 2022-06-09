type Props = {
  onToggle: any;
  value: boolean;
};

export const Toggle = ({ onToggle, value }: Props) => {
  return (
    <div
      className={`h-6 ${
        value ? 'bg-cyan-600' : 'bg-gray-300'
      } w-14 relative rounded-full flex items-center cursor-pointer transition-all delay-100`}
      onClick={onToggle}
    >
      {/* Toggle Circle */}
      <div
        className={`absolute w-8 h-8 bg-cyan-800 rounded-full transition-all delay-100 ease-in-out ${
          value ? 'translate-x-8' : 'translate-x-0'
        }`}
      ></div>
    </div>
  );
};
