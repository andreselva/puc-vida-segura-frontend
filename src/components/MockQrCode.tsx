import React from 'react';

interface MockQrCodeProps {
  value: string;
  size?: number;
}

const hashString = (value: string) => {
  let hash = 0;

  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) >>> 0;
  }

  return hash;
};

export const MockQrCode: React.FC<MockQrCodeProps> = ({ value, size = 192 }) => {
  const gridSize = 21;
  const cellSize = size / gridSize;
  const seed = hashString(value);

  const cells: React.ReactNode[] = [];

  const isFinderCell = (row: number, column: number) => {
    const isTopLeft = row < 7 && column < 7;
    const isTopRight = row < 7 && column >= 14;
    const isBottomLeft = row >= 14 && column < 7;
    return isTopLeft || isTopRight || isBottomLeft;
  };

  const shouldFillFinder = (row: number, column: number) => {
    const localRow = row % 14;
    const localColumn = column % 14;
    const inOuter = localRow <= 6 && localColumn <= 6;
    const inInnerWhite = localRow >= 1 && localRow <= 5 && localColumn >= 1 && localColumn <= 5;
    const inCore = localRow >= 2 && localRow <= 4 && localColumn >= 2 && localColumn <= 4;

    return inOuter && (!inInnerWhite || inCore);
  };

  for (let row = 0; row < gridSize; row += 1) {
    for (let column = 0; column < gridSize; column += 1) {
      let filled = false;

      if (isFinderCell(row, column)) {
        filled = shouldFillFinder(row, column);
      } else {
        const bitIndex = (row * gridSize + column) % 31;
        filled = ((seed >> bitIndex) & 1) === 1;
      }

      if (!filled) {
        continue;
      }

      cells.push(
        <rect
          key={`${row}-${column}`}
          x={column * cellSize}
          y={row * cellSize}
          width={cellSize}
          height={cellSize}
          rx={1}
          ry={1}
          fill="currentColor"
        />,
      );
    }
  }

  return (
    <div className="bg-white p-4 rounded-3xl shadow-sm text-[#00605A] border border-[#DDF3EE]">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label="QR Code ilustrativo">
        <rect width={size} height={size} fill="white" rx={16} ry={16} />
        {cells}
      </svg>
    </div>
  );
};
