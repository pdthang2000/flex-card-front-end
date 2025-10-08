'use client';

import React, { useMemo, useState, useEffect, useCallback } from 'react';
import {Segmented, Button, Table, Space, Flex} from 'antd';
import { useSearchParams, useRouter } from 'next/navigation';
import { useListFlashcards } from '@/hooks/useFlashcards';

export type Flashcard = {
  id: string;
  front: string;
  back: string;
  tagIds?: string[];
  createdAt?: string;
};

const FlashcardsPage = () => {
  const sp = useSearchParams();
  const router = useRouter();

  const page = Number(sp.get("page") ?? 1);
  const size = Number(sp.get("size") ?? 20);
  const layout = (sp.get("layout") ?? "board") as "board" | "table";

  const { data, isError } = useListFlashcards({ page, size });
  const items = data?.data?.items ?? [];

  const toggleLayout = () => {
    const next = layout === "board" ? "table" : "board";
    const qs = new URLSearchParams(sp.toString());
    qs.set("layout", next);
    qs.set("page", String(page));
    qs.set("size", String(size));
    router.push(`/flashcards?${qs.toString()}`);
  };

  const setLayout = (next: "board" | "table") => {
    const qs = new URLSearchParams(sp.toString());
    qs.set("layout", next);
    qs.set("page", String(page));
    qs.set("size", String(size));
    router.push(`/flashcards?${qs.toString()}`);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6 ">
      <Flex justify="space-between" align="center" className="mb-6">
        <h1 className="text-2xl font-semibold tracking-wide">Flashcards</h1>
        <Space>
          <Button type="primary" onClick={toggleLayout}>
            Switch to {layout === "board" ? "Table" : "Board"} View
          </Button>
          <Segmented
            options={[
              { label: "Board", value: "board" },
              { label: "Table", value: "table" },
            ]}
            value={layout}
            onChange={(v) => setLayout(v as "board" | "table")}
          />
        </Space>
      </Flex>

      {layout === "board" ? (
        <BoardView items={items} />
      ) : (
        <SimpleTable items={items} />
      )}

      {isError && (
        <div className="text-red-400 mt-4">Failed to load flashcards.</div>
      )}
    </div>
  );
};

// -----------------------------
// BoardView
// -----------------------------
const BoardView = ({ items }: { items: Flashcard[] }) => {
  const [cards, setCards] = useState(items);
  const [flipAll, setFlipAll] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);

  useEffect(() => {
    setCards(items);
    setFlipAll(false);
    setIsShuffled(false);
  }, [items]);

  const shuffleItems = useCallback(() => {
    const shuffled = [...items];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }, [items]);

  const toggleShuffle = () => {
    if (isShuffled) {
      setCards(items);
      setIsShuffled(false);
    } else {
      setCards(shuffleItems());
      setIsShuffled(true);
    }
  };

  return (
    <div>
      <div className="mb-4 flex w-full flex-col gap-3 sm:flex-row sm:gap-4">
        <Button
          className="w-full sm:w-auto"
          type={isShuffled ? "primary" : "default"}
          onClick={toggleShuffle}
        >
          {isShuffled ? "Shuffled" : "Shuffle"}
        </Button>
        <Button
          className="w-full sm:w-auto"
          type={flipAll ? "primary" : "default"}
          onClick={() => setFlipAll((s) => !s)}
        >
          {flipAll ? "Unflip All" : "Flip All"}
        </Button>
      </div>
      <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5">
        {cards.map((c) => (
          <CardTile key={c.id} title={c.front} back={c.back} flipAll={flipAll} />
        ))}
      </div>
    </div>
  );
};

// -----------------------------
// CardTile (with vertical flip)
// -----------------------------
const CardTile = ({
                    title,
                    back,
                    flipAll,
                  }: {
  title: string;
  back: string;
  flipAll: boolean;
}) => {
  const [flipped, setFlipped] = useState(false);
  const isFlipped = flipAll ? true : flipped;

  return (
    <div className="relative h-36 sm:h-40 md:h-44 [perspective:1200px]">
      <button
        className={[
          "group relative w-full h-full rounded-2xl",
          "transition-transform duration-500 [transform-style:preserve-3d]",
          isFlipped ? "[transform:rotateX(180deg)]" : "",
        ].join(" ")}
        onClick={() => setFlipped((s) => !s)}
      >
        {/* FRONT */}
        <div
          className={[
            "absolute inset-0 rounded-2xl bg-slate-800/80",
            "flex items-center justify-center text-xl font-semibold tracking-wide text-white",
            "[backface-visibility:hidden]",
          ].join(" ")}
        >
          {title}
        </div>

        {/* BACK */}
        <div
          className={[
            "absolute inset-0 rounded-2xl bg-slate-700/70",
            "flex items-center justify-center text-base font-medium text-slate-200 px-3 text-center",
            "[transform:rotateX(180deg)] [backface-visibility:hidden]",
          ].join(" ")}
        >
          {back}
        </div>
      </button>
    </div>
  );
};

// -----------------------------
// SimpleTable
// -----------------------------
const SimpleTable = ({ items }: { items: Flashcard[] }) => {
  const columns = useMemo(
    () => [
      { title: "Front", dataIndex: "front", key: "front" },
      { title: "Back", dataIndex: "back", key: "back" },
    ],
    []
  );

  return (
    <Table
      rowKey={(r) => r.id}
      dataSource={items}
      columns={columns as any}
      pagination={false}
    />
  );
};

export default FlashcardsPage;
