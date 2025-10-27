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
  variant?: "default" | "large";
};

const Flashcard = ({ card, flipAll, onEdit, onDelete, variant = "default" }: FlashcardProps) => {
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
      setFlipped((prev) => !prev);
      if (key === "edit") {
        onEdit(card);
        return;
      }
      if (key === "delete") {
        onDelete(card);
      }
    },
    [card, onDelete, onEdit]
  );

  const renderActionButton = () => (
    <Dropdown menu={{ items: MENU_ITEMS, onClick: handleMenuClick }} trigger={["click"]}>
      <button
        type="button"
        className={[
          "absolute z-10 flex items-center justify-center rounded-full bg-slate-800/80 text-slate-100 hover:bg-slate-700 cursor-pointer",
          variant === "large"
            ? "right-4 top-4 h-12 w-12 text-lg"
            : "right-2 top-2 h-8 w-8 text-base",
        ].join(" ")}
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

  const caretSize = useMemo(() => (variant === "large" ? 20 : 16), [variant]);

  const collapseItems = useMemo(
    () => [
      {
        key: "tags",
        children: tags.length ? (
          <div className="flashcard-tags-scroll flashcard-scroll flex flex-wrap gap-2 pr-1">
            {tags.map((tag: Tag) => (
              <span
                key={tag.id ?? tag.name}
                className={[
                  "inline-flex items-center gap-2 rounded-full bg-slate-800/80 px-3 py-1 text-slate-100",
                  variant === "large" ? "text-base" : "text-xs",
                ].join(" ")}
              >
                <TagFilled className="text-white" />
                {tag.name}
              </span>
            ))}
          </div>
        ) : (
          <span className={variant === "large" ? "text-base text-slate-400" : "text-xs text-slate-400"}>
            No tags assigned
          </span>
        ),
      },
    ],
    [tags, variant, caretSize]
  );

  return (
    <div
      className={[
        "flex flex-col gap-3",
        variant === "large"
          ? "mx-auto w-full max-w-[min(92vw,900px)] sm:max-w-[66vw] gap-6"
          : "",
      ].join(" ")}
    >
      <div
        className={[
          "relative [perspective:1200px]",
          variant === "large"
            ? "w-full h-[70vh] min-h-[420px] max-h-[720px] sm:h-[66vh]"
            : "h-36 sm:h-40 md:h-44",
        ].join(" ")}
      >
        <div
          className={[
            "group relative w-full h-full",
            variant === "large" ? "rounded-3xl" : "rounded-2xl",
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
              "absolute inset-0 bg-sub-main",
              variant === "large" ? "rounded-3xl" : "rounded-2xl",
              "flex items-center justify-center font-semibold tracking-wide text-white",
              variant === "large" ? "text-2xl md:text-3xl" : "text-base",
              "overflow-hidden",
              "[backface-visibility:hidden]",
            ].join(" ")}
          >
            <span className="flashcard-ribbon flashcard-ribbon--front">Front</span>
            {renderActionButton()}
            <div
              className={[
                "flex h-full w-full items-center justify-center",
                variant === "large" ? "px-10 py-12" : "px-6 py-4",
              ].join(" ")}
            >
              <p
                className={[
                  "flashcard-scroll max-h-full w-full overflow-y-auto pr-2 text-center break-all whitespace-pre-wrap",
                  variant === "large" ? "text-2xl leading-relaxed" : "",
                ].join(" ")}
              >
                {card.front}
              </p>
            </div>
          </div>

          {/* BACK */}
          <div
            className={[
              "absolute inset-0 bg-slate-700/70",
              variant === "large" ? "rounded-3xl" : "rounded-2xl",
              "flex items-center justify-center font-medium text-slate-200",
              variant === "large" ? "text-2xl md:text-3xl" : "text-base",
              "overflow-hidden",
              "[transform:rotateX(180deg)] [backface-visibility:hidden]",
            ].join(" ")}
          >
            <span className="flashcard-ribbon flashcard-ribbon--back">Back</span>
            {renderActionButton()}
            <div
              className={[
                "flex h-full w-full items-center justify-center",
                variant === "large" ? "px-10 py-12" : "px-6 py-4",
              ].join(" ")}
            >
              <p
                className={[
                  "flashcard-scroll max-h-full w-full overflow-y-auto pr-2 text-center break-all whitespace-pre-wrap",
                  variant === "large" ? "text-2xl leading-relaxed" : "",
                ].join(" ")}
              >
                {card.back}
              </p>
            </div>
          </div>
        </div>
      </div>

      <Collapse
        items={collapseItems}
        ghost
        expandIcon={({ isActive }) => (
          <>
            <CaretRightOutlined
              rotate={isActive ? 90 : 0}
              style={{color: "#fff", fontSize: caretSize, paddingRight: "0.5rem"}}
            />
            <TagFilled
              style={{color: "#fff", fontSize: caretSize, paddingRight: "0.25rem"}}
            />
            <span
              className={[
                "flex items-center gap-2 text-slate-200",
                variant === "large" ? "text-lg" : "",
              ].join(" ")}
            >
            Tags{tags.length ? ` (${tags.length})` : ""}
          </span>
          </>
        )}
      />
    </div>
  );
};

export default Flashcard;
