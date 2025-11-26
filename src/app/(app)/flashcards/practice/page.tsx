'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button, Flex, Form, Input, Modal, Pagination, Select, Space, Spin, App } from "antd";
import { LeftOutlined, RightOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { useSearchParams, useRouter } from "next/navigation";
import { useListFlashcards, useUpdateFlashcard, useCreateFlashcard, useDeleteFlashcard } from "@/hooks/useFlashcards";
import { useListTags } from "@/hooks/useTags";
import type { Flashcard as FlashcardType, Tag } from "@/types";
import "../flashcards.scss";
import Flashcard from "../Flashcard";

const PracticePage = () => {
  const sp = useSearchParams();
  const router = useRouter();

  const page = Number(sp.get("page") ?? 1);
  const size = Number(sp.get("size") ?? 20);
  const layout = sp.get("layout") ?? "board";
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

  const joinedTagNames = selectedTagNames.length ? selectedTagNames.join(",") : undefined;

  const { data, isFetching, isLoading, isError } = useListFlashcards({
    tagNames: joinedTagNames,
    frontContains: frontContainsParam || undefined,
    backContains: backContainsParam || undefined,
    page,
    size,
  });
  const { message, modal } = App.useApp();
  const isLoadingFlashcards = isLoading || isFetching;

  const items = data?.data?.items ?? [];
  const pagination = data?.data?.pagination;
  const total = pagination?.total ?? 0;
  const currentPage = pagination?.page ?? page;
  const pageSize = pagination?.size ?? size;

  const [cards, setCards] = useState(items);
  const [flipAll, setFlipAll] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);
  const [practiceIndex, setPracticeIndex] = useState(0);
  const [editingCard, setEditingCard] = useState<FlashcardType | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isCreateOpen, setCreateOpen] = useState(false);
  const [form] = Form.useForm();
  const [createForm] = Form.useForm();
  const updateFlashcard = useUpdateFlashcard();
  const createFlashcard = useCreateFlashcard();
  const deleteFlashcard = useDeleteFlashcard();

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

  const activePracticeCard = cards[practiceIndex] ?? null;
  const activePracticeCardIdRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    activePracticeCardIdRef.current = cards[practiceIndex]?.id;
  }, [cards, practiceIndex]);

  useEffect(() => {
    setCards(items);

    if (!items.length) {
      setPracticeIndex(0);
      setFlipAll(false);
      setIsShuffled(false);
      return;
    }

    const activeCardId = activePracticeCardIdRef.current;
    if (activeCardId) {
      const nextIndex = items.findIndex((card) => card.id === activeCardId);
      if (nextIndex >= 0) {
        setPracticeIndex(nextIndex);
        setFlipAll(false);
        setIsShuffled(false);
        return;
      }
    }

    setPracticeIndex((prev) => {
      const fallback = Math.min(prev, items.length - 1);
      return fallback >= 0 ? fallback : 0;
    });
    setFlipAll(false);
    setIsShuffled(false);
  }, [items]);

  useEffect(() => {
    if (!cards.length) {
      setPracticeIndex(0);
      return;
    }
    setPracticeIndex((prev) => Math.min(prev, cards.length - 1));
  }, [cards.length]);

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
    setPracticeIndex(0);
  };

  const showPreviousPracticeCard = useCallback(() => {
    if (!cards.length) {
      return;
    }
    setPracticeIndex((prev) => (prev - 1 + cards.length) % cards.length);
  }, [cards.length]);

  const showNextPracticeCard = useCallback(() => {
    if (!cards.length) {
      return;
    }
    setPracticeIndex((prev) => (prev + 1) % cards.length);
  }, [cards.length]);

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

  const handlePageChange = (nextPage: number, nextSize?: number) => {
    const qs = new URLSearchParams(sp.toString());
    qs.set("page", String(nextPage));
    qs.set("size", String(nextSize ?? pageSize));
    router.push(`/flashcards/practice?${qs.toString()}`);
  };

  const handleBackToList = () => {
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
    router.push(`/flashcards?${qs.toString()}`);
  };

  const renderActiveCard = () => {
    if (!activePracticeCard) {
      return (
        <div className="flex h-64 w-full items-center justify-center rounded-2xl border border-dashed border-slate-600 text-slate-300">
          No flashcards available.
        </div>
      );
    }

    return (
      <>
        <div className="flex w-full justify-center">
          <Flashcard
            key={activePracticeCard.id}
            card={activePracticeCard}
            flipAll={flipAll}
            onEdit={handleEdit}
            onDelete={handleDelete}
            variant="large"
          />
        </div>
        <div className="flashcard-practice-nav flex items-center gap-6">
          <Button
            className="flashcard-practice-nav__control flashcard-practice-nav__control--prev"
            size="large"
            icon={<LeftOutlined />}
            onClick={showPreviousPracticeCard}
            aria-label="Previous card"
            disabled={cards.length <= 1}
          />
          <span className="flashcard-practice-nav__counter">
            {cards.length ? `${practiceIndex + 1}/${cards.length}` : "0/0"}
          </span>
          <Button
            className="flashcard-practice-nav__control flashcard-practice-nav__control--next"
            type="primary"
            size="large"
            icon={<RightOutlined />}
            onClick={showNextPracticeCard}
            aria-label="Next card"
            disabled={cards.length <= 1}
          />
        </div>
      </>
    );
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <Flex justify="space-between" align="center" className="mb-6">
        <Space>
          <Button icon={<ArrowLeftOutlined />} onClick={handleBackToList}>
            Back to list
          </Button>
          <h1 className="text-2xl font-semibold tracking-wide">Practice</h1>
        </Space>
        <Space>
          <Button className="flashcard-action-btn w-full sm:w-auto" type={isShuffled ? "primary" : "default"} onClick={toggleShuffle}>
            {isShuffled ? "Shuffled" : "Shuffle"}
          </Button>
          <Button className="flashcard-action-btn w-full sm:w-auto" type={flipAll ? "primary" : "default"} onClick={() => setFlipAll((s) => !s)}>
            {flipAll ? "Unflip All" : "Flip All"}
          </Button>
          <Button className="flashcard-action-btn w-full sm:w-auto" type="primary" onClick={handleOpenCreate}>
            Add
          </Button>
        </Space>
      </Flex>

      <div className="mb-4 text-sm text-slate-300">
        <span className="font-semibold text-slate-100">Filters:</span>{" "}
        {selectedTagNames.length ? `Tags: ${selectedTagNames.join(", ")}` : "Tags: Any"} |{" "}
        {frontContainsParam ? `Front contains "${frontContainsParam}"` : "Front: Any"} |{" "}
        {backContainsParam ? `Back contains "${backContainsParam}"` : "Back: Any"}
      </div>

      <Spin spinning={isLoadingFlashcards} tip="Loading flashcards..." className="w-full">
        <div className="flashcard-practice-area flex w-full flex-1 flex-col items-center gap-6">
          {renderActiveCard()}
          <div className="flex w-full justify-center">
            <FlashcardsPagination
              page={currentPage}
              size={pageSize}
              total={total}
              onChange={handlePageChange}
            />
          </div>
        </div>
      </Spin>

      {isError && (
        <div className="text-red-400 mt-4">Failed to load flashcards.</div>
      )}

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
    </div>
  );
};

type FlashcardsPaginationProps = {
  page: number;
  size: number;
  total: number;
  onChange: (page: number, size: number) => void;
};

const FlashcardsPagination = ({ page, size, total, onChange }: FlashcardsPaginationProps) => {
  return (
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
  );
};

export default PracticePage;
