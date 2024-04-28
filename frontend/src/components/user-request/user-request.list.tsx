import { Button } from 'primereact/button';
import { DataView, DataViewLayoutOptions } from 'primereact/dataview';
import { Dialog } from 'primereact/dialog';
import type { DropdownChangeEvent } from 'primereact/dropdown';
import { Dropdown } from 'primereact/dropdown';
import React, { useEffect, useState } from 'react';

import { statusComponentMap } from '@/components/user-request/user-request.status';
import UserRequestService from '@/service/UserRequestService';
import type { UserRequest } from '@/types/user-request';
import { UserRequestStatus } from '@/types/user-request';

const statusOptions = [
  { label: 'Усі', value: '' },
  { label: 'Виконані', value: UserRequestStatus.Completed },
  { label: 'Опрацювання', value: UserRequestStatus.InProgress }
];

export default function UserRequestList({
  initialUserRequests,
  showFilterOptions
}: {
  initialUserRequests: UserRequest[];
  showFilterOptions: boolean;
}) {
  const [userRequests, setUserRequests] =
    useState<UserRequest[]>(initialUserRequests);
  const [filteredValue, setFilteredValue] = useState<UserRequest[] | null>(
    null
  );
  const [sortKey, setSortKey] = useState('!created_at');
  const [sortOrder, setSortOrder] = useState<0 | 1 | -1>(-1);
  const [sortField, setSortField] = useState<string>('created_at');

  const sortOptions = [
    { label: 'Нові спочатку', value: '!created_at' },
    { label: 'Старі спочатку', value: 'created_at' }
  ];
  const [layout, setLayout] = useState<
    'grid' | 'list' | (string & Record<string, unknown>)
  >('grid');

  const [selectedRequest, setSelectedRequest] = useState<UserRequest | null>(
    null
  );
  const [dialogVisible, setDialogVisible] = useState(false);

  const openDialog = (request: UserRequest) => {
    setSelectedRequest(request);
    setDialogVisible(true);
  };

  const closeDialog = () => {
    setSelectedRequest(null);
    setDialogVisible(false);
  };

  const handleComplete = (requestId: string) => {
    const updatedRequests = userRequests.map(request =>
      request.id === requestId
        ? { ...request, status: UserRequestStatus.Completed }
        : request
    );
    setUserRequests(updatedRequests);
    const filteredUpdatedRequests = userRequests.map(request =>
      request.id === requestId
        ? { ...request, status: UserRequestStatus.Completed }
        : request
    );
    setFilteredValue(filteredUpdatedRequests);
    UserRequestService.completeRequest({ requestId }).then(() => {
      closeDialog();
    });
  };

  const handleTakeInProgress = (requestId: string) => {
    const updatedRequests = userRequests.filter(
      request => request.id !== requestId
    );

    setUserRequests(updatedRequests);

    UserRequestService.startRequestProcessing({ requestId }).then(() => {
      closeDialog();
    });
  };

  const getStatusLabel = (status: UserRequestStatus) => {
    return statusComponentMap[status] ? statusComponentMap[status]() : null;
  };

  const inProgressButton = (requestId: string) => {
    return (
      <Button
        label="Завершити"
        type="button"
        size="small"
        onClick={() => handleComplete(requestId)}
      />
    );
  };

  const newButton = (requestId: string) => {
    return (
      <Button
        label="Взяти в опрацювання"
        type="button"
        size="small"
        onClick={() => handleTakeInProgress(requestId)}
      />
    );
  };

  const completedButton = () => {
    return <Button label="Виконаний" type="button" disabled size="small" />;
  };

  const shortDescription = (longDescription: string) => {
    return (
      <span className="font-semibold">
        {longDescription.length > 30
          ? `${longDescription.slice(0, 30)}...`
          : longDescription}
      </span>
    );
  };

  const dialogContent = selectedRequest ? (
    <div className="m-1 ">
      <div className="align-items-center justify-content-between mb-3 flex flex-wrap gap-2">
        {getStatusLabel(selectedRequest.status)}
        <div>{selectedRequest.created_at}</div>
      </div>
      <div className="flex-column align-items-start mb-3 flex text-start">
        <div className="text-2xl font-bold">{selectedRequest.category}</div>
        <div className="mb-3">{selectedRequest.name}</div>
        <div>{selectedRequest.description}</div>
        {showFilterOptions && (
          <div className="mt-3">
            <div className="mb-3">
              <strong>Замовник:</strong> {selectedRequest.full_name}
            </div>
            <div className="mb-3">
              <strong>Номер телефону:</strong> {selectedRequest.phone_number}
            </div>
          </div>
        )}
      </div>
      <div className="flex-column align-items-center mb-3 flex text-center">
        <div className="mt-2">
          {selectedRequest.status === UserRequestStatus.New &&
            newButton(selectedRequest.id)}
          {selectedRequest.status === UserRequestStatus.InProgress &&
            inProgressButton(selectedRequest.id)}
          {selectedRequest.status === UserRequestStatus.Completed &&
            completedButton()}
        </div>
      </div>
    </div>
  ) : null;

  const onSortChange = (event: DropdownChangeEvent) => {
    const { value } = event;
    if (value.indexOf('!') === 0) {
      setSortOrder(-1);
      setSortField(value.substring(1, value.length));
      setSortKey(value);
    } else {
      setSortOrder(1);
      setSortField(value);
      setSortKey(value);
    }
  };

  const [selectedStatus, setSelectedStatus] = useState('');

  useEffect(() => {
    if (userRequests.length === 0) {
      setUserRequests(initialUserRequests);
    }
    const filterRequests = () => {
      let filtered = userRequests;
      if (selectedStatus) {
        filtered = filtered.filter(
          request => request.status === selectedStatus
        );
      }
      setFilteredValue(filtered);
    };

    if (showFilterOptions) {
      filterRequests();
    }
  }, [selectedStatus, initialUserRequests]);
  const onStatusChange = e => {
    setSelectedStatus(e.value);
  };

  const dataViewHeader = (
    <div className="flex-column md:justify-content-between flex gap-2 md:flex-row">
      <Dropdown
        value={sortKey}
        options={sortOptions}
        optionLabel="label"
        placeholder="Сортування по даті створення"
        onChange={onSortChange}
        defaultValue="!created_at"
      />
      {showFilterOptions && (
        <Dropdown
          value={selectedStatus}
          options={statusOptions}
          optionLabel="label"
          placeholder="Фільтрація по статусу"
          onChange={onStatusChange}
        />
      )}
      <DataViewLayoutOptions
        layout={layout}
        onChange={e => setLayout(e.value)}
      />
    </div>
  );

  const openDetailButton = (data: UserRequest) => {
    return (
      <Button
        outlined
        type="button"
        size="small"
        label="Детально"
        icon="pi pi-external-link"
        className="mb-2"
        onClick={() => openDialog(data)}
      />
    );
  };

  const userRequestListItem = (data: UserRequest) => {
    return (
      <div className="col-12">
        <div className="flex-column align-items-center flex w-full p-3 md:flex-row">
          <div className="flex-column align-items-center flex flex-1 text-center md:text-left">
            <div className="text-2xl font-bold">{data.category}</div>
            <div className="mb-2">{data.name}</div>
            <div className="align-items-center flex">
              {shortDescription(data.description)}
            </div>
          </div>
          <div className="md:flex-column justify-content-between align-items-center md:align-items-end mr-5 mt-5 flex w-full flex-row md:mt-0 md:w-auto">
            <span className="align-self-center md:align-self-end mb-2">
              {data.created_at}
            </span>
            {getStatusLabel(data.status)}
          </div>
          <div className="md:flex-column justify-content-between align-items-center  mt-5 flex w-full flex-row md:mt-0 md:w-auto">
            {openDetailButton(data)}
          </div>
        </div>
      </div>
    );
  };

  const userRequestGridItem = (data: UserRequest) => {
    return (
      <div className="col-12 lg:col-4">
        <div className="card border-1 surface-border m-3">
          <div className="align-items-center justify-content-between mb-2 flex flex-wrap gap-2">
            {getStatusLabel(data.status)}
            <div>{data.created_at}</div>
          </div>
          <div className="flex-column align-items-center mb-3 flex text-center">
            <div className="text-2xl font-bold">{data.category}</div>
            <div className="mb-3">{data.name}</div>
            {shortDescription(data.description)}
            <div className="mb-3" />
            {openDetailButton(data)}
          </div>
        </div>
      </div>
    );
  };

  type LayoutType = 'grid' | 'list';

  const layoutComponentMap: {
    [K in LayoutType]: (data: UserRequest) => JSX.Element;
  } = {
    list: userRequestListItem,
    grid: userRequestGridItem
  };

  const itemTemplate = (
    data: UserRequest | null,
    itemsLayout: LayoutType | (string & Record<string, unknown>)
  ): JSX.Element | null => {
    if (!data) {
      return null;
    }

    if (typeof itemsLayout === 'string' && itemsLayout in layoutComponentMap) {
      const renderFunction = layoutComponentMap[itemsLayout as LayoutType];
      return renderFunction(data);
    }
    console.error('Unsupported layout type:', itemsLayout);
    return null;
  };
  return (
    <div className="grid">
      <div className="col-12">
        <div className="card">
          <h5>Список запитів</h5>
          <DataView
            value={filteredValue || userRequests}
            layout={layout}
            paginator
            rows={9}
            sortOrder={sortOrder}
            sortField={sortField}
            itemTemplate={itemTemplate}
            header={dataViewHeader}
            emptyMessage={""}
          />
        </div>
      </div>
      <Dialog
        visible={dialogVisible}
        onHide={closeDialog}
        header="Детальна інформація"
        modal
        style={{ width: '50vw' }}
      >
        {dialogContent}
      </Dialog>
    </div>
  );
}
