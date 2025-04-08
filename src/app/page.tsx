"use client";

import React from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import BentoGridContent from "@/components/BentoGrid/BentoGridContent";

// Main component
const BentoGrid = () => {
  return (
    <>
      <head>
        <meta
          name="description"
          content="Easily create and customize your grid layout with our drag-and-drop interface. Perfect for projects, portfolios, and more."
        />
      </head>
      <DndProvider backend={HTML5Backend}>
        <h1>Drag and Drop Grid - Customize Your Layout</h1>
        <BentoGridContent />
      </DndProvider>
    </>
  );
};

export default BentoGrid;
