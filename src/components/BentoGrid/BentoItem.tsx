import React, { useState } from "react";
import { useDrag } from "react-dnd";
import { motion } from "framer-motion";
import { X, LayoutGrid } from "lucide-react";
import { ItemTypes, GRID_CELL_SIZE, GRID_GAP, sizeOptions } from "@/constants/grid";
import { isPositionValid } from "@/utils/gridUtils";

interface BentoItemProps {
  id: string;
  content: string;
  position: { x: number; y: number };
  size: { cols: number; rows: number };
  onResize: (id: string, size: { cols: number; rows: number }) => void;
  onDelete: (id: string) => void;
  onMove: (id: string, x: number, y: number) => void;
  items: { id: string; position: { x: number; y: number }; size: { cols: number; rows: number } }[];
}

const BentoItem: React.FC<BentoItemProps> = ({
  id,
  position,
  size,
  onResize,
  onDelete,
  items,
}) => {
  const [showResizeOptions, setShowResizeOptions] = useState(false);

  // Set up drag
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.BENTO_ITEM,
    item: { id, position, size },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  const dragRef = React.useRef<HTMLDivElement | null>(null);
  drag(dragRef);

  // Handle resize selection
  const handleResizeSelect = (newSize: { cols: number; rows: number }) => {
    // Check if new size is valid at current position
    const isValid = isPositionValid(position, newSize, items, id);

    if (isValid) {
      onResize(id, newSize);
    }

    setShowResizeOptions(false);
  };

  const cellWidth = GRID_CELL_SIZE + GRID_GAP;
  const cellHeight = GRID_CELL_SIZE + GRID_GAP;

  return (
    <motion.div
      ref={dragRef}
      className={`absolute rounded-xl bg-gray-400 shadow-md overflow-hidden transition-all
        ${isDragging ? "opacity-50" : "opacity-100"}`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: `${size.cols * cellWidth - GRID_GAP}px`,
        height: `${size.rows * cellHeight - GRID_GAP}px`,
        zIndex: isDragging ? 1000 : 1,
      }}
      whileHover={{ scale: 1.02 }}
      onMouseEnter={() => setShowResizeOptions(true)}
      onMouseLeave={() => setShowResizeOptions(false)}
    >
      <div className="w-full h-full p-4 flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <button
            onClick={() => onDelete(id)}
            className="text-gray-400 hover:text-red-500 transition-colors"
          >
            <X size={16} className="text-gray-400" />
          </button>
        </div>

        {/* Content area */}
        <div className="flex-grow flex items-center justify-center text-gray-500">
          {/* Empty content */}
        </div>

        {/* Resize options */}
        {showResizeOptions && (
          <div className="absolute bottom-0 left-0 right-0 bg-white p-2 rounded-t-lg shadow-md">
            <div className="grid grid-cols-4 gap-2">
              {sizeOptions.map((option) => (
                <button
                  key={option.name}
                  onClick={() => handleResizeSelect(option)}
                  className={`p-1 border ${
                    size.cols === option.cols && size.rows === option.rows
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:bg-gray-50"
                  } rounded-md flex flex-col items-center`}
                >
                  <LayoutGrid size={16} className="text-gray-400" />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default BentoItem;
