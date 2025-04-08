import React from "react";
import { GRID_CELL_SIZE, GRID_GAP, GRID_COLUMNS } from "@/constants/grid";
import { getGridRows } from "@/utils/gridUtils";

const GridBackground: React.FC = () => {
  const cellWidth = GRID_CELL_SIZE + GRID_GAP;
  const cellHeight = GRID_CELL_SIZE + GRID_GAP;
  const GRID_ROWS = getGridRows();

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

export default GridBackground;
