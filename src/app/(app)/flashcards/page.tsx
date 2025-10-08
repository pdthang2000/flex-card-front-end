'use client';

import React, { useMemo, useState, useEffect, useCallback } from "react";
import { Segmented, Button, Table, Space, Flex, Dropdown, Modal, Form, Input, App } from "antd";
import type { MenuProps } from "antd";
import { MoreOutlined } from "@ant-design/icons";
import { useSearchParams, useRouter } from "next/navigation";
import { useListFlashcards, useUpdateFlashcard, useCreateFlashcard } from "@/hooks/useFlashcards";
import "./flashcards.css";

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

// BoardView
// -----------------------------
const BoardView = ({ items }: { items: Flashcard[] }) => {
  const [cards, setCards] = useState(items);
  const [flipAll, setFlipAll] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);
  const [editingCard, setEditingCard] = useState<Flashcard | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isCreateOpen, setCreateOpen] = useState(false);
  const [form] = Form.useForm();
  const [createForm] = Form.useForm();
  const updateFlashcard = useUpdateFlashcard();
  const createFlashcard = useCreateFlashcard();
  const { message } = App.useApp();

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

  const handleEdit = (card: Flashcard) => {
    setEditingCard(card);
    form.setFieldsValue({ front: card.front, back: card.back });
    setModalOpen(true);
  };

  const handleOpenCreate = () => {
    createForm.resetFields();
    setCreateOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setEditingCard(null);
    form.resetFields();
  };

  const handleCreateClose = () => {
    setCreateOpen(false);
    createForm.resetFields();
  };

  const handleUpdate = async () => {
    try {
      const values = await form.validateFields();
      if (!editingCard) {
        return;
      }
      await updateFlashcard.mutateAsync({
        id: editingCard.id,
        front: values.front,
        back: values.back,
      });
      setCards((prev) =>
        prev.map((card) =>
          card.id === editingCard.id
            ? { ...card, front: values.front, back: values.back }
            : card
        )
      );
      handleModalClose();
      message.success("Flashcard updated");
    } catch (err) {
      // validation errors are handled by the form
      if ((err as any)?.errorFields) {
        return;
      }
      message.error("Failed to update flashcard");
    }
  };

  const handleCreate = async () => {
    try {
      const values = await createForm.validateFields();
      await createFlashcard.mutateAsync({
        front: values.front,
        back: values.back,
      });
      message.success("Flashcard created");
      handleCreateClose();
    } catch (err) {
      if ((err as any)?.errorFields) {
        return;
      }
      message.error("Failed to create flashcard");
    }
  };

  return (
    <>
      <div className="mb-4 flex w-full flex-col gap-3 sm:flex-row sm:gap-4">
        <Button
          className="w-full sm:w-auto"
          type="primary"
          onClick={handleOpenCreate}
        >
          Add
        </Button>
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
          <CardTile key={c.id} card={c} flipAll={flipAll} onEdit={handleEdit} />
        ))}
      </div>
      <Modal
        title="Add Flashcard"
        open={isCreateOpen}
        confirmLoading={createFlashcard.isPending}
        okText="Create"
        onCancel={handleCreateClose}
        onOk={handleCreate}
        rootClassName="flashcard-modal"
      >
        <Form form={createForm} layout="vertical">
          <Form.Item
            name="front"
            label="Front"
            rules={[{ required: true, message: "Front is required" }]}
          >
            <Input maxLength={100} />
          </Form.Item>
          <Form.Item
            name="back"
            label="Back"
            rules={[{ required: true, message: "Back is required" }]}
          >
            <Input.TextArea autoSize={{ minRows: 3 }} />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="Edit Flashcard"
        open={isModalOpen}
        confirmLoading={updateFlashcard.isPending}
        okText="Update"
        onCancel={handleModalClose}
        onOk={handleUpdate}
        rootClassName="flashcard-modal"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="front"
            label="Front"
            rules={[{ required: true, message: "Front is required" }]}
          >
            <Input maxLength={100} />
          </Form.Item>
          <Form.Item
            name="back"
            label="Back"
            rules={[{ required: true, message: "Back is required" }]}
          >
            <Input.TextArea autoSize={{ minRows: 3 }} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

// -----------------------------
// CardTile (with vertical flip)
// -----------------------------
const CardTile = ({
                    card,
                    flipAll,
                    onEdit,
                  }: {
  card: Flashcard;
  flipAll: boolean;
  onEdit: (card: Flashcard) => void;
}) => {
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    setFlipped(flipAll);
  }, [flipAll]);

  const isFlipped = flipped;
  const toggleFlip = useCallback(() => setFlipped((s) => !s), []);
  const menuItems: MenuProps["items"] = useMemo(
    () => [
      {
        key: "edit",
        label: "Edit",
      },
    ],
    []
  );
  const handleMenuClick = useCallback<NonNullable<MenuProps["onClick"]>>(
    ({ key }) => {
      if (key === "edit") {
        /* This setState is needed because if not, when we click the button,
          it'll automatically flip the card because it counted as click the card
        */
        toggleFlip();
        onEdit(card);
      }
    },
    [card, onEdit, toggleFlip]
  );

  const renderActionButton = () => (
    <Dropdown menu={{ items: menuItems, onClick: handleMenuClick }} trigger={["click"]}>
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
          isFlipped ? "[transform:rotateX(180deg)]" : "",
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
            "flex items-center justify-center text-xl font-semibold tracking-wide text-white",
            "[backface-visibility:hidden]",
          ].join(" ")}
        >
          {renderActionButton()}
          <span className="px-3 text-center">{card.front}</span>
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
          <span className="px-3 text-center">{card.back}</span>
        </div>
      </div>
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
