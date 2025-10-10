import React, { useCallback, useEffect, useState } from "react";
import { Dropdown } from "antd";
import type { MenuProps } from "antd";
import { MoreOutlined } from "@ant-design/icons";
import type { Flashcard as FlashcardType } from "@/hooks/useFlashcards";

const MENU_ITEMS: MenuProps["items"] = [
  { key: "edit", label: "Edit" },
  { key: "delete", label: "Delete", danger: true },
];

type FlashcardProps = {
  card: FlashcardType;
  flipAll: boolean;
  onEdit: (card: FlashcardType) => void;
  onDelete: (card: FlashcardType) => void;
};

const Flashcard = ({ card, flipAll, onEdit, onDelete }: FlashcardProps) => {
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    setFlipped(flipAll);
  }, [flipAll]);

  const toggleFlip = useCallback(() => setFlipped((s) => !s), []);

  const handleMenuClick = useCallback<NonNullable<MenuProps["onClick"]>>(
    ({ key }) => {
      if (key === "edit") {
        toggleFlip();
        onEdit(card);
        return;
      }
      if (key === "delete") {
        onDelete(card);
      }
    },
    [card, onDelete, onEdit, toggleFlip]
  );

  const renderActionButton = () => (
    <Dropdown menu={{ items: MENU_ITEMS, onClick: handleMenuClick }} trigger={["click"]}>
      <button
        type="button"
        className="absolute right-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-slate-800/80 text-slate-100 hover:bg-slate-700 cursor-pointer"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        <MoreOutlined />
      </button>
    </Dropdown>
  );

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        toggleFlip();
      }
    },
    [toggleFlip]
  );

  return (
    <div className="relative h-36 sm:h-40 md:h-44 [perspective:1200px]">
      <div
        className={[
          "group relative w-full h-full rounded-2xl",
          "transition-transform duration-500 [transform-style:preserve-3d]",
          flipped ? "[transform:rotateX(180deg)]" : "",
        ].join(" ")}
        role="button"
        tabIndex={0}
        onClick={toggleFlip}
        onKeyDown={handleKeyDown}
      >
        {/* FRONT */}
        <div
          className={[
            "absolute inset-0 rounded-2xl bg-slate-800/80",
            "flex items-center justify-center text-base font-semibold tracking-wide text-white",
            "[backface-visibility:hidden]",
          ].join(" ")}
        >
          {renderActionButton()}
          <div className="flex h-full w-full items-center justify-center px-6 py-4">
            <p className="flashcard-scroll max-h-full w-full overflow-y-auto pr-2 text-center break-all whitespace-pre-wrap">
              {card.front}
            </p>
          </div>
        </div>

        {/* BACK */}
        <div
          className={[
            "absolute inset-0 rounded-2xl bg-slate-700/70",
            "flex items-center justify-center text-base font-medium text-slate-200",
            "[transform:rotateX(180deg)] [backface-visibility:hidden]",
          ].join(" ")}
        >
          {renderActionButton()}
          <div className="flex h-full w-full items-center justify-center px-6 py-4">
            <p className="flashcard-scroll max-h-full w-full overflow-y-auto pr-2 text-center break-all whitespace-pre-wrap">
              {card.back}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Flashcard;
