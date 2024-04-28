import React from 'react';

import { UserRequestStatus } from '@/types/user-request';

export function InProgressSpan() {
  return (
    <div className="align-items-center flex">
      <i className="pi pi-spinner mr-2" />
      <span className="customer-badge  status-negotiation font-semibold">
        Опрацювання
      </span>
    </div>
  );
}

export function CompletedSpan() {
  return (
    <div className="align-items-center flex">
      <i className="pi pi-check mr-2" />
      <span className="customer-badge status-qualified font-semibold">
        Виконаний
      </span>
    </div>
  );
}

export function NewSpan() {
  return (
    <div className="align-items-center flex">
      <i className="pi pi-tag mr-2" />
      <span className="customer-badge status-new  font-semibold">Новий</span>
    </div>
  );
}

export const statusComponentMap = {
  [UserRequestStatus.Completed]: CompletedSpan,
  [UserRequestStatus.New]: NewSpan,
  [UserRequestStatus.InProgress]: InProgressSpan
};
