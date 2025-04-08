// app/page.tsx
"use client";

import React, { useState, useRef } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { motion } from "framer-motion";
import { v4 as uuidv4 } from "uuid";
import { X, LayoutGrid } from "lucide-react";

// Define constants
const ItemTypes = {
  BENTO_ITEM: "bentoItem",
};

const GRID_CELL_SIZE = 250;
const GRID_GAP = 10;
const GRID_COLUMNS = 4;
let GRID_ROWS = 4; // Make GRID_ROWS mutable

// Define size options
const sizeOptions = [
  { name: "Small Square", cols: 1, rows: 1 },
  { name: "Horizontal Rectangle", cols: 2, rows: 1 },
  { name: "Vertical Rectangle", cols: 1, rows: 2 },
  { name: "Large Square", cols: 2, rows: 2 },
];

// Calculate grid position
const snapToGrid = (x, y) => {
  const cellWidth = GRID_CELL_SIZE + GRID_GAP;
  const cellHeight = GRID_CELL_SIZE + GRID_GAP;

  const col = Math.round(x / cellWidth);
  const row = Math.round(y / cellHeight);

  return {
    x: col * cellWidth,
    y: row * cellHeight,
  };
};

// Check if position is valid on grid
const isPositionValid = (position, size, items, currentId) => {
  // Calculate grid cell position
  const cellWidth = GRID_CELL_SIZE + GRID_GAP;
  const cellHeight = GRID_CELL_SIZE + GRID_GAP;

  const gridCol = Math.round(position.x / cellWidth);
  const gridRow = Math.round(position.y / cellHeight);

  // Check if within grid boundaries
  if (
    gridCol < 0 ||
    gridRow < 0 ||
    gridCol + size.cols > GRID_COLUMNS ||
    gridRow + size.rows > GRID_ROWS
  ) {
    return false;
  }

  // Check for collision with other items
  const collision = items.some((item) => {
    if (item.id === currentId) return false;

    const itemCol = Math.round(item.position.x / cellWidth);
    const itemRow = Math.round(item.position.y / cellHeight);

    // Check if rectangles overlap
    return !(
      gridCol + size.cols <= itemCol ||
      itemCol + item.size.cols <= gridCol ||
      gridRow + size.rows <= itemRow ||
      itemRow + item.size.rows <= gridRow
    );
  });

  return !collision;
};

// Ensure grid capacity
const ensureGridCapacity = (items) => {
  const cellHeight = GRID_CELL_SIZE + GRID_GAP;

  // Calculate the maximum row required by the items
  const maxRow = items.reduce((max, item) => {
    const itemBottomRow = Math.ceil(
      (item.position.y + item.size.rows * cellHeight) / cellHeight
    );
    return Math.max(max, itemBottomRow);
  }, 0);

  // Expand GRID_ROWS if necessary
  if (maxRow > GRID_ROWS) {
    GRID_ROWS = maxRow;
  }
};

// BentoItem component
const BentoItem = ({
  id,
  content,
  position,
  size,
  onResize,
  onDelete,
  onMove,
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

  // Handle resize selection
  const handleResizeSelect = (newSize) => {
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
      ref={drag}
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

// Grid cell component for drop targets
const GridCell = ({ x, y, children, onDrop }) => {
  const [{ isOver }, drop] = useDrop({
    accept: ItemTypes.BENTO_ITEM,
    drop: (item) => {
      onDrop(item.id, { x, y });
      return undefined;
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  return (
    <div
      ref={drop}
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

// Grid background component
const GridBackground = () => {
  const cellWidth = GRID_CELL_SIZE + GRID_GAP;
  const cellHeight = GRID_CELL_SIZE + GRID_GAP;

  // Create a grid of cells to visualize the grid
  const cells = [];
  for (let row = 0; row < GRID_ROWS; row++) {
    for (let col = 0; col < GRID_COLUMNS; col++) {
      cells.push(
        <div
          key={`cell-${row}-${col}`}
          className=""
          style={{
            position: "absolute",
            left: col * cellWidth,
            top: row * cellHeight,
            width: GRID_CELL_SIZE,
            height: GRID_CELL_SIZE,
          }}
        />
      );
    }
  }

  return <>{cells}</>;
};

// Separate grid component to contain the drag and drop functionality
const BentoGridContent = () => {
  const [items, setItems] = useState([
    {
      id: uuidv4(),
      content: "Welcome 👋",
      position: { x: 0, y: 0 },
      size: { cols: 1, rows: 1 },
    },
    {
      id: uuidv4(),
      content: "About Me",
      position: { x: GRID_CELL_SIZE + GRID_GAP, y: 0 },
      size: { cols: 2, rows: 1 },
    },
    {
      id: uuidv4(),
      content: "Projects",
      position: { x: 0, y: GRID_CELL_SIZE + GRID_GAP },
      size: { cols: 1, rows: 2 },
    },
    {
      id: uuidv4(),
      content: "Contact",
      position: { x: GRID_CELL_SIZE + GRID_GAP, y: GRID_CELL_SIZE + GRID_GAP },
      size: { cols: 2, rows: 2 },
    },
  ]);

  const gridRef = useRef(null);

  // Ensure grid capacity whenever items change
  React.useEffect(() => {
    ensureGridCapacity(items);
  }, [items]);

  // Create drop cells
  const dropCells = [];
  const cellWidth = GRID_CELL_SIZE + GRID_GAP;
  const cellHeight = GRID_CELL_SIZE + GRID_GAP;

  for (let row = 0; row < GRID_ROWS; row++) {
    for (let col = 0; col < GRID_COLUMNS; col++) {
      const x = col * cellWidth;
      const y = row * cellHeight;

      dropCells.push(
        <GridCell
          key={`drop-${row}-${col}`}
          x={x}
          y={y}
          onDrop={(id, position) => {
            const item = items.find((i) => i.id === id);
            if (item) {
              const isValid = isPositionValid({ x, y }, item.size, items, id);
              if (isValid) {
                moveItem(id, x, y);
              }
            }
          }}
        />
      );
    }
  }

  // Setup main drop for dragging items
  const [, drop] = useDrop({
    accept: ItemTypes.BENTO_ITEM,
    drop: (item, monitor) => {
      if (!item || !monitor) return; // Add null check for item and monitor

      const delta = monitor.getDifferenceFromInitialOffset();
      if (!delta) return; // Add null check for delta

      // Calculate raw position
      const rawX = (item.position?.x || 0) + delta.x; // Add null-safe access for item.position
      const rawY = (item.position?.y || 0) + delta.y;

      // Snap to grid
      const snapped = snapToGrid(rawX, rawY);

      // Check if position is valid
      const isValid = isPositionValid(snapped, item.size, items, item.id);

      if (isValid) {
        moveItem(item.id, snapped.x, snapped.y);
      } else {
        // Return to original position if invalid
        moveItem(item.id, item.position?.x || 0, item.position?.y || 0); // Add null-safe fallback
      }

      return undefined;
    },
    hover: (item, monitor) => {
      if (!item || !monitor) return; // Add null check for item and monitor
    },
  });

  // Move item
  const moveItem = (id, x, y) => {
    setItems(
      items.map((item) => {
        if (item.id === id) {
          return { ...item, position: { x, y } };
        }
        return item;
      })
    );
  };

  // Resize item
  const resizeItem = (id, newSize) => {
    setItems(
      items.map((item) => {
        if (item.id === id) {
          return { ...item, size: { cols: newSize.cols, rows: newSize.rows } };
        }
        return item;
      })
    );
  };

  // Delete item
  const deleteItem = (id) => {
    setItems(items.filter((item) => item.id !== id));
  };

  // Add new item
  const addNewItem = () => {
    // Find a free spot in the grid
    const cellWidth = GRID_CELL_SIZE + GRID_GAP;
    const cellHeight = GRID_CELL_SIZE + GRID_GAP;

    // Try positions until we find a valid one
    for (let row = 0; row < GRID_ROWS; row++) {
      for (let col = 0; col < GRID_COLUMNS; col++) {
        const position = { x: col * cellWidth, y: row * cellHeight };
        const size = { cols: 1, rows: 1 }; // Start with smallest size

        if (isPositionValid(position, size, items, null)) {
          const newItem = {
            id: uuidv4(),
            content: "New Item",
            position,
            size,
          };

          setItems((prevItems) => [...prevItems, newItem]);
          return;
        }
      }
    }

    // If no space is available, expand the grid and retry
    GRID_ROWS += 2;
    addNewItem();
  };

  const gridWidth = GRID_COLUMNS * cellWidth - GRID_GAP;
  const gridHeight = GRID_ROWS * cellHeight - GRID_GAP;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          
          <button
            onClick={addNewItem}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add New Item
          </button>
        </div>

        <div
          ref={gridRef}
          className="relative rounded-xl  mx-auto"
          style={{
            width: `${gridWidth}px`,
            height: `${gridHeight}px`,
            background: "white",
          }}
        >
          {/* Grid background */}
          <GridBackground />

          {/* Drop zones */}
          <div ref={drop} className="absolute inset-0">
            {dropCells}

            {/* Items */}
            {items.map((item) => (
              <BentoItem
                key={item.id}
                id={item.id}
                content={item.content}
                position={item.position}
                size={item.size}
                onResize={resizeItem}
                onDelete={deleteItem}
                onMove={moveItem}
                items={items}
              />
            ))}
          </div>
        </div>

        <div className="mt-6 text-center text-gray-500">
          <p>
            Drag items to reposition on the grid. Hover over an item to resize
            or delete.
          </p>
        </div>
      </div>
    </div>
  );
};

// Main component
const BentoGrid = () => {
  return (
    <DndProvider backend={HTML5Backend}>
      <BentoGridContent />
    </DndProvider>
  );
};

export default BentoGrid;
