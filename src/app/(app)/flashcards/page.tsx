'use client';

import React, { useMemo, useState, useEffect, useCallback } from "react";
import { Segmented, Button, Table, Space, Flex, Modal, Form, Input, App, Select, Pagination, Spin } from "antd";
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
  const frontContainsParam = sp.get("frontContains") ?? "";
  const backContainsParam = sp.get("backContains") ?? "";
  const selectedTagNames = useMemo(
    () =>
      tagNamesParam
        .split(",")
        .map((name) => name.trim())
        .filter(Boolean),
    [tagNamesParam]
  );

  const [tagSearch, setTagSearch] = useState("");
  const [frontContains, setFrontContains] = useState(frontContainsParam);
  const [backContains, setBackSearch] = useState(backContainsParam);

  useEffect(() => {
    setFrontContains(frontContainsParam);
  }, [frontContainsParam]);

  useEffect(() => {
    setBackSearch(backContainsParam);
  }, [backContainsParam]);

  const joinedTagNames = selectedTagNames.length ? selectedTagNames.join(",") : undefined;

  const { data, isError, isFetching, isLoading } = useListFlashcards({
    tagNames: joinedTagNames,
    frontContains: frontContainsParam || undefined,
    backContains: backContainsParam || undefined,
    page,
    size,
  });
  const [forceLoading, setForceLoading] = useState(false);

  useEffect(() => {
    if (isLoading || isFetching) {
      setForceLoading(true);
      const timer = setTimeout(() => setForceLoading(false), 300);
      return () => clearTimeout(timer);
    }
    const timer = setTimeout(() => setForceLoading(false), 300);
    return () => clearTimeout(timer);
  }, [isLoading, isFetching]);

  const isLoadingFlashcards = isLoading || isFetching || forceLoading;

  const { data: tagResponse, isFetching: isTagsFetching } = useListTags({
    page: 1,
    size: 50,
    name: tagSearch || undefined,
  });
  const items = data?.data?.items ?? [];
  const pagination = data?.data?.pagination;
  const total = pagination?.total ?? 0;
  const currentPage = pagination?.page ?? page;
  const pageSize = pagination?.size ?? size;

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

  const updateUrl = (updates: { layout?: string; page?: number; size?: number; tagNames?: string; front?: string; back?: string }) => {
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
    if (updates.front !== undefined) {
      if (updates.front) {
        qs.set("frontContains", updates.front);
      } else {
        qs.delete("frontContains");
      }
    }
    if (updates.back !== undefined) {
      if (updates.back) {
        qs.set("backContains", updates.back);
      } else {
        qs.delete("backContains");
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

  const commitFrontSearch = (raw: string) => {
    const next = raw.trim();
    updateUrl({ front: next, page: 1 });
  };

  const commitBackSearch = (raw: string) => {
    const next = raw.trim();
    updateUrl({ back: next, page: 1 });
  };

  const handleFrontInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setFrontContains(value);
    if (!value) {
      updateUrl({ front: "", page: 1 });
    }
  };

  const handleBackInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setBackSearch(value);
    if (!value) {
      updateUrl({ back: "", page: 1 });
    }
  };

  const handlePageChange = (nextPage: number, nextSize?: number) => {
    updateUrl({ page: nextPage, size: nextSize ?? pageSize });
  };

  const goToPractice = () => {
    const qs = new URLSearchParams();
    qs.set("page", String(page));
    qs.set("size", String(size));
    qs.set("layout", layout);
    if (selectedTagNames.length) {
      qs.set("tagNames", selectedTagNames.join(","));
    }
    if (frontContainsParam) {
      qs.set("frontContains", frontContainsParam);
    }
    if (backContainsParam) {
      qs.set("backContains", backContainsParam);
    }
    router.push(`/flashcards/practice?${qs.toString()}`);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6 ">
      <Flex justify="space-between" align="center" className="mb-6">
        <h1 className="text-2xl font-semibold tracking-wide">Flashcards</h1>
        <Space>
          <Button type="primary" onClick={toggleLayout}>
            Switch to {layout === "board" ? "Table" : "Board"} View
          </Button>
          <Button onClick={goToPractice}>Practice</Button>
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

      {/* Tag & Text Filters */}
      <div className="mb-6">
        <div className="flex w-full max-w-2xl flex-col gap-4">
          <div className="flex w-full flex-col gap-2">
            <Select<string>
              mode="multiple"
              showSearch
              placeholder="Filter by tag name..."
              value={selectedTagNames}
              options={tagOptions}
              onChange={handleTagChange}
              onSearch={handleTagSearch}
              allowClear
              onClear={handleClearSearch}
              filterOption={false}
              loading={isTagsFetching}
              notFoundContent={isTagsFetching ? "Loading..." : "No tags found"}
              style={{ width: "100%", maxWidth: 400 }}
            />
          </div>
          <div className="flex w-full flex-col gap-3">
            <Input.Search
              value={frontContains}
              onChange={handleFrontInputChange}
              onSearch={commitFrontSearch}
              allowClear
              placeholder="Search front text..."
              enterButton
            />
            <Input.Search
              value={backContains}
              onChange={handleBackInputChange}
              onSearch={commitBackSearch}
              allowClear
              placeholder="Search back text..."
              enterButton
            />
          </div>
        </div>
      </div>

      <Spin spinning={isLoadingFlashcards} tip="Loading flashcards..." className="w-full">
        {layout === "board" ? (
          <BoardView
            items={items}
            page={currentPage}
            size={pageSize}
            total={total}
            onPageChange={handlePageChange}
          />
        ) : (
          <SimpleTable items={items} />
        )}
      </Spin>

      {isError && (
        <div className="text-red-400 mt-4">Failed to load flashcards.</div>
      )}
    </div>
  );
};

// BoardView
// -----------------------------
type BoardViewProps = {
  items: FlashcardType[];
  page: number;
  size: number;
  total: number;
  onPageChange: (page: number, size: number) => void;
};

const BoardView = ({ items, page, size, total, onPageChange }: BoardViewProps) => {
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
      <div className="flashcard-actions mb-4 flex w-full flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center sm:gap-3">
          <Button className="flashcard-action-btn w-full sm:w-auto" type="primary" onClick={handleOpenCreate}>
            Add
          </Button>
          <Button
            className="flashcard-action-btn w-full sm:w-auto"
            type={isShuffled ? "primary" : "default"}
            onClick={toggleShuffle}
          >
            {isShuffled ? "Shuffled" : "Shuffle"}
          </Button>
          <Button
            className="flashcard-action-btn w-full sm:w-auto"
            type={flipAll ? "primary" : "default"}
            onClick={() => setFlipAll((s) => !s)}
          >
            {flipAll ? "Unflip All" : "Flip All"}
          </Button>
        </div>
        <div className="flex w-full sm:flex-1 sm:justify-end">
          <FlashcardsPagination
            page={page}
            size={size}
            total={total}
            onChange={onPageChange}
            containerClassName="w-full sm:w-auto sm:flex-none"
          />
        </div>
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

type FlashcardsPaginationProps = {
  page: number;
  size: number;
  total: number;
  onChange: (page: number, size: number) => void;
  containerClassName?: string;
};

const FlashcardsPagination = ({ page, size, total, onChange, containerClassName }: FlashcardsPaginationProps) => {
  const containerClasses = ["flex justify-end", containerClassName ?? "w-full"].join(" ");
  return (
    <div className={containerClasses}>
      <Pagination
        className="flashcard-pagination"
        current={page}
        total={total}
        pageSize={size}
        showSizeChanger
        showLessItems
        responsive
        onChange={(nextPage, nextSize) => onChange(nextPage, nextSize ?? size)}
        onShowSizeChange={(_, nextSize) => onChange(1, nextSize)}
        pageSizeOptions={["10", "20", "30", "50"]}
      />
    </div>
  );
};
