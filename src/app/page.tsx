"use client";

import React from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import BentoGridContent from "@/components/BentoGrid/BentoGridContent";

// Main component
const BentoGrid = () => {
  return (
    <DndProvider backend={HTML5Backend}>
      <BentoGridContent />
    </DndProvider>
  );
};

export default BentoGrid;
