import { cn } from '@/shared/lib/utils';
import { useRef, useState } from 'react';
import { FaCaretDown } from 'react-icons/fa';
import { useStorage, useMutation } from '@liveblocks/react/suspense';
import { LEFT_MARGIN_DEFAULT, RIGHT_MARGIN_DEFAULT } from '@/shared/lib/constants';

const markers = Array.from({ length: 83 }, (_, i) => i);

export const Ruler = () => {
  const [isDraggingLeft, setIsDraggingLeft] = useState(false);
  const [isDraggingRight, setIsDraggingRight] = useState(false);
  const rulerRef = useRef<HTMLDivElement>(null);
  const leftMargin = useStorage(root => root.leftMargin) ?? LEFT_MARGIN_DEFAULT;
  const rightMargin = useStorage(root => root.rightMargin) ?? RIGHT_MARGIN_DEFAULT;

  const setLeftMargin = useMutation(
    ({ storage }, position: number) => {
      if (position > 0) storage.set('leftMargin', position);
    },
    [leftMargin]
  );

  const setRightMargin = useMutation(
    ({ storage }, position: number) => {
      if (position > 0) storage.set('rightMargin', position);
    },
    [rightMargin]
  );

  if (!leftMargin || !rightMargin) {
    return null;
  }

  const handleLeftMouseDown = () => {
    setIsDraggingLeft(true);
  };
  const handleRightMouseDown = () => {
    setIsDraggingRight(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const PAGE_WIDTH = 816;
    const MIN_SPACE = 100;

    if ((isDraggingLeft || isDraggingRight) && rulerRef.current) {
      const container = rulerRef.current.querySelector('#ruler-container');

      if (container) {
        const rect = container.getBoundingClientRect();
        const relativeX = e.clientX - rect.left;
        const rawPosition = Math.max(0, Math.min(PAGE_WIDTH, relativeX));

        if (isDraggingLeft) {
          const maxLeftPos = PAGE_WIDTH - rightMargin - MIN_SPACE;
          const newLeftPos = Math.min(rawPosition, maxLeftPos);
          setLeftMargin(newLeftPos);
        } else if (isDraggingRight) {
          const maxRightPos = PAGE_WIDTH - (leftMargin + MIN_SPACE);
          const newRightPos = Math.max(PAGE_WIDTH - rawPosition, 0);
          const constrainedRightPos = Math.min(newRightPos, maxRightPos);
          setRightMargin(constrainedRightPos);
        }
      }
    }
  };

  const handleMouseUp = () => {
    setIsDraggingLeft(false);
    setIsDraggingRight(false);
  };

  const handleLeftDoubleClick = () => {
    setLeftMargin(LEFT_MARGIN_DEFAULT);
  };
  const handleRightDoubleClick = () => {
    setRightMargin(RIGHT_MARGIN_DEFAULT);
  };

  return (
    <div
      ref={rulerRef}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      className="w-[816px] mx-auto h-6 border-b border-gray-300 flex items-end relative select-none print:hidden"
    >
      <div id="ruler-container" className="w-full h-full relative">
        <Marker
          position={leftMargin}
          isLeft={true}
          isDragging={isDraggingLeft}
          onMouseDown={handleLeftMouseDown}
          onDoubleClick={handleLeftDoubleClick}
        />
        <Marker
          position={rightMargin}
          isLeft={false}
          isDragging={isDraggingRight}
          onMouseDown={handleRightMouseDown}
          onDoubleClick={handleRightDoubleClick}
        />
        <div className="absolute inset-x-0 bottom-0 h-full">
          <div className="relative h-full w-[816px]">
            {markers.map(marker => {
              const pos = (marker * 816) / 82;

              return (
                <div
                  key={marker}
                  className="absolute bottom-0"
                  style={{ left: `${pos}px` }}
                >
                  {marker % 10 === 0 && (
                    <>
                      <div className="absolute bottom-0 w-[1px] h-2 bg-neutral-500" />
                      <span className="absolute bottom-2 text-[10px] text-neutral-500 transform -translate-x-1/2">
                        {marker / 10 + 1}
                      </span>
                    </>
                  )}
                  {marker % 5 === 0 && marker % 10 !== 0 && (
                    <div className="absolute bottom-0 w-[1px] h-1.5 bg-neutral-500" />
                  )}
                  {marker % 5 !== 0 && (
                    <div className="absolute bottom-0 w-[1px] h-1 bg-neutral-500" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

interface MarkerProps {
  position: number;
  isLeft: boolean;
  isDragging: boolean;
  onMouseDown: () => void;
  onDoubleClick: () => void;
}

const Marker = ({
  position,
  isLeft,
  isDragging,
  onMouseDown,
  onDoubleClick
}: MarkerProps) => {
  return (
    <div
      className={cn('absolute top-0 w-4 h-full z-[5] group -ml-2')}
      style={{
        [isLeft ? 'left' : 'right']: `${position}px`,
        [isDragging ? 'cursor' : '']: 'ew-resize'
      }}
      onMouseDown={onMouseDown}
      onDoubleClick={onDoubleClick}
    >
      <FaCaretDown className="absolute top-0 left-1/2 h-full fill-blue-500 transform -translate-x-1/2" />
      <div
        className="absolute top-4 left-1/2 transform -translate-x-1/2ё duration-150"
        style={{
          height: '100vh',
          width: '1px',
          transform: 'scaleX(0.5)',
          backgroundColor: '#3b72f6',
          display: isDragging ? 'block' : 'none'
        }}
      />
    </div>
  );
};
