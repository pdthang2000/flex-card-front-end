// app/page.tsx
'use client';

import { Button, Card, Input, Layout, Space, Tag } from 'antd';

export default function Home() {
  return (
    <Layout className="min-h-screen">
      <Layout.Header className="flex items-center justify-between">
        <div className="text-white text-lg font-semibold">Flashcards</div>
        <Space>
          <Tag color="blue">Next.js</Tag>
          <Tag color="green">Antd</Tag>
          <Tag color="geekblue">Tailwind</Tag>
        </Space>
      </Layout.Header>

      <Layout.Content className="p-6">
        <div className="mx-auto max-w-3xl space-y-4">
          <Card className="shadow-sm">
            <div className="flex items-center gap-3">
              <Input placeholder="Search tags or flashcards…" className="flex-1" />
              <Button type="primary">Search</Button>
            </div>
          </Card>

          <Card title="It works!" className="shadow-sm">
            <p className="text-sm text-gray-600">
              Ant Design components + Tailwind utilities are both active. You can start building.
            </p>
            <div className="mt-4">
              <Space>
                <Button type="primary">Primary</Button>
                <Button>Default</Button>
                <Button danger>Danger</Button>
              </Space>
            </div>
          </Card>
        </div>
      </Layout.Content>
    </Layout>
  );
}
