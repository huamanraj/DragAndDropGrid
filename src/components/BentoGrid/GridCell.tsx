import React from "react";
import { useDrop } from "react-dnd";
import { ItemTypes, GRID_CELL_SIZE } from "@/constants/grid";

interface GridCellProps {
  x: number;
  y: number;
  children?: React.ReactNode;
  onDrop: (id: string, position: { x: number; y: number }) => void;
}

const GridCell: React.FC<GridCellProps> = ({ x, y, children, onDrop }) => {
  const [{ isOver }, drop] = useDrop({
    accept: ItemTypes.BENTO_ITEM,
    drop: (item: { id: string }) => {
      onDrop(item.id, { x, y });
      return undefined;
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  const ref = React.useRef<HTMLDivElement | null>(null);
  drop(ref);

  return (
    <div
      ref={ref}
      className={`absolute transition-colors ${
        isOver ? "bg-blue-100" : "bg-transparent"
      }`}
      style={{
        left: `${x}px`,
        top: `${y}px`,
        width: `${GRID_CELL_SIZE}px`,
        height: `${GRID_CELL_SIZE}px`,
      }}
    >
      {children}
    </div>
  );
};

export default GridCell;
