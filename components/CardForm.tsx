// components/CardForm.tsx
"use client";
import { useState } from "react";
import { Card, CardContent, CardContentType, CardSize } from "../types/card";

interface CardFormProps {
  onSubmit: (cardData: Omit<Card, "id">) => void;
}

export default function CardForm({ onSubmit }: CardFormProps) {
  const [cardData, setCardData] = useState<Omit<Card, "id">>({
    size: "small",
    content: {
      type: "title-only",
      title: "",
      description: "",
      image: "",
    },
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    if (name === "type") {
      setCardData({
        ...cardData,
        content: {
          ...cardData.content,
          type: value as CardContentType,
        },
      });
    } else if (["title", "description", "image"].includes(name)) {
      setCardData({
        ...cardData,
        content: {
          ...cardData.content,
          [name]: value,
        },
      });
    } else if (name === "size") {
      setCardData({
        ...cardData,
        size: value as CardSize,
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(cardData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-4 rounded-lg shadow-md mb-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block mb-2">Card Type</label>
          <select
            name="type"
            value={cardData.content.type}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="title-only">Title Only</option>
            <option value="image-title">Image + Title</option>
            <option value="full">Image + Title + Description</option>
          </select>
        </div>

        <div>
          <label className="block mb-2">Initial Size</label>
          <select
            name="size"
            value={cardData.size}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="small">Small (1x1)</option>
            <option value="medium">Medium (2x1)</option>
          </select>
        </div>

        <div>
          <label className="block mb-2">Title</label>
          <input
            type="text"
            name="title"
            value={cardData.content.title}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        {cardData.content.type !== "title-only" && (
          <div>
            <label className="block mb-2">Image URL</label>
            <input
              type="url"
              name="image"
              value={cardData.content.image}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required={cardData.content.type !== "title-only"}
            />
          </div>
        )}

        {cardData.content.type === "full" && (
          <div className="md:col-span-2">
            <label className="block mb-2">Description</label>
            <textarea
              name="description"
              value={cardData.content.description}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              rows={3}
              required={cardData.content.type === "full"}
            />
          </div>
        )}
      </div>

      <div className="mt-4 flex justify-end">
        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Add Card
        </button>
      </div>
    </form>
  );
}
