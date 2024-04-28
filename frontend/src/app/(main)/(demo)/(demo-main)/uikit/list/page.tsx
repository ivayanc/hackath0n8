'use client';

import { Button } from 'primereact/button';
import { DataView, DataViewLayoutOptions } from 'primereact/dataview';
import type { DropdownChangeEvent } from 'primereact/dropdown';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { OrderList } from 'primereact/orderlist';
import { PickList } from 'primereact/picklist';
import { Rating } from 'primereact/rating';
import React, { useEffect, useState } from 'react';

import { ProductService } from '@/service/ProductService';
import type { Demo } from '@/types';

const ListDemo = () => {
  const listValue = [
    { name: 'San Francisco', code: 'SF' },
    { name: 'London', code: 'LDN' },
    { name: 'Paris', code: 'PRS' },
    { name: 'Istanbul', code: 'IST' },
    { name: 'Berlin', code: 'BRL' },
    { name: 'Barcelona', code: 'BRC' },
    { name: 'Rome', code: 'RM' }
  ];
  const [picklistSourceValue, setPicklistSourceValue] = useState(listValue);
  const [picklistTargetValue, setPicklistTargetValue] = useState([]);
  const [orderlistValue, setOrderlistValue] = useState(listValue);
  const [dataViewValue, setDataViewValue] = useState<Demo.Product[]>([]);
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [filteredValue, setFilteredValue] = useState<Demo.Product[] | null>(
    null
  );
  const [layout, setLayout] = useState<
    'grid' | 'list' | (string & Record<string, unknown>)
  >('grid');
  const [sortKey, setSortKey] = useState(null);
  const [sortOrder, setSortOrder] = useState<0 | 1 | -1 | null>(null);
  const [sortField, setSortField] = useState('');

  const sortOptions = [
    { label: 'Price High to Low', value: '!price' },
    { label: 'Price Low to High', value: 'price' }
  ];

  useEffect(() => {
    ProductService.getProducts().then(data => setDataViewValue(data));
    setGlobalFilterValue('');
  }, []);

  useEffect(() => {
    ProductService.getProducts().then(data => setDataViewValue(data));
    setGlobalFilterValue('');
  }, []);

  const onFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setGlobalFilterValue(value);
    if (value.length === 0) {
      setFilteredValue(null);
    } else {
      const filtered = dataViewValue?.filter(product => {
        const productNameLowercase = product.name.toLowerCase();
        const searchValueLowercase = value.toLowerCase();
        return productNameLowercase.includes(searchValueLowercase);
      });

      setFilteredValue(filtered);
    }
  };

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

  const dataViewHeader = (
    <div className="flex-column md:justify-content-between flex gap-2 md:flex-row">
      <Dropdown
        value={sortKey}
        options={sortOptions}
        optionLabel="label"
        placeholder="Sort By Price"
        onChange={onSortChange}
      />
      <span className="p-input-icon-left">
        <i className="pi pi-search" />
        <InputText
          value={globalFilterValue}
          onChange={onFilter}
          placeholder="Search by Name"
        />
      </span>
      <DataViewLayoutOptions
        layout={layout}
        onChange={e => setLayout(e.value)}
      />
    </div>
  );

  const dataviewListItem = (data: Demo.Product) => {
    return (
      <div className="col-12">
        <div className="flex-column align-items-center flex w-full p-3 md:flex-row">
          <img
            src={`/demo/images/product/${data.image}`}
            alt={data.name}
            className="md:w-10rem shadow-2 my-4 mr-5 w-9 md:my-0"
          />
          <div className="flex-column align-items-center flex flex-1 text-center md:text-left">
            <div className="text-2xl font-bold">{data.name}</div>
            <div className="mb-2">{data.description}</div>
            <Rating
              value={data.rating}
              readOnly
              cancel={false}
              className="mb-2"
            />
            <div className="align-items-center flex">
              <i className="pi pi-tag mr-2" />
              <span className="font-semibold">{data.category}</span>
            </div>
          </div>
          <div className="md:flex-column justify-content-between align-items-center md:align-items-end mt-5 flex w-full flex-row md:mt-0 md:w-auto">
            <span className="align-self-center md:align-self-end mb-2 text-2xl font-semibold">
              ${data.price}
            </span>
            <Button
              icon="pi pi-shopping-cart"
              label="Add to Cart"
              disabled={data.inventoryStatus === 'OUTOFSTOCK'}
              size="small"
              className="mb-2"
            />
            <span
              className={`product-badge status-${data.inventoryStatus?.toLowerCase()}`}
            >
              {data.inventoryStatus}
            </span>
          </div>
        </div>
      </div>
    );
  };

  const dataviewGridItem = (data: Demo.Product) => {
    return (
      <div className="col-12 lg:col-4">
        <div className="card border-1 surface-border m-3">
          <div className="align-items-center justify-content-between mb-2 flex flex-wrap gap-2">
            <div className="align-items-center flex">
              <i className="pi pi-tag mr-2" />
              <span className="font-semibold">{data.category}</span>
            </div>
            <span
              className={`product-badge status-${data.inventoryStatus?.toLowerCase()}`}
            >
              {data.inventoryStatus}
            </span>
          </div>
          <div className="flex-column align-items-center mb-3 flex text-center">
            <img
              src={`/demo/images/product/${data.image}`}
              alt={data.name}
              className="shadow-2 mx-0 my-3 w-9"
            />
            <div className="text-2xl font-bold">{data.name}</div>
            <div className="mb-3">{data.description}</div>
            <Rating value={data.rating} readOnly cancel={false} />
          </div>
          <div className="align-items-center justify-content-between flex">
            <span className="text-2xl font-semibold">${data.price}</span>
            <Button
              icon="pi pi-shopping-cart"
              disabled={data.inventoryStatus === 'OUTOFSTOCK'}
            />
          </div>
        </div>
      </div>
    );
  };

  const itemTemplate = (
    data: Demo.Product,
    layout: 'grid' | 'list' | (string & Record<string, unknown>)
  ) => {
    if (!data) {
      return;
    }

    if (layout === 'list') {
      return dataviewListItem(data);
    }
    if (layout === 'grid') {
      return dataviewGridItem(data);
    }
  };

  return (
    <div className="grid">
      <div className="col-12">
        <div className="card">
          <h5>DataView</h5>
          <DataView
            value={filteredValue || dataViewValue}
            layout={layout}
            paginator
            rows={9}
            sortOrder={sortOrder}
            sortField={sortField}
            itemTemplate={itemTemplate}
            header={dataViewHeader}
          />
        </div>
      </div>

      <div className="col-12 xl:col-8">
        <div className="card">
          <h5>PickList</h5>
          <PickList
            source={picklistSourceValue}
            target={picklistTargetValue}
            sourceHeader="From"
            targetHeader="To"
            itemTemplate={item => <div>{item.name}</div>}
            onChange={e => {
              setPicklistSourceValue(e.source);
              setPicklistTargetValue(e.target);
            }}
            sourceStyle={{ height: '200px' }}
            targetStyle={{ height: '200px' }}
          />
        </div>
      </div>

      <div className="col-12 xl:col-4">
        <div className="card">
          <h5>OrderList</h5>
          <OrderList
            value={orderlistValue}
            listStyle={{ height: '200px' }}
            className="p-orderlist-responsive"
            header="Cities"
            itemTemplate={item => <div>{item.name}</div>}
            onChange={e => setOrderlistValue(e.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default ListDemo;
