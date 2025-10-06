// app/providers.tsx
'use client';

import { PropsWithChildren } from 'react';
import { ConfigProvider, theme as antdTheme } from 'antd';
import { StyleProvider } from '@ant-design/cssinjs';

export default function Providers({ children }: PropsWithChildren) {
  return (
    <StyleProvider hashPriority="high">
      <ConfigProvider
        theme={{
          algorithm: antdTheme.defaultAlgorithm,
          token: {
            borderRadius: 8,
            fontSize: 14,
          },
        }}
      >
        {children}
      </ConfigProvider>
    </StyleProvider>
  );
}
