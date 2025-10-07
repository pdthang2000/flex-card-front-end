"use client";

import { useState } from "react";
import { Table, Pagination, Form, Input, Button, Flex, App } from "antd";
import { useListFlashcards, useCreateFlashcard, Flashcard } from "@/hooks/useFlashcards";

const DEFAULT_SIZE = 20;

export default function HomePage() {
  const { message } = App.useApp();
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(DEFAULT_SIZE);
  const [tagId] = useState<string | undefined>(undefined); // wire later

  const { data, isFetching, isError } = useListFlashcards({ tagId, page, size });
  console.log('data: ', data);
  const create = useCreateFlashcard();

  const items = data?.data?.items ?? [];
  const total = data?.data?.pagination?.total ?? 0;

  const columns = [
    { title: "Front", dataIndex: "front" },
    { title: "Back", dataIndex: "back" },
    { title: "Created", dataIndex: "createdAt", render: (v: string) => new Date(v).toLocaleString() },
  ];

  const onFinish = async (vals: { front: string; back: string }) => {
    try {
      await create.mutateAsync({ front: vals.front, back: vals.back });
      message.success("Created");
    } catch {
      message.error("Create failed");
    }
  };

  return (
    <Flex vertical gap={16}>
      <Form layout="inline" onFinish={onFinish}>
        <Form.Item name="front" rules={[{ required: true, message: "Front is required" }]}>
          <Input placeholder="Front (≤100 chars)" maxLength={100} allowClear />
        </Form.Item>
        <Form.Item name="back" rules={[{ required: true, message: "Back is required" }]}>
          <Input placeholder="Back" allowClear />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={create.isPending}>
            Add
          </Button>
        </Form.Item>
      </Form>

      <Table<Flashcard>
        rowKey="id"
        loading={isFetching}
        dataSource={items}
        columns={columns}
        pagination={false}
      />

      <Pagination
        current={page}
        pageSize={size}
        total={total}
        showSizeChanger
        onChange={(p, s) => {
          setPage(p);
          setSize(s);
        }}
      />

      {isError && <div style={{ color: "red" }}>Failed to load flashcards.</div>}
    </Flex>
  );
}
