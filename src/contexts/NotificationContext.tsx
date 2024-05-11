import React, { useState } from 'react';
import { notification, Button } from 'antd';
import type { NotificationPlacement } from 'antd/es/notification/interface';

interface INotificationContext {
  showNotification: (
    message: any,
    description: any,
    placement: NotificationPlacement,
  ) => void;
}
const NotificationContext = React.createContext<INotificationContext>({
  showNotification: () => {},
});

const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
  const [api, contextHolder] = notification.useNotification();
  const showNotification = (
    message: any,
    description: any,
    placement: NotificationPlacement,
  ) => {
    api.info({
      message,
      description,
      placement,
    });
  };
  return (
    <NotificationContext.Provider
      value={{
        showNotification,
      }}
    >
      {contextHolder}
      {children}
    </NotificationContext.Provider>
  );
};