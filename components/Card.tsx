// components/Card.tsx
"use client";
import { useRef } from "react";
import Image from "next/image";
import { useDrag, useDrop } from "react-dnd";
import { Resizable } from "re-resizable";
import { motion } from "framer-motion";
import { Card as CardType, CardContent } from "../types/card";

interface CardProps {
  id: number;
  index: number;
  size: CardType["size"];
  content: CardContent;
  moveCard: (dragIndex: number, hoverIndex: number) => void;
  onResize: (id: number, delta: { width: number; height: number }) => void;
}

interface DragItem {
  id: number;
  index: number;
}

export default function Card({
  id,
  size,
  content,
  index,
  moveCard,
  onResize,
}: CardProps) {
  const ref = useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag] = useDrag({
    type: "card",
    item: () => ({ id, index }),
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop<DragItem>({
    accept: "card",
    hover: (item, monitor) => {
      if (!ref.current) return;
      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) return;
      moveCard(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  drag(drop(ref));

  const renderContent = () => {
    switch (content.type) {
      case "full":
        return (
          <>
            {content.image && (
              <div className="relative w-full h-40">
                <Image
                  src={content.image}
                  alt={content.title}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-t-lg"
                />
              </div>
            )}
            <h3 className="text-lg font-bold p-3">{content.title}</h3>
            <p className="px-3 pb-3 text-gray-600">{content.description}</p>
          </>
        );
      case "image-title":
        return (
          <>
            {content.image && (
              <div className="relative w-full h-40">
                <Image
                  src={content.image}
                  alt={content.title}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-t-lg"
                />
              </div>
            )}
            <h3 className="text-lg font-bold p-3">{content.title}</h3>
          </>
        );
      case "title-only":
        return <h3 className="text-lg font-bold p-3">{content.title}</h3>;
      default:
        return null;
    }
  };

  const gridSize = size === "small" ? "col-span-1" : "col-span-2";

  return (
    <div className={`${gridSize} transition-all duration-300`}>
      <Resizable
        defaultSize={{
          width: "100%",
          height: "auto",
        }}
        enable={{
          top: false,
          right: true,
          bottom: true,
          left: false,
          topRight: false,
          bottomRight: true,
          bottomLeft: false,
          topLeft: false,
        }}
        onResizeStop={(e, direction, ref, d) => {
          onResize(id, d);
        }}
      >
        <motion.div
          ref={ref}
          className={`bg-white rounded-lg shadow-md overflow-hidden cursor-move h-full ${
            isDragging ? "opacity-50" : "opacity-100"
          } hover:shadow-lg transition-shadow`}
          whileHover={{ scale: 1.02 }}
          layoutId={`card-${id}`}
        >
          {renderContent()}
        </motion.div>
      </Resizable>
    </div>
  );
}
