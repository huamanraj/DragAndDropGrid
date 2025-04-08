// types/card.ts
export type CardContentType = "full" | "image-title" | "title-only";
export type CardSize = "small" | "medium";

export interface CardContent {
  type: CardContentType;
  title: string;
  description?: string;
  image?: string;
}

export interface Card {
  id: number;
  size: CardSize;
  content: CardContent;
}
