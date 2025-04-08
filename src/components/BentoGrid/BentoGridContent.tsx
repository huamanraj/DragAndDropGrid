import React, { useState, useRef, useEffect } from "react";
import { useDrop } from "react-dnd";
import { v4 as uuidv4 } from "uuid";
import { GRID_CELL_SIZE, GRID_GAP, GRID_COLUMNS, ItemTypes } from "@/constants/grid";
import { snapToGrid, isPositionValid, ensureGridCapacity, getGridRows, setGridRows } from "@/utils/gridUtils";
import BentoItem from "./BentoItem";
import GridCell from "./GridCell";
import GridBackground from "./GridBackground";

const BentoGridContent: React.FC = () => {
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
  const dropRef = useRef<HTMLDivElement | null>(null);

  // Ensure grid capacity whenever items change
  useEffect(() => {
    ensureGridCapacity(items);
  }, [items]);

  // Create drop cells
  const dropCells = [];
  const cellWidth = GRID_CELL_SIZE + GRID_GAP;
  const cellHeight = GRID_CELL_SIZE + GRID_GAP;
  const GRID_ROWS = getGridRows();

  for (let row = 0; row < GRID_ROWS; row++) {
    for (let col = 0; col < GRID_COLUMNS; col++) {
      const x = col * cellWidth;
      const y = row * cellHeight;

      dropCells.push(
        <GridCell
          key={`drop-${row}-${col}`}
          x={x}
          y={y}
          onDrop={(id) => {
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
    drop: (item: { id: string; position: { x: number; y: number }; size: { cols: number; rows: number } }, monitor) => {
      if (!item || !monitor) return;

      const delta = monitor.getDifferenceFromInitialOffset();
      if (!delta) return;

      const rawX = (item.position?.x || 0) + delta.x;
      const rawY = (item.position?.y || 0) + delta.y;

      const snapped = snapToGrid(rawX, rawY);
      const isValid = isPositionValid(snapped, item.size, items, item.id);

      if (isValid) {
        moveItem(item.id, snapped.x, snapped.y);
      } else {
        moveItem(item.id, item.position?.x || 0, item.position?.y || 0);
      }

      return undefined;
    },
    hover: (item) => {
      if (!item) return;
    },
  });

  drop(dropRef);

  // Move item
  const moveItem = (id: string, x: number, y: number) => {
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
  const resizeItem = (id: string, newSize: { cols: number; rows: number }) => {
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
  const deleteItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  // Add new item
  const addNewItem = () => {
    // Find a free spot in the grid
    const cellWidth = GRID_CELL_SIZE + GRID_GAP;
    const cellHeight = GRID_CELL_SIZE + GRID_GAP;

    // Try positions until we find a valid one
    for (let row = 0; row < getGridRows(); row++) {
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
    setGridRows(getGridRows() + 2);
    addNewItem();
  };

  const gridWidth = GRID_COLUMNS * cellWidth - GRID_GAP;
  const gridHeight = getGridRows() * cellHeight - GRID_GAP;

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
          className="relative rounded-xl mx-auto"
          style={{
            width: `${gridWidth}px`,
            height: `${gridHeight}px`,
            background: "white",
          }}
        >
          {/* Grid background */}
          <GridBackground />

          {/* Drop zones */}
          <div className="absolute inset-0" ref={dropRef}>
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

export default BentoGridContent;
