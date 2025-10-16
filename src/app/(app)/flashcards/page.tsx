'use client';

import React, { useMemo, useState, useEffect, useCallback } from "react";
import { Segmented, Button, Table, Space, Flex, Modal, Form, Input, App, Select } from "antd";
import { ClearOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { useSearchParams, useRouter } from "next/navigation";
import { useListFlashcards, useUpdateFlashcard, useCreateFlashcard, useDeleteFlashcard } from "@/hooks/useFlashcards";
import { useListTags } from "@/hooks/useTags";
import type { Flashcard as FlashcardType, Tag } from "@/types";
import "./flashcards.scss";
import Flashcard from "./Flashcard";

const FlashcardsPage = () => {
  const sp = useSearchParams();
  const router = useRouter();

  const page = Number(sp.get("page") ?? 1);
  const size = Number(sp.get("size") ?? 20);
  const layout = (sp.get("layout") ?? "board") as "board" | "table";
  const tagNamesParam = sp.get("tagNames") ?? "";
  const selectedTagNames = useMemo(
    () =>
      tagNamesParam
        .split(",")
        .map((name) => name.trim())
        .filter(Boolean),
    [tagNamesParam]
  );

  const [tagSearch, setTagSearch] = useState("");

  const joinedTagNames = selectedTagNames.length ? selectedTagNames.join(",") : undefined;

  const { data, isError } = useListFlashcards({ tagNames: joinedTagNames, page, size });

  const { data: tagResponse, isFetching: isTagsFetching } = useListTags({
    page: 1,
    size: 50,
    name: tagSearch || undefined,
  });
  const items = data?.data?.items ?? [];

  const tagOptions = useMemo(() => {
    const raw = tagResponse?.data?.items ?? [];
    const options = raw.map((tag) => ({
      label: tag.name,
      value: tag.name,
    }));
    selectedTagNames.forEach((name) => {
      if (!options.some((option) => option.value === name)) {
        options.push({ label: name, value: name });
      }
    });
    return options;
  }, [tagResponse, selectedTagNames]);

  const updateUrl = (updates: { layout?: string; page?: number; size?: number; tagNames?: string }) => {
    const qs = new URLSearchParams(sp.toString());
    if (updates.layout !== undefined) qs.set("layout", updates.layout);
    if (updates.page !== undefined) qs.set("page", String(updates.page));
    if (updates.size !== undefined) qs.set("size", String(updates.size));
    if (updates.tagNames !== undefined) {
      if (updates.tagNames) {
        qs.set("tagNames", updates.tagNames);
      } else {
        qs.delete("tagNames");
      }
    }
    router.push(`/flashcards?${qs.toString()}`);
  };

  const toggleLayout = () => {
    const next = layout === "board" ? "table" : "board";
    updateUrl({ layout: next, page, size });
  };

  const setLayout = (next: "board" | "table") => {
    updateUrl({ layout: next, page, size });
  };

  const handleClearSearch = () => {
    setTagSearch("");
    updateUrl({ tagNames: "", page: 1 });
  };

  const handleTagChange = (values: string[]) => {
    if (!values.length) {
      handleClearSearch();
      return;
    }
    setTagSearch("");
    updateUrl({ tagNames: values.join(","), page: 1 });
  };

  const handleTagSearch = (value: string) => {
    setTagSearch(value.trim());
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

      {/* Tag Filter */}
      <div className="mb-6">
        <Space.Compact style={{ width: '100%', maxWidth: 400 }}>
          <Select<string>
            mode="multiple"
            showSearch
            placeholder="Filter by tag name..."
            values={selectedTagNames}
            options={tagOptions}
            onChange={handleTagChange}
            onSearch={handleTagSearch}
            allowClear
            onClear={handleClearSearch}
            filterOption={false}
            loading={isTagsFetching}
            notFoundContent={isTagsFetching ? "Loading..." : "No tags found"}
            style={{ width: "100%" }}
          />
          {selectedTagNames.length > 0 && (
            <Button 
              icon={<ClearOutlined />} 
              onClick={handleClearSearch}
              title="Clear filter"
            />
          )}
        </Space.Compact>
      </div>

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
const BoardView = ({ items }: { items: FlashcardType[] }) => {
  const [cards, setCards] = useState(items);
  const [flipAll, setFlipAll] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);
  const [editingCard, setEditingCard] = useState<FlashcardType | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isCreateOpen, setCreateOpen] = useState(false);
  const [form] = Form.useForm();
  const [createForm] = Form.useForm();
  const updateFlashcard = useUpdateFlashcard();
  const createFlashcard = useCreateFlashcard();
  const deleteFlashcard = useDeleteFlashcard();
  const { message, modal } = App.useApp();
  const {
    data: tagResponse,
    isFetching: isTagsFetching,
  } = useListTags({ page: 1, size: 100 });

  const availableTags = useMemo(
    () => tagResponse?.data?.items ?? [],
    [tagResponse]
  );

  const tagOptions = useMemo(() => {
    const knownNames = new Set<string>();
    const base = availableTags.map((tag) => {
      knownNames.add(tag.name);
      return { label: tag.name, value: tag.name };
    });

    if (editingCard?._tags?.length) {
      editingCard._tags.forEach((tag) => {
        if (!knownNames.has(tag.name)) {
          base.push({ label: tag.name, value: tag.name });
        }
      });
    }

    return base;
  }, [availableTags, editingCard]);

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

  const handleEdit = (card: FlashcardType) => {
    setEditingCard(card);
    form.setFieldsValue({
      front: card.front,
      back: card.back,
      tagNames: card._tags?.map((tag) => tag.name) ?? [],
    });
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
      const { front, back, tagNames } = values as {
        front: string;
        back: string;
        tagNames?: string[];
      };
      await updateFlashcard.mutateAsync({
        id: editingCard.id,
        front,
        back,
        tagNames,
      });
      // Ensure the board and modal reflect tag changes immediately instead of waiting for the refetch.
      // We build a quick lookup using any tags we already know about (query results + the card itself),
      // so the UI can reuse full Tag objects when possible and still fall back to a minimal stub if
      // the server doesn't return the tag in the latest query response.
      const tagLookup = new Map<string, Tag>();
      availableTags.forEach((tag) => tagLookup.set(tag.name, tag));
      editingCard._tags?.forEach((tag) => {
        if (!tagLookup.has(tag.name)) {
          tagLookup.set(tag.name, tag);
        }
      });
      const nextTags = (tagNames ?? []).map((name) => tagLookup.get(name) ?? { id: name, name });
      setCards((prev) =>
        prev.map((card) =>
          card.id === editingCard.id
            ? { ...card, front, back, _tags: nextTags }
            : card
        )
      );
      setEditingCard((prev) =>
        prev ? { ...prev, front, back, _tags: nextTags } : prev
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
      const { front, back, tagNames } = values as {
        front: string;
        back: string;
        tagNames?: string[];
      };
      await createFlashcard.mutateAsync({
        front,
        back,
        tagNames,
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

  const handleDelete = (card: FlashcardType) => {
    modal.confirm({
      title: "Delete flashcard?",
      content: "This action cannot be undone.",
      okText: "Delete",
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          await deleteFlashcard.mutateAsync({ id: card.id });
          setCards((prev) => prev.filter((c) => c.id !== card.id));
          if (editingCard?.id === card.id) {
            handleModalClose();
          }
          message.success("Flashcard deleted");
        } catch (err) {
          message.error("Failed to delete flashcard");
          throw err;
        }
      },
    });
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
          <Flashcard key={c.id} card={c} flipAll={flipAll} onEdit={handleEdit} onDelete={handleDelete} />
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
          <Form.Item name="tagNames" label="Tags">
            <Select
              mode="multiple"
              placeholder="Select tags"
              options={tagOptions}
              loading={isTagsFetching}
              allowClear
              showSearch
              optionFilterProp="label"
            />
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
          <Form.Item name="tagNames" label="Tags">
            <Select
              mode="multiple"
              placeholder="Select tags"
              options={tagOptions}
              loading={isTagsFetching}
              allowClear
              showSearch
              optionFilterProp="label"
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

// -----------------------------
// SimpleTable
// -----------------------------
const SimpleTable = ({ items }: { items: FlashcardType[] }) => {
  const renderCell = useCallback(
    (value: string) => (
      <span className="flashcards-table-text" title={value}>
        {value}
      </span>
    ),
    []
  );

  const columns = useMemo<ColumnsType<FlashcardType>>(
    () => [
      {
        title: "Id",
        dataIndex: "id",
        key: "id",
        width: "10%",
        render: renderCell,
        onCell: () => ({ className: "flashcards-table-cell" }),
      },
      {
        title: "Front",
        dataIndex: "front",
        key: "front",
        width: "45%",
        render: renderCell,
        onCell: () => ({ className: "flashcards-table-cell" }),
      },
      {
        title: "Back",
        dataIndex: "back",
        key: "back",
        width: "45%",
        render: renderCell,
        onCell: () => ({ className: "flashcards-table-cell" }),
      },
    ],
    [renderCell]
  );

  return (
    <Table
      className="flashcards-table"
      rowKey={(r) => r.id}
      dataSource={items}
      columns={columns}
      pagination={false}
      tableLayout="fixed"
    />
  );
};

export default FlashcardsPage;
