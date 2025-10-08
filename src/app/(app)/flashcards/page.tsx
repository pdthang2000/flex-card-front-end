'use client';

import React, { useMemo, useState } from 'react';
import {Segmented, Button, App, Table, Flex, Space} from 'antd';
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

  const { data, isFetching, isError } = useListFlashcards({ page, size });
  const items = data?.data?.items ?? [];
  const total = data?.data?.pagination?.total ?? 0;

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
          <Button onClick={toggleLayout}>
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
        <NeonBoard items={items} />
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
// NeonBoard
// -----------------------------
const NeonBoard = ({ items }: { items: Flashcard[] }) => {
  const { message } = App.useApp();
  const [cards, setCards] = useState(() => items);
  const [flipAll, setFlipAll] = useState(false);

  React.useEffect(() => setCards(items), [items]);

  const shuffle = () => {
    setCards((prev) => {
      const a = [...prev];
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
      }
      return a;
    });
  };

  return (
    <div>
      <Flex gap={12} className="mb-4">
        <Button onClick={shuffle}>Shuffle</Button>
        <Button
          type={flipAll ? "primary" : "default"}
          onClick={() => setFlipAll((s) => !s)}
        >
          {flipAll ? "Unflip All" : "Flip All"}
        </Button>
      </Flex>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-6">
        {cards.map((c) => (
          <NeonCard key={c.id} title={c.front} back={c.back} flipAll={flipAll} />
        ))}
      </div>
    </div>
  );
};

// -----------------------------
// NeonCard (with vertical flip)
// -----------------------------
const NeonCard = ({
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
            "flex items-center justify-center text-xl font-bold tracking-wide",
            "ring-2 ring-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.6)]",
            "neon-border",
            "[backface-visibility:hidden]",
          ].join(" ")}
        >
          {title}
        </div>

        {/* BACK */}
        <div
          className={[
            "absolute inset-0 rounded-2xl bg-slate-950/80",
            "flex items-center justify-center text-base font-semibold text-cyan-100",
            "ring-2 ring-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.6)]",
            "neon-border",
            "[transform:rotateX(180deg)] [backface-visibility:hidden]",
          ].join(" ")}
        >
          {back}
        </div>

        <div
          aria-hidden
          className="pointer-events-none absolute -right-2 -bottom-2 w-full h-full rounded-2xl border border-cyan-400/40 blur-[1px] opacity-60"
        />
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