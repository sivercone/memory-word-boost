import React from 'react';
import { twMerge } from 'tailwind-merge';

interface SVGProps {
  className?: string;
  height?: string;
  width?: string;
}

const commonStyle = 'fill-gray-600';

export const PlusIcon: React.FC<SVGProps> = ({ className, height = 24, width = 24 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 -960 960 960"
    height={height}
    width={width}
    className={twMerge(`${commonStyle} ${className}`)}
  >
    <path d="M450.001-450.001h-230v-59.998h230v-230h59.998v230h230v59.998h-230v230h-59.998v-230Z" />
  </svg>
);

export const MenuIcon: React.FC<SVGProps> = ({ className, height = 24, width = 24 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 -960 960 960"
    height={height}
    width={width}
    className={twMerge(`${commonStyle} ${className}`)}
  >
    <path d="M140.001-254.616v-59.999h679.998v59.999H140.001Zm0-195.385v-59.998h679.998v59.998H140.001Zm0-195.384v-59.999h679.998v59.999H140.001Z" />
  </svg>
);

export const SetIcon: React.FC<SVGProps> = ({ className, height = 24, width = 24 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 -960 960 960"
    height={height}
    width={width}
    className={twMerge(`${commonStyle} ${className}`)}
  >
    <path d="M170.004-194.618v-59.998h59.998v59.998h-59.998Zm0-139.998v-59.999H336.54v59.999H170.004Zm0-139.999v-59.999H440v59.999H170.004Zm0-139.999v-150.768h619.992v150.768H170.004Zm139.998 419.996v-59.998h59.999v59.998h-59.999Zm86.538-139.998v-59.999h166.536v59.999H396.54Zm53.461 139.998v-59.998h59.998v59.998h-59.998ZM520-474.615v-59.999h269.996v59.999H520Zm69.999 279.997v-59.998h59.999v59.998h-59.999Zm33.077-139.998v-59.999h166.92v59.999h-166.92Zm106.922 139.998v-59.998h59.998v59.998h-59.998Z" />
  </svg>
);

export const FolderIcon: React.FC<SVGProps> = ({ className, height = 24, width = 24 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 -960 960 960"
    height={height}
    width={width}
    className={twMerge(`${commonStyle} ${className}`)}
  >
    <path d="M570.001-330.001h59.998v-80h80v-59.998h-80v-80h-59.998v80h-80v59.998h80v80Zm-397.692 150q-30.308 0-51.308-21t-21-51.308v-455.382q0-30.308 21-51.308t51.308-21h219.613l80 80h315.769q30.308 0 51.308 21t21 51.308v375.382q0 30.308-21 51.308t-51.308 21H172.309Zm0-59.999h615.382q5.385 0 8.847-3.462 3.462-3.462 3.462-8.847v-375.382q0-5.385-3.462-8.847-3.462-3.462-8.847-3.462H447.385l-80-80H172.309q-5.385 0-8.847 3.462-3.462 3.462-3.462 8.847v455.382q0 5.385 3.462 8.847 3.462 3.462 8.847 3.462ZM160-240v-480 480Z" />
  </svg>
);

export const MoreIcon: React.FC<SVGProps> = ({ className, height = 24, width = 24 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 -960 960 960"
    height={height}
    width={width}
    className={twMerge(`${commonStyle} ${className}`)}
  >
    <path d="M249.231-420.001q-24.749 0-42.374-17.625-17.624-17.625-17.624-42.374 0-24.749 17.624-42.374 17.625-17.625 42.374-17.625 24.75 0 42.374 17.625Q309.23-504.749 309.23-480q0 24.749-17.625 42.374-17.624 17.625-42.374 17.625Zm230.769 0q-24.749 0-42.374-17.625-17.625-17.625-17.625-42.374 0-24.749 17.625-42.374 17.625-17.625 42.374-17.625 24.749 0 42.374 17.625 17.625 17.625 17.625 42.374 0 24.749-17.625 42.374-17.625 17.625-42.374 17.625Zm230.769 0q-24.75 0-42.374-17.625Q650.77-455.251 650.77-480q0-24.749 17.625-42.374 17.624-17.625 42.374-17.625 24.749 0 42.374 17.625 17.624 17.625 17.624 42.374 0 24.749-17.624 42.374-17.625 17.625-42.374 17.625Z" />
  </svg>
);
export const MinusIcon: React.FC<SVGProps> = ({ className, height = 24, width = 24 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 -960 960 960"
    height={height}
    width={width}
    className={twMerge(`${commonStyle} ${className}`)}
  >
    <path d="M220.001-450.001v-59.998h519.998v59.998H220.001Z" />
  </svg>
);
export const ChevronRightIcon: React.FC<SVGProps> = ({ className, height = 24, width = 24 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 -960 960 960"
    height={height}
    width={width}
    className={twMerge(`${commonStyle} ${className}`)}
  >
    <path d="m517.847-480-184-184L376-706.153 602.153-480 376-253.847 333.847-296l184-184Z" />
  </svg>
);
export const ArrowLeftIcon: React.FC<SVGProps> = ({ className, height = 24, width = 24 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 -960 960 960"
    height={height}
    width={width}
    className={twMerge(`${commonStyle} ${className}`)}
  >
    <path d="m294.922-450.001 227.846 227.847L480-180.001 180.001-480 480-779.999l42.768 42.153-227.846 227.847h485.077v59.998H294.922Z" />
  </svg>
);
export const DeleteIcon: React.FC<SVGProps> = ({ className, height = 24, width = 24 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 -960 960 960"
    height={height}
    width={width}
    className={twMerge(`${commonStyle} ${className}`)}
  >
    <path d="M292.309-140.001q-29.923 0-51.115-21.193-21.193-21.192-21.193-51.115V-720h-40v-59.999H360v-35.384h240v35.384h179.999V-720h-40v507.691q0 30.308-21 51.308t-51.308 21H292.309ZM680-720H280v507.691q0 5.385 3.462 8.847 3.462 3.462 8.847 3.462h375.382q4.616 0 8.463-3.846 3.846-3.847 3.846-8.463V-720ZM376.155-280h59.999v-360h-59.999v360Zm147.691 0h59.999v-360h-59.999v360ZM280-720v520-520Z" />
  </svg>
);
export const SwapVertIcon: React.FC<SVGProps> = ({ className, height = 24, width = 24 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 -960 960 960"
    height={height}
    width={width}
    className={twMerge(`${commonStyle} ${className}`)}
  >
    <path d="M336.155-453.847v-291.231L222.77-631.693l-42.769-42.153 186.153-186.153 186.153 186.153-42.768 42.153-113.385-113.385v291.231h-59.999Zm257.306 353.846L407.308-286.154l42.768-42.153 113.386 113.385v-291.231h59.998v291.231l113.386-113.385 42.768 42.153-186.153 186.153Z" />
  </svg>
);
