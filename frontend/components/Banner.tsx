import { ReactNode } from 'react';
import BannerTypes from '../types/BannerTypes';

type Props = {
  show: boolean;
  children: ReactNode;
  type: BannerTypes;
};

export const Banner = ({ children, type, show }: Props) => {
  let colors;
  if (type === BannerTypes.INFO) {
    colors = 'border-blue-500 bg-blue-200';
  } else if (type === BannerTypes.DANGER) {
    colors = 'border-red-500 bg-red-200';
  } else colors = 'border-gray-500 bg-gray-200';

  return (
    <div
      className={`flex items-center px-8 py-6 rounded-xl border ${colors} ${
        show ? '' : 'opacity-0'
      }`}
    >
      {children}
    </div>
  );
};
