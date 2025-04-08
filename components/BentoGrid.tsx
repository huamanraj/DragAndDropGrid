// components/BentoGrid.tsx
"use client";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Card as CardType } from "../types/card";
import CardComponent from "./Card";

interface BentoGridProps {
  cards: CardType[];
  moveCard: (dragIndex: number, hoverIndex: number) => void;
  onResize: (id: number, delta: { width: number; height: number }) => void;
}

export default function BentoGrid({
  cards,
  moveCard,
  onResize,
}: BentoGridProps) {
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-min">
        {cards.map((card, index) => (
          <CardComponent
            key={card.id}
            id={card.id}
            index={index}
            size={card.size}
            content={card.content}
            moveCard={moveCard}
            onResize={onResize}
          />
        ))}
      </div>
    </DndProvider>
  );
}
