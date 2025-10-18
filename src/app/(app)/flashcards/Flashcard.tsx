import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Collapse, Dropdown } from "antd";
import type { MenuProps } from "antd";
import { CaretRightOutlined, MoreOutlined, TagFilled } from "@ant-design/icons";
import type { Flashcard as FlashcardType, Tag } from "@/types";

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

  const tags = useMemo(() => {
    if (Array.isArray(card._tags) && card._tags.length) {
      return card._tags;
    }
    return [];
  }, [card]);

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

  const collapseItems = useMemo(
    () => [
      {
        key: "tags",
        label: (
          <span className="flex items-center gap-2 text-slate-200">
            <TagFilled className="text-white" />
            Tags{tags.length ? ` (${tags.length})` : ""}
          </span>
        ),
        children: tags.length ? (
          <div className="flashcard-tags-scroll flashcard-scroll flex flex-wrap gap-2 pr-1">
            {tags.map((tag: Tag) => (
              <span
                key={tag.id ?? tag.name}
                className="inline-flex items-center gap-2 rounded-full bg-slate-800/80 px-3 py-1 text-xs text-slate-100"
              >
                <TagFilled className="text-white" />
                {tag.name}
              </span>
            ))}
          </div>
        ) : (
          <span className="text-xs text-slate-400">No tags assigned</span>
        ),
      },
    ],
    [tags]
  );

  return (
    <div className="flex flex-col gap-3">
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
              "absolute inset-0 rounded-2xl bg-sub-main",
              "flex items-center justify-center text-base font-semibold tracking-wide text-white",
              "overflow-hidden",
              "[backface-visibility:hidden]",
            ].join(" ")}
          >
            <span className="flashcard-ribbon flashcard-ribbon--front">Front</span>
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
              "overflow-hidden",
              "[transform:rotateX(180deg)] [backface-visibility:hidden]",
            ].join(" ")}
          >
            <span className="flashcard-ribbon flashcard-ribbon--back">Back</span>
            {renderActionButton()}
            <div className="flex h-full w-full items-center justify-center px-6 py-4">
              <p className="flashcard-scroll max-h-full w-full overflow-y-auto pr-2 text-center break-all whitespace-pre-wrap">
                {card.back}
              </p>
            </div>
          </div>
        </div>
      </div>

      <Collapse
        items={collapseItems}
        size="small"
        ghost
        className="flashcard-tags-collapse"
        expandIcon={({ isActive }) => (
          <CaretRightOutlined
            rotate={isActive ? 90 : 0}
            style={{ color: "#fff", fontSize: 12 }}
          />
        )}
      />
    </div>
  );
};

export default Flashcard;
