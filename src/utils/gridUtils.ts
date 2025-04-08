import { GRID_CELL_SIZE, GRID_GAP, GRID_COLUMNS } from "@/constants/grid";

// Mutable grid rows value
let GRID_ROWS = 4;

// Calculate grid position
export const snapToGrid = (x: number, y: number): { x: number; y: number } => {
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
export const isPositionValid = (
  position: { x: number; y: number },
  size: { cols: number; rows: number },
  items: { id: string; position: { x: number; y: number }; size: { cols: number; rows: number } }[],
  currentId: string | null
): boolean => {
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
export const ensureGridCapacity = (
  items: { id: string; position: { x: number; y: number }; size: { cols: number; rows: number } }[]
) => {
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

  return GRID_ROWS;
};

export const getGridRows = () => GRID_ROWS;
export const setGridRows = (rows: number) => {
  GRID_ROWS = rows;
};
